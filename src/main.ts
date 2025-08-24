import {Plugin, TFile, WorkspaceLeaf} from 'obsidian';
import LoaderSettingTab from './loader-settings-tab';
import * as constants from './constants'
import {path} from "./utils";
import JsonView from "./views/json-view";
import TxtView from "./views/txt-view";
import {DEFAULT_SETTINGS, LoaderPluginSettings} from "./loader-plugin-settings";
import BaseView from "./views/base-view";

export default class LoaderPlugin extends Plugin {
	settings: LoaderPluginSettings;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.TryRegisterTxt();

		this.tryRegisterJson();

		this.tryRegisterXml();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new LoaderSettingTab(this.app, this));
	}
	
	private TryRegisterTxt(): void {
		if (this.settings.doLoadTxt) {
			this.registerViewFactory(TxtView, constants.VIEW_TYPE_TXT);
			//this.registerView(constants.VIEW_TYPE_TXT, (leaf: WorkspaceLeaf) => new TxtView(leaf, this));
			this.registerExtensions([constants.EXT_TXT], constants.VIEW_TYPE_TXT);
		}

		if (this.settings.doCreateTxt)
			this.registerContextMenuCommand(constants.EXT_TXT);
	}

	private tryRegisterJson(): void {
		if (this.settings.doLoadTxt) {
			this.registerViewFactory(JsonView, constants.VIEW_TYPE_JSON);
			//this.registerView(constants.VIEW_TYPE_JSON, (leaf: WorkspaceLeaf) => new JsonView(leaf, this));
			this.registerExtensions([constants.EXT_JSON], constants.VIEW_TYPE_JSON);
		}

		if (this.settings.doCreateJson)
			this.registerContextMenuCommand(constants.EXT_JSON);
	}

	private tryRegisterXml(): void {
		if (this.settings.doLoadXml)
			this.registerExtensions([constants.EXT_XML], constants.VIEW_TYPE_TXT);

		if (this.settings.doCreateXml) {
			this.registerContextMenuCommand(constants.EXT_XML);
		}
	}

	private registerViewFactory(
		View: new (leaf: WorkspaceLeaf, plugin: LoaderPlugin) => BaseView,
		viewType: string
	) {
		this.registerView(viewType, (leaf) => new View(leaf, this));
	}

	onunload(): void {
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	private registerContextMenuCommand(fileExt: string): void {
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				const parent = file instanceof TFile ? file.parent : file;

				menu.addItem((item) => {
					item
						.setTitle(`Create .${fileExt} file`)
						.setIcon("document")
						.onClick(async () => {
							console.log(parent?.path);
							if (parent)
								await this.createFile(parent.path, fileExt);
						});
				});
			})
		);
	}

	private async createFile(dirPath: string, extension: string): Promise<void> {
		const {vault} = this.app;
		const {adapter} = vault;
		const name = "Unknown";
		const filePath = path.join(dirPath, `${name}.${extension}`);

		try {
			const fileExists = await adapter.exists(filePath);
			if (fileExists)
				throw new Error(`${filePath} already exists`);

			const File = await vault.create(filePath, '');
			const leaf = this.app.workspace.getLeaf(true);
			await leaf.openFile(File);
		} catch (error) {
			console.log(error.toString());
		}
	}
}
