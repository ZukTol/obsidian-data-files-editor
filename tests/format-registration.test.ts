import {strict as assert} from "node:assert";
import type {Menu, TAbstractFile} from "obsidian";
import LoaderPlugin from "../src/main";
import {VIEW_TYPE_TXT} from "../src/constants";
import TxtView from "../src/views/txt-view";
import {Plugin as PluginMock} from "./obsidian-mock";

function getMenuTitles(plugin: PluginMock): string[] {
	const titles: string[] = [];
	const item = {
		setTitle(title: string) {
			titles.push(title);
			return this;
		},
		setIcon() { return this; },
		onClick() { return this; }
	};
	const menu = {addItem: (callback: (menuItem: typeof item) => void) => callback(item)};
	for (const handler of plugin.fileMenuHandlers)
		handler(menu as unknown as Menu, {path: "folder"} as TAbstractFile);
	return titles;
}

async function run(): Promise<void> {
	for (const doLoadTxt of [false, true]) {
		for (const doLoadXml of [false, true]) {
			for (const doCreateTxt of [false, true]) {
				for (const doCreateXml of [false, true]) {
					const plugin = new LoaderPlugin(null as never, null as never);
					const mock = plugin as unknown as PluginMock;
					mock.data = {
						doLoadTxt, doLoadXml, doCreateTxt, doCreateXml,
						doLoadJson: false, doCreateJson: false,
						doLoadJsonl: false, doCreateJsonl: false,
						doLoadYaml: false, doCreateYaml: false
					};
					plugin.onload();
					await mock.settingsTabAdded;

					const scenario = JSON.stringify(mock.data);
					assert.deepEqual(mock.views.map(view => view.type),
						doLoadTxt || doLoadXml ? [VIEW_TYPE_TXT] : [],
						`registers exactly one shared view when TXT or XML loading is enabled: ${scenario}`);
					if (mock.views.length > 0)
						assert.ok(mock.views[0].creator(null as never) instanceof TxtView);

					const expectedExtensions: string[] = [];
					if (doLoadTxt) expectedExtensions.push("txt");
					if (doLoadXml) expectedExtensions.push("xml", "xsd");
					assert.deepEqual(mock.extensions.flatMap(entry => entry.extensions), expectedExtensions,
						`TXT and XML/XSD extension gates remain independent: ${scenario}`);
					for (const entry of mock.extensions)
						assert.equal(entry.viewType, VIEW_TYPE_TXT);

					const expectedTitles: string[] = [];
					if (doCreateTxt) expectedTitles.push("Create .txt file");
					if (doCreateXml) expectedTitles.push("Create .xml file");
					assert.deepEqual(getMenuTitles(mock), expectedTitles,
						`creation commands remain independent of loading: ${scenario}`);
				}
			}
		}
	}
	console.log("Format registration tests passed");
}

export default run();
