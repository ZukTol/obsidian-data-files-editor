import {strict as assert} from "node:assert";
import {redo, redoDepth, undo, undoDepth} from "@codemirror/commands";
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

	constructor() {
		super(null as never, {settings: {...DEFAULT_SETTINGS}} as never);
		this.cmEditor = this.editor as unknown as EditorView;
	}

	getViewType(): string {
		return "test-data-file";
	}

	protected getEditorExtensions(): Extension[] {
		return [];
	}
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

	console.log("Base view history tests passed");
}

export default run();
