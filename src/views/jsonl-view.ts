import { lintGutter, linter } from "@codemirror/lint";
import { Extension } from "@codemirror/state";
import { VIEW_TYPE_JSONL } from "../constants";
import { getJsonlDiagnostics } from "../services/jsonl-validator";
import JsonView from "./json-view";

export default class JsonlView extends JsonView {
	getViewType(): string {
		return VIEW_TYPE_JSONL;
	}

	protected getEditorExtensions(): Extension[] {
		return [
			...super.getEditorExtensions(),
			linter(view => getJsonlDiagnostics(view.state.doc)),
			lintGutter()
		];
	}
}
