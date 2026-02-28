import { WorkspaceLeaf } from "obsidian";
import { json } from "@codemirror/lang-json";
import { Extension } from "@codemirror/state";
import { VIEW_TYPE_JSONL } from '../constants'
import LoaderPlugin from "../main";
import { getIndentByTabExtension } from "../services/indentation-provider"
import BaseView from "./base-view";

export default class JsonlView extends BaseView {
	constructor(leaf: WorkspaceLeaf, plugin: LoaderPlugin) {
		super(leaf, plugin);
	}

	getViewType(): string {
		return VIEW_TYPE_JSONL;
	}

	public supportsPrettify(): boolean {
		return true;
	}

	protected prettifyContent(content: string): string {
		return content
			.split('\n')
			.filter(line => line.trim())
			.map(line => {
				try {
					return JSON.stringify(JSON.parse(line), null, '\t');
				} catch {
					return line;
				}
			})
			.join('\n\n');
	}

	protected compactContent(content: string): string {
		return content
			.split(/\n\n+/)
			.filter(block => block.trim())
			.map(block => {
				try {
					return JSON.stringify(JSON.parse(block));
				} catch {
					return block.trim();
				}
			})
			.join('\n');
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
