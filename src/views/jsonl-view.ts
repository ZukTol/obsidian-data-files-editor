import { lintGutter, linter } from "@codemirror/lint";
import { Extension } from "@codemirror/state";
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

	protected getEditorExtensions(): Extension[] {
		return [
			...super.getEditorExtensions(),
			linter(view => this.validator.validate(view.state.doc.toString())),
			lintGutter()
		];
	}
}
