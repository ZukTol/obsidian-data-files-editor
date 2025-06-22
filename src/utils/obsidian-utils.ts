import {App} from "obsidian";
import BaseView from "../views/base-view";
import {VIEW_TYPE_JSON, VIEW_TYPE_TXT} from "../constants";
import JsonView from "../views/json-view";
import TxtView from "../views/txt-view";

export function getLoaderViews(app: App): BaseView[] {
	const leaves = [
		...app.workspace.getLeavesOfType(VIEW_TYPE_JSON).filter(l => l.view instanceof JsonView),
		...app.workspace.getLeavesOfType(VIEW_TYPE_TXT).filter(l => l.view instanceof TxtView),
	];
	return leaves.map(l => l.view as BaseView);
}
