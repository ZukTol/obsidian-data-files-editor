import {App} from "obsidian";
import BaseView from "../views/base-view";
import {VIEW_TYPE_JSON, VIEW_TYPE_TXT, VIEW_TYPE_YAML} from "../constants";
import JsonView from "../views/json-view";
import TxtView from "../views/txt-view";
import YamlView from "../views/yaml-view";

export function getLoaderViews(app: App): BaseView[] {
	const leaves = [
		...app.workspace.getLeavesOfType(VIEW_TYPE_JSON).filter(l => l.view instanceof JsonView),
		...app.workspace.getLeavesOfType(VIEW_TYPE_TXT).filter(l => l.view instanceof TxtView),
		...app.workspace.getLeavesOfType(VIEW_TYPE_YAML).filter(l => l.view instanceof YamlView),
	];
	return leaves.map(l => l.view as BaseView);
}
