import { WorkspaceLeaf } from "obsidian";
import { json } from "@codemirror/lang-json";
import { Extension } from "@codemirror/state";
import { VIEW_TYPE_JSON } from '../constants'
import LoaderPlugin from "../main";
import { getIndentByTabExtension } from "../services/indentation-provider"
import BaseView from "./base-view";

export default class JsonView extends BaseView {
	constructor(leaf: WorkspaceLeaf, plugin: LoaderPlugin) {
		super(leaf, plugin);
	}

	getViewType(): string {
		return VIEW_TYPE_JSON;
	}
	
    protected getEditorExtensions(): Extension[] {
		let extensions: Extension[];
		extensions = [
			getIndentByTabExtension(),
			json()
		];
		
		return extensions;
    }
}
