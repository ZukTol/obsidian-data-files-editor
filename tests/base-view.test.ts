import {strict as assert} from "node:assert";
import {isolateHistory, redo, redoDepth, undo, undoDepth} from "@codemirror/commands";
import {EditorState, Extension, Transaction, TransactionSpec} from "@codemirror/state";
import {EditorView} from "@codemirror/view";
import {DEFAULT_SETTINGS} from "../src/loader-plugin-settings";
import BaseView from "../src/views/base-view";

// Exercise real CodeMirror state and history without a browser DOM.
class HeadlessEditor {
	state = EditorState.create();

	setState(state: EditorState): void {
		this.state = state;
	}

	dispatch = (transaction: Transaction | TransactionSpec): void => {
		this.state = transaction instanceof Transaction
			? transaction.state
			: this.state.update(transaction).state;
	};
}

class TestView extends BaseView {
	readonly editor = new HeadlessEditor();
	saveCalls = 0;

	constructor() {
		super(null as never, {settings: {...DEFAULT_SETTINGS}} as never);
		this.cmEditor = this.editor as unknown as EditorView;
	}

	getViewType(): string {
		return "test-data-file";
	}

	async save(clear?: boolean): Promise<void> {
		this.saveCalls++;
		await super.save(clear);
	}

	protected getEditorExtensions(): Extension[] {
		return [];
	}
}

function hasLineWrapping(editor: HeadlessEditor): boolean {
	return editor.state.facet(EditorView.contentAttributes).some(attributes =>
		typeof attributes !== "function" && attributes.class === "cm-lineWrapping");
}

function run(): void {
	const view = new TestView();
	view.setViewData("File A", true);
	assert.equal(undo(view.editor), false, "loading a file is not an undoable edit");

	view.editor.dispatch({changes: {from: 6, insert: " edited"}, selection: {anchor: 13}});
	assert.equal(undoDepth(view.editor.state), 1, "edits to file A can be undone");
	view.setViewData("File B", true);
	assert.equal(view.getViewData(), "File B");
	assert.equal(view.editor.state.selection.main.anchor, 0, "resets the previous file's selection");
	assert.equal(undoDepth(view.editor.state), 0, "discards the previous file's undo history");
	assert.equal(undo(view.editor), false, "cannot restore file A while editing file B");
	assert.equal(view.getViewData(), "File B", "undo leaves the newly loaded file intact");

	view.editor.dispatch({changes: {from: 6, insert: " edited"}});
	assert.equal(undo(view.editor), true, "edits to file B still support undo");
	assert.equal(view.getViewData(), "File B");
	assert.equal(redoDepth(view.editor.state), 1);
	view.setViewData("File C", true);
	assert.equal(redo(view.editor), false, "cannot redo an edit from file B in file C");
	assert.equal(view.getViewData(), "File C");

	view.setViewData("File C updated", false);
	assert.equal(undo(view.editor), true, "same-file updates keep the existing editor history");
	assert.equal(view.getViewData(), "File C");
	assert.equal(redo(view.editor), true);
	assert.equal(view.getViewData(), "File C updated");

	view.clear();
	assert.equal(view.getViewData(), "", "clear removes the previous file contents");
	assert.equal(undo(view.editor), false, "clear also discards undo history");
	assert.equal(redo(view.editor), false, "clear also discards redo history");
	view.setViewData("File D", true);
	view.editor.dispatch({changes: {from: 6, insert: " edited"}});
	assert.equal(undo(view.editor), true, "the editor remains usable after clearing");
	assert.equal(view.getViewData(), "File D");

	for (const doAutosaveFiles of [false, true]) {
		for (const lineWrapping of [false, true]) {
			const wrappingView = new TestView();
			wrappingView.plugin.settings.doAutosaveFiles = doAutosaveFiles;
			wrappingView.plugin.settings.lineWrapping = lineWrapping;
			wrappingView.setViewData("Original", true);
			assert.equal(hasLineWrapping(wrappingView.editor), lineWrapping);
			wrappingView.editor.dispatch({
				changes: {from: 8, insert: " first"},
				annotations: isolateHistory.of("full")
			});
			wrappingView.editor.dispatch({
				changes: {from: 14, insert: " second"},
				annotations: isolateHistory.of("full")
			});
			assert.equal(undo(wrappingView.editor), true);
			wrappingView.editor.dispatch({selection: {anchor: 1, head: 5}});
			const selection = wrappingView.editor.state.selection;

			for (const enabled of [!lineWrapping, lineWrapping, !lineWrapping]) {
				wrappingView.plugin.settings.lineWrapping = enabled;
				wrappingView.reload();
				assert.equal(hasLineWrapping(wrappingView.editor), enabled, "applies the wrapping setting");
				assert.equal(wrappingView.getViewData(), "Original first", "wrapping preserves unsaved text");
				assert.ok(wrappingView.editor.state.selection.eq(selection), "wrapping preserves selection");
				assert.equal(undoDepth(wrappingView.editor.state), 1, "wrapping preserves undo history");
				assert.equal(redoDepth(wrappingView.editor.state), 1, "wrapping preserves redo history");
				assert.equal(wrappingView.saveCalls, 0, "changing presentation does not save the file");
			}

			assert.equal(redo(wrappingView.editor), true);
			assert.equal(wrappingView.getViewData(), "Original first second");
			assert.equal(undo(wrappingView.editor), true);
			assert.equal(wrappingView.getViewData(), "Original first");
			assert.equal(undo(wrappingView.editor), true);
			assert.equal(wrappingView.getViewData(), "Original", "undo returns to the original text, not an empty document");
			assert.equal(undo(wrappingView.editor), false, "no wrapping transaction is added to undo history");
		}
	}

	console.log("Base view history tests passed");
}

export default run();
