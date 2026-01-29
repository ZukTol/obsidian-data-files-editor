import { WorkspaceLeaf } from "obsidian";
import { yaml } from "@codemirror/lang-yaml";
import { Extension } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { VIEW_TYPE_YAML } from '../constants'
import LoaderPlugin from "../main";
import { getIndentByTabExtension } from "../services/indentation-provider"
import BaseView from "./base-view";

const yamlDarkHighlight = HighlightStyle.define([
	{ tag: tags.propertyName, color: "#e5c07b" },  // keys - warm yellow/gold
	{ tag: tags.string, color: "#98c379" },         // string values - green
	{ tag: tags.number, color: "#d19a66" },         // numbers - orange
	{ tag: tags.bool, color: "#d19a66" },           // booleans - orange
	{ tag: tags.null, color: "#d19a66" },           // null - orange
	{ tag: tags.comment, color: "#7f848e" },        // comments - gray
]);

export default class YamlView extends BaseView {
	constructor(leaf: WorkspaceLeaf, plugin: LoaderPlugin) {
		super(leaf, plugin);
	}

	getViewType(): string {
		return VIEW_TYPE_YAML;
	}

    protected getEditorExtensions(): Extension[] {
		const extensions: Extension[] = [
			getIndentByTabExtension(),
			yaml()
		];

		if (document.body.classList.contains('theme-dark')) {
			extensions.push(syntaxHighlighting(yamlDarkHighlight));
		}

		return extensions;
    }
}
