import { TextFileView, WorkspaceLeaf } from "obsidian";
import { basicSetup,  } from "codemirror";
import { keymap, EditorView } from "@codemirror/view"
import { insertTab, indentLess } from "@codemirror/commands"
import { indentUnit } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { VIEW_TYPE_TXT } from '../constants'
import LoaderPlugin from "../main";

export default class TxtView extends TextFileView {

	public plugin: LoaderPlugin;
	private cmEditor: EditorView;
	private editorEl: any;

	constructor(leaf: WorkspaceLeaf, plugin: LoaderPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	onload(): void {
		super.onload();
		this.editorEl = this.contentEl.createDiv("markdown-source-view mod-cm6");
		this.cmEditor = new EditorView({
			state: EditorState.create({
				extensions: [
					basicSetup,
					keymap.of([
						{
							key: 'Tab',
							preventDefault: true,
							run: insertTab,
						},
						{
							key: 'Shift-Tab',
							preventDefault: true,
							run: indentLess,
						},
					]),
					indentUnit.of("    ")
				],
			}),
			parent: this.editorEl,
		});
		
		this.app.workspace.trigger("codemirror", this.cmEditor);
	}

	// gets the title of the document
	getDisplayText(): string {
		if (this.file) {
			return this.file.basename;
		}
		return "NOFILE";
	}

	clear(): void {
	}

	getViewData(): string {
		return this.cmEditor.state.doc.toString();
	}

	getViewType(): string {
		return VIEW_TYPE_TXT;
	}

	onClose(): Promise<void> {
		return super.onClose();
	}

	setViewData(data: string, clear: boolean): void {
		this.cmEditor.dispatch({ changes: { from: 0, to: this.cmEditor.state.doc.length, insert: data } })
	}
}
