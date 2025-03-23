import {TextFileView, WorkspaceLeaf} from "obsidian";
import LoaderPlugin from "../main";
import {EditorView, ViewUpdate} from "@codemirror/view";
import {EditorState, Extension} from "@codemirror/state";

export default abstract class BaseView extends TextFileView {
	public plugin: LoaderPlugin;
	protected cmEditor: EditorView;
	protected editorEl: any;

	protected constructor(leaf: WorkspaceLeaf, plugin: LoaderPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	onload(): void {
		super.onload();
		this.editorEl = this.contentEl.createDiv("datafile-source-view mod-cm6");

		this.cmEditor = new EditorView({
			state: EditorState.create({
				extensions: this.getEditorExtensions()
			}),
			parent: this.editorEl,
		});

		this.app.workspace.trigger("codemirror", this.cmEditor);
	}
	
    getViewData(): string {
		return this.cmEditor.state.doc.toString();
    }
    setViewData(data: string, clear: boolean): void {
		this.cmEditor.dispatch({ changes: { from: 0, to: this.cmEditor.state.doc.length, insert: data } });
    }
    clear(): void {
    }

	// gets the title of the document
	getDisplayText(): string {
		if (this.file) {
			return this.file.basename;
		}
		return "NOFILE";
	}

	onClose(): Promise<void> {
		return super.onClose();
	}
	
	protected onEditorUpdate(update: ViewUpdate): void {
		if(!this.plugin.settings.doAutosaveFiles) {
			return;
		}

		if (update.docChanged) {
			this.requestSave();
		}
	}
	
    abstract getViewType(): string;
	
	protected abstract getEditorExtensions(): Extension[];
}
