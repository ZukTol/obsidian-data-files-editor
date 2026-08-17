import { lintGutter, linter, setDiagnostics } from "@codemirror/lint";
import { Extension } from "@codemirror/state";
import { Notice } from "obsidian";
import { VIEW_TYPE_JSONL } from "../constants";
import JsonlValidatorWorker from "../services/jsonl-validator";
import JsonView from "./json-view";

export default class JsonlView extends JsonView {
	private readonly validator = new JsonlValidatorWorker();

	getViewType(): string {
		return VIEW_TYPE_JSONL;
	}

	onClose(): Promise<void> {
		this.validator.destroy();
		return super.onClose();
	}

	async save(clear?: boolean): Promise<void> {
		const document = this.cmEditor.state.doc;
		const diagnostics = await this.validator.validate(document.toString());

		if (this.cmEditor.state.doc !== document)
			return;

		this.cmEditor.dispatch(setDiagnostics(this.cmEditor.state, diagnostics));

		const errorCount = diagnostics.filter(diagnostic => diagnostic.severity === "error").length;
		if (errorCount > 0) {
			const errorLabel = errorCount === 1 ? "error" : "errors";
			const fileName = this.file?.name ?? "JSONL file";
			const message = `Cannot save ${fileName}: ${errorCount} validation ${errorLabel}.`;
			new Notice(message);

			if (clear)
				throw new Error(message);

			return;
		}

		await super.save(clear);
	}

	protected getEditorExtensions(): Extension[] {
		return [
			...super.getEditorExtensions(),
			linter(view => this.validator.validate(view.state.doc.toString())),
			lintGutter()
		];
	}
}
