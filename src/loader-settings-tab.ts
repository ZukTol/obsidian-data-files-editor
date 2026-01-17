import {App, PluginSettingTab, Setting} from 'obsidian';
import LoaderPlugin from './main'
import {getLoaderViews} from "./utils/obsidian-utils";

export default class LoaderSettingTab extends PluginSettingTab {
	plugin: LoaderPlugin;

	private requestReloadView: boolean = false;

	constructor(app: App, plugin: LoaderPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		this.requestReloadView = false;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Load .txt files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doLoadTxt)
				.onChange(async (value) => {
					this.plugin.settings.doLoadTxt = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Create .txt files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doCreateTxt)
				.onChange(async (value) => {
					this.plugin.settings.doCreateTxt = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Load .json files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doLoadJson)
				.onChange(async (value) => {
					this.plugin.settings.doLoadJson = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Create .json files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doCreateJson)
				.onChange(async (value) => {
					this.plugin.settings.doCreateJson = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Load .xml files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doLoadXml)
				.onChange(async (value) => {
					this.plugin.settings.doLoadXml = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Create .xml files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doCreateXml)
				.onChange(async (value) => {
					this.plugin.settings.doCreateXml = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Load .yaml/.yml files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doLoadYaml)
				.onChange(async (value) => {
					this.plugin.settings.doLoadYaml = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Create .yaml files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doCreateYaml)
				.onChange(async (value) => {
					this.plugin.settings.doCreateYaml = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Enable autosave for files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doAutosaveFiles)
				.onChange(async (value) => {
					this.plugin.settings.doAutosaveFiles = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Wrap long lines')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.lineWrapping)
				.onChange(async (value) => {
					this.plugin.settings.lineWrapping = value;
					this.requestReloadView = true;
					await this.plugin.saveSettings();
				}));
	}

	async hide(): Promise<void> {
		if (this.requestReloadView) {
			const loaderViews = getLoaderViews(this.app);
			for (const loaderView of loaderViews) {
				await loaderView.reload();
			}
		}
	}
}
