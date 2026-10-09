import {strict as assert} from "node:assert";
import {highlightingFor, syntaxTree} from "@codemirror/language";
import {EditorState, Extension} from "@codemirror/state";
import {highlightTree} from "@lezer/highlight";
import YamlView from "../src/views/yaml-view";

class TestYamlView extends YamlView {
	getTestExtensions(): Extension[] {
		return this.getEditorExtensions();
	}
}

function run(): void {
	// Static token classes must work without consulting a window's theme or DOM.
	const view = new TestYamlView(null as never, {settings: {}} as never);
	const content = 'title: "Example"\n# A comment\nitems: [true]\nbase: &base "Shared"\n';
	const state = EditorState.create({doc: content, extensions: view.getTestExtensions()});
	const highlights = new Map<string, string>();
	highlightTree(syntaxTree(state), {
		style: tags => highlightingFor(state, tags)
	}, (from, to, classes) => {
		highlights.set(content.slice(from, to), classes);
	});
	assert.equal(highlights.get("title"), "datafile-yaml-property", "keys receive a class styled by the theme");
	assert.equal(highlights.get('"Example"'), "datafile-yaml-string", "quoted strings retain syntax highlighting");
	assert.equal(highlights.get("# A comment"), "datafile-yaml-comment", "comments retain syntax highlighting");
	assert.equal(highlights.get("["), "datafile-yaml-punctuation", "flow punctuation retains syntax highlighting");
	assert.equal(highlights.get("&base"), "datafile-yaml-tag", "anchors retain syntax highlighting");
	assert.equal(highlights.get("true"), "datafile-yaml-normal", "plain scalars use the theme's normal code color");
	console.log("YAML highlighting tests passed");
}

export default run();
