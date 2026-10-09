import { WorkspaceLeaf } from "obsidian";
import { yaml } from "@codemirror/lang-yaml";
import { Extension } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { VIEW_TYPE_YAML } from '../constants'
import LoaderPlugin from "../main";
import { getIndentByTabExtension } from "../services/indentation-provider"
import BaseView from "./base-view";

const yamlHighlight = HighlightStyle.define([
	{ tag: tags.propertyName, class: "datafile-yaml-property" },
	{ tag: tags.string, class: "datafile-yaml-string" },
	{ tag: [tags.number, tags.bool, tags.null, tags.attributeValue], class: "datafile-yaml-value" },
	{ tag: tags.comment, class: "datafile-yaml-comment" },
	{ tag: tags.content, class: "datafile-yaml-normal" },
	{ tag: tags.keyword, class: "datafile-yaml-keyword" },
	{ tag: tags.punctuation, class: "datafile-yaml-punctuation" },
	{ tag: [tags.labelName, tags.typeName, tags.meta], class: "datafile-yaml-tag" },
]);

export default class YamlView extends BaseView {
	constructor(leaf: WorkspaceLeaf, plugin: LoaderPlugin) {
		super(leaf, plugin);
	}

	getViewType(): string {
		return VIEW_TYPE_YAML;
	}

	protected getEditorExtensions(): Extension[] {
		return [
			getIndentByTabExtension(),
			yaml(),
			syntaxHighlighting(yamlHighlight)
		];
	}
}
