import { Plugin, TFile } from 'obsidian';
import LoaderSettingTab from './loader-settings-tab';
import { path } from "./utils";

// Remember to rename these classes and interfaces!

interface LoaderPluginSettings {
	doLoadTxt: boolean;
	doCreateTxt: boolean;
	doLoadXml: boolean;
	doLoadJson: boolean;
}

const DEFAULT_SETTINGS: LoaderPluginSettings = {
	doLoadTxt: true,
	doCreateTxt: true,
	doLoadXml: true,
	doLoadJson: true
}

export default class LoaderPlugin extends Plugin {
	settings: LoaderPluginSettings;

	async onload() {
		await this.loadSettings();

		this.TryRegisterTxt();

		if(this.settings.doLoadTxt)
			this.registerExtensions(["json"], "markdown");

		if (this.settings.doLoadXml)
			this.registerExtensions(["xml"], "markdown");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new LoaderSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	private TryRegisterTxt() {
		if (this.settings.doLoadTxt)
			this.registerExtensions(["txt"], "markdown");

		if (this.settings.doCreateTxt) {
			this.registerEvent(
				this.app.workspace.on("file-menu", (menu, file) => {
					const parent = file instanceof TFile ? file.parent : file; 
										
					menu.addItem((item) => {
						item
							.setTitle("Create .txt file")
							.setIcon("document")
							.onClick(async () => {
								console.log(parent?.path);
								if(parent)
									await this.createFile(parent.path, 'txt');
							});
					});
				})
			);
		}
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
	
	async createFile(dirPath: string, extension: string): Promise<void> {
		const { vault } = this.app;
		const { adapter } = vault;
		const name = "Unknown";
		const filePath = path.join(dirPath, `${name}.${extension}`);

		try {
			const fileExists = await adapter.exists(filePath);
			if (fileExists) {
				throw new Error(`${filePath} already exists`);
			}
			
			// const dirExists = await adapter.exists(dirPath);
			// if (!dirExists) {
			// 	await this.createDirectory(dirPath);
			// }
			
			const File = await vault.create(filePath, '');
			const leaf = this.app.workspace.getLeaf(true);
			await leaf.openFile(File);
		} catch (error) {
			console.log(error.toString());
		}
	}
}


