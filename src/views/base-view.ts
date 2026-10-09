import {TextFileView, WorkspaceLeaf} from "obsidian";
import LoaderPlugin from "../main";
import {EditorView, KeyBinding, keymap, ViewUpdate} from "@codemirror/view";
import {Compartment, EditorState, Extension} from "@codemirror/state";
import {redo} from "@codemirror/commands"
import {basicSetup} from "codemirror";

export default abstract class BaseView extends TextFileView {
	public plugin: LoaderPlugin;
	protected cmEditor: EditorView;
	protected editorEl: HTMLDivElement;
	private readonly lineWrappingCompartment = new Compartment();

	protected constructor(leaf: WorkspaceLeaf, plugin: LoaderPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	onload(): void {
		super.onload();
		this.editorEl = this.contentEl.createDiv("datafile-source-view mod-cm6");

		this.cmEditor = new EditorView({
			state: this.createDefaultEditorState(),
			parent: this.editorEl,
		});

		this.app.workspace.trigger("codemirror", this.cmEditor);
	}

	getViewData(): string {
		return this.cmEditor.state.doc.toString();
	}

	setViewData(data: string, clear: boolean): void {
		if (clear) {
			this.cmEditor.setState(this.createDefaultEditorState(data));
			return;
		}

		this.cmEditor.dispatch({changes: {from: 0, to: this.cmEditor.state.doc.length, insert: data}});
	}

	clear(): void {
		this.cmEditor.setState(this.createDefaultEditorState());
	}

	// gets the title of the document
	getDisplayText(): string {
		if (this.file) {
			return this.file.basename;
		}
		return "NOFILE";
	}

	onClose(): Promise<void> {
		this.cmEditor.destroy();
		return super.onClose();
	}

	reload(): void {
		this.cmEditor.dispatch({
			effects: this.lineWrappingCompartment.reconfigure(this.getLineWrappingExtension())
		});
	}
	
	protected onEditorUpdate(update: ViewUpdate): void {
		if (!this.plugin.settings.doAutosaveFiles) {
			return;
		}

		if (update.docChanged) {
			this.requestSave();
		}
	}

	abstract getViewType(): string;

	protected abstract getEditorExtensions(): Extension[];

	private createDefaultEditorState(data: string = "") {
		return EditorState.create({
			doc: data,
			extensions: [...this.getCommonEditorExtensions(), ...this.getEditorExtensions()]
		});
	}

	private getCommonEditorExtensions(): Extension[] {
		const extensions: Extension[] = [
			basicSetup,
			keymap.of(this.customHistoryKeymap),
			EditorView.updateListener.of((update: ViewUpdate) => this.onEditorUpdate(update)),
			this.lineWrappingCompartment.of(this.getLineWrappingExtension())
		];
		return extensions;
	}

	private getLineWrappingExtension(): Extension {
		return this.plugin.settings.lineWrapping ? EditorView.lineWrapping : [];
	}
	
	private customHistoryKeymap: readonly KeyBinding[]  = [
		{ win: "Ctrl-Shift-z", run: redo, preventDefault: true}
	];
}
