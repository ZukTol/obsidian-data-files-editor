import { WorkspaceLeaf } from "obsidian";
import {Extension} from "@codemirror/state";
import { VIEW_TYPE_TXT } from '../constants'
import LoaderPlugin from "../main";
import {getInsertTabsExtension} from "../services/indentation-provider";
import BaseView from "./base-view";

export default class TxtView extends BaseView {
	constructor(leaf: WorkspaceLeaf, plugin: LoaderPlugin) {
		super(leaf, plugin);
	}
	
	getViewType(): string {
		return VIEW_TYPE_TXT;
	}

	protected getEditorExtensions(): Extension[] {
		let extensions: Extension[];
		extensions = [
			getInsertTabsExtension()
		];
		return extensions;
	}
}
