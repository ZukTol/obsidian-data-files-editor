import { Plugin, TFile, WorkspaceLeaf } from 'obsidian';
import LoaderSettingTab from './loader-settings-tab';
import * as constants from './constants'
import { path } from "./utils";
import JsonView from "./views/json-view";
import TxtView from "./views/txt-view";
import YamlView from "./views/yaml-view";
import { DEFAULT_SETTINGS, LoaderPluginSettings } from "./loader-plugin-settings";

export default class LoaderPlugin extends Plugin {
	settings: LoaderPluginSettings;

	async onload(): Promise<void> {
		await this.loadSettings();

		// Always register views so they are available if the plugin is active
		// This prevents "Plugin has gone away" errors for files in previous sessions
		this.registerView(constants.VIEW_TYPE_TXT, (leaf: WorkspaceLeaf) => new TxtView(leaf, this));
		this.registerView(constants.VIEW_TYPE_JSON, (leaf: WorkspaceLeaf) => new JsonView(leaf, this));
		this.registerView(constants.VIEW_TYPE_YAML, (leaf: WorkspaceLeaf) => new YamlView(leaf, this));

		this.TryRegisterTxt();
		this.tryRegisterJson();
		this.tryRegisterXml();
		this.tryRegisterYaml();
		this.tryRegisterAstro();
		this.tryRegisterTs();
		this.tryRegisterCss();
		this.tryRegisterHtml();
		this.tryRegisterJs();
		this.tryRegisterMjs();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new LoaderSettingTab(this.app, this));
	}

	private TryRegisterTxt(): void {
		if (this.settings.doLoadTxt) {
			this.registerExtensions([constants.EXT_TXT], constants.VIEW_TYPE_TXT);
		}

		if (this.settings.doCreateTxt)
			this.registerContextMenuCommand(constants.EXT_TXT, "file");
	}

	private tryRegisterJson(): void {
		if (this.settings.doLoadJson) {
			this.registerExtensions([constants.EXT_JSON], constants.VIEW_TYPE_JSON);
		}

		if (this.settings.doCreateJson)
			this.registerContextMenuCommand(constants.EXT_JSON, "file-braces");
	}

	private tryRegisterXml(): void {
		if (this.settings.doLoadXml)
			this.registerExtensions([constants.EXT_XML], constants.VIEW_TYPE_TXT);

		if (this.settings.doCreateXml) {
			this.registerContextMenuCommand(constants.EXT_XML, "file-code");
		}
	}

	private tryRegisterYaml(): void {
		if (this.settings.doLoadYaml) {
			this.registerExtensions([constants.EXT_YAML, constants.EXT_YML], constants.VIEW_TYPE_YAML);
		}
		if (this.settings.doCreateYaml)
			this.registerContextMenuCommand(constants.EXT_YAML, "file-text");
	}

	private tryRegisterAstro(): void {
		if (this.settings.doLoadAstro) {
			this.registerExtensions([constants.EXT_ASTRO], constants.VIEW_TYPE_TXT);
		}

		if (this.settings.doCreateAstro) {
			this.registerContextMenuCommand(constants.EXT_ASTRO, "file-plus");
		}
	}

	private tryRegisterTs(): void {
		if (this.settings.doLoadTs) {
			this.registerExtensions([constants.EXT_TS], constants.VIEW_TYPE_TXT);
		}

		if (this.settings.doCreateTs) {
			this.registerContextMenuCommand(constants.EXT_TS, "file-type");
		}
	}

	private tryRegisterCss(): void {
		if (this.settings.doLoadCss) {
			this.registerExtensions([constants.EXT_CSS], constants.VIEW_TYPE_TXT);
		}

		if (this.settings.doCreateCss) {
			this.registerContextMenuCommand(constants.EXT_CSS, "file-sliders");
		}
	}

	private tryRegisterHtml(): void {
		if (this.settings.doLoadHtml) {
			this.registerExtensions([constants.EXT_HTML], constants.VIEW_TYPE_TXT);
		}

		if (this.settings.doCreateHtml) {
			this.registerContextMenuCommand(constants.EXT_HTML, "file-up");
		}
	}

	private tryRegisterJs(): void {
		if (this.settings.doLoadJs) {
			this.registerExtensions([constants.EXT_JS], constants.VIEW_TYPE_TXT);
		}

		if (this.settings.doCreateJs) {
			this.registerContextMenuCommand(constants.EXT_JS, "file-code");
		}
	}

	private tryRegisterMjs(): void {
		if (this.settings.doLoadMjs) {
			this.registerExtensions([constants.EXT_MJS], constants.VIEW_TYPE_TXT);
		}

		if (this.settings.doCreateMjs) {
			this.registerContextMenuCommand(constants.EXT_MJS, "file-code");
		}
	}

	onunload(): void {
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	private registerContextMenuCommand(fileExt: string, icon: string): void {
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				const parent = file instanceof TFile ? file.parent : file;

				menu.addItem((item) => {
					item
						.setTitle(`New .${fileExt} file`)
						.setIcon(icon)
						.setSection('action')
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
		const { vault } = this.app;
		const { adapter } = vault;
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
