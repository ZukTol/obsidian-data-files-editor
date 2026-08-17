import { Diagnostic, lintGutter, linter, setDiagnostics } from "@codemirror/lint";
import { Extension } from "@codemirror/state";
import { Notice } from "obsidian";
import { VIEW_TYPE_JSONL } from "../constants";
import JsonlValidatorWorker, { getJsonlDiagnostics } from "../services/jsonl-validator";
import JsonView from "./json-view";

export default class JsonlView extends JsonView {
	private readonly validator = new JsonlValidatorWorker();
	private workerUnavailable = false;
	private fallbackContent: string | null = null;
	private fallbackDiagnostics: Diagnostic[] = [];
	private validationNoticeShown = false;

	getViewType(): string {
		return VIEW_TYPE_JSONL;
	}

	onClose(): Promise<void> {
		this.validator.destroy();
		return super.onClose();
	}

	async save(clear?: boolean): Promise<void> {
		const document = this.cmEditor.state.doc;
		const diagnostics = await this.validateDocument(document.toString(), true);

		if (this.cmEditor.state.doc !== document)
			return;

		this.cmEditor.dispatch(setDiagnostics(this.cmEditor.state, diagnostics));

		const errorCount = diagnostics.filter(diagnostic => diagnostic.severity === "error").length;
		if (errorCount > 0) {
			const errorLabel = errorCount === 1 ? "error" : "errors";
			const fileName = this.file?.name ?? "JSONL file";
			const message = `Cannot save ${fileName}: ${errorCount} validation ${errorLabel}.`;
			if (!this.validationNoticeShown || clear)
				new Notice(message);
			this.validationNoticeShown = true;

			if (clear)
				throw new Error(message);

			return;
		}

		this.validationNoticeShown = false;
		await super.save(clear);
	}

	protected getEditorExtensions(): Extension[] {
		return [
			...super.getEditorExtensions(),
			linter(view => this.validateDocument(view.state.doc.toString(), false)),
			lintGutter()
		];
	}

	private async validateDocument(content: string, allowSynchronousFallback: boolean): Promise<Diagnostic[]> {
		if (this.workerUnavailable)
			return this.getFallbackDiagnostics(content, allowSynchronousFallback);

		try {
			return await this.validator.validate(content);
		} catch (error) {
			this.workerUnavailable = true;
			console.warn("JSONL validation worker is unavailable; using synchronous validation.", error);
			return this.getFallbackDiagnostics(content, allowSynchronousFallback);
		}
	}

	private getFallbackDiagnostics(content: string, validate: boolean): Diagnostic[] {
		if (content === this.fallbackContent)
			return this.fallbackDiagnostics;

		if (!validate)
			return [];

		this.fallbackContent = content;
		this.fallbackDiagnostics = getJsonlDiagnostics(content);
		return this.fallbackDiagnostics;
	}
}
