import { App, PluginSettingTab } from 'obsidian';
import LoaderPlugin from './main'
import { getLoaderViews } from "./utils/obsidian-utils";
import { createSettingsGroup } from "./utils/settings-compat";

export default class LoaderSettingTab extends PluginSettingTab {
	// Shown beside the plugin name in settings search results (Obsidian 1.13)
	// and in the settings sidebar on older Obsidian (SettingTab.icon).
	public icon = 'lucide-file-code';
	plugin: LoaderPlugin;

	private requestReloadView: boolean = false;

	constructor(app: App, plugin: LoaderPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		this.requestReloadView = false;
		containerEl.empty();

		const headerEl = containerEl.createEl('h2', { text: 'File types' });
		headerEl.style.padding = '0 var(--size-4-4)';
		headerEl.style.marginBottom = 'var(--size-4-4)';

		const descEl = containerEl.createEl('p', {
			text: 'Toggle which file types this plugin should handle. Please note that you must restart Obsidian for many of these changes to take effect.',
			cls: 'setting-item-description'
		});
		descEl.style.padding = '0 var(--size-4-4)';
		descEl.style.marginBottom = 'var(--size-4-4)';

		const textFilesGroup = createSettingsGroup(containerEl);

		textFilesGroup.addSetting(setting => setting
			.setName('Load .txt files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doLoadTxt)
				.onChange(async (value) => {
					this.plugin.settings.doLoadTxt = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Create .txt files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doCreateTxt)
				.onChange(async (value) => {
					this.plugin.settings.doCreateTxt = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Load .json files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doLoadJson)
				.onChange(async (value) => {
					this.plugin.settings.doLoadJson = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Create .json files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doCreateJson)
				.onChange(async (value) => {
					this.plugin.settings.doCreateJson = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Load .xml files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doLoadXml)
				.onChange(async (value) => {
					this.plugin.settings.doLoadXml = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Create .xml files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doCreateXml)
				.onChange(async (value) => {
					this.plugin.settings.doCreateXml = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Load .yaml/.yml files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doLoadYaml)
				.onChange(async (value) => {
					this.plugin.settings.doLoadYaml = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Create .yaml files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doCreateYaml)
				.onChange(async (value) => {
					this.plugin.settings.doCreateYaml = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Load .html files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doLoadHtml)
				.onChange(async (value) => {
					this.plugin.settings.doLoadHtml = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Create .html files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doCreateHtml)
				.onChange(async (value) => {
					this.plugin.settings.doCreateHtml = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Load .css files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doLoadCss)
				.onChange(async (value) => {
					this.plugin.settings.doLoadCss = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Create .css files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doCreateCss)
				.onChange(async (value) => {
					this.plugin.settings.doCreateCss = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Load .js files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doLoadJs)
				.onChange(async (value) => {
					this.plugin.settings.doLoadJs = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Create .js files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doCreateJs)
				.onChange(async (value) => {
					this.plugin.settings.doCreateJs = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Load .mjs files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doLoadMjs)
				.onChange(async (value) => {
					this.plugin.settings.doLoadMjs = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Create .mjs files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doCreateMjs)
				.onChange(async (value) => {
					this.plugin.settings.doCreateMjs = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Load .ts files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doLoadTs)
				.onChange(async (value) => {
					this.plugin.settings.doLoadTs = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Create .ts files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doCreateTs)
				.onChange(async (value) => {
					this.plugin.settings.doCreateTs = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Load .astro files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doLoadAstro)
				.onChange(async (value) => {
					this.plugin.settings.doLoadAstro = value;
					await this.plugin.saveSettings();
				})));

		textFilesGroup.addSetting(setting => setting
			.setName('Create .astro files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doCreateAstro)
				.onChange(async (value) => {
					this.plugin.settings.doCreateAstro = value;
					await this.plugin.saveSettings();
				})));

		const globalGroup = createSettingsGroup(containerEl, 'Global Settings');

		globalGroup.addSetting(setting => setting
			.setName('Enable autosave for files')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.doAutosaveFiles)
				.onChange(async (value) => {
					this.plugin.settings.doAutosaveFiles = value;
					await this.plugin.saveSettings();
				})));

		globalGroup.addSetting(setting => setting
			.setName('Wrap long lines')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.lineWrapping)
				.onChange(async (value) => {
					this.plugin.settings.lineWrapping = value;
					this.requestReloadView = true;
					await this.plugin.saveSettings();
				})));
	}

	async hide(): Promise<void> {
		if (this.requestReloadView) {
			const loaderViews = getLoaderViews(this.app);
			for (const loaderView of loaderViews) {
				await loaderView.reload();
			}
		}
	}

	// Obsidian 1.13.0+: the framework calls this and skips display(); each setting
	// is then indexed for the global settings search. Pre-1.13.0 ignores it and
	// display() above runs as before (Path B — both implementations are kept).
	getSettingDefinitions() {
		const fileTypes: Array<[string, string, string]> = [
			['Txt', 'Load .txt files', 'Create .txt files'],
			['Json', 'Load .json files', 'Create .json files'],
			['Xml', 'Load .xml files', 'Create .xml files'],
			['Yaml', 'Load .yaml/.yml files', 'Create .yaml files'],
			['Html', 'Load .html files', 'Create .html files'],
			['Css', 'Load .css files', 'Create .css files'],
			['Js', 'Load .js files', 'Create .js files'],
			['Mjs', 'Load .mjs files', 'Create .mjs files'],
			['Ts', 'Load .ts files', 'Create .ts files'],
			['Astro', 'Load .astro files', 'Create .astro files'],
		];
		const fileTypeItems: Array<Record<string, unknown>> = [
			{
				name: 'File type loading',
				desc: 'Toggle which file types this plugin handles. Restart Obsidian for many of these changes to take effect.',
			},
		];
		for (const [cap, loadName, createName] of fileTypes) {
			fileTypeItems.push({ name: loadName, control: { type: 'toggle' as const, key: `doLoad${cap}` } });
			fileTypeItems.push({ name: createName, control: { type: 'toggle' as const, key: `doCreate${cap}` } });
		}
		return [
			{ type: 'group' as const, heading: 'File types', items: fileTypeItems },
			{
				type: 'group' as const,
				heading: 'Global settings',
				items: [
					{ name: 'Enable autosave for files', control: { type: 'toggle' as const, key: 'doAutosaveFiles' } },
					{ name: 'Wrap long lines', control: { type: 'toggle' as const, key: 'lineWrapping' } },
				],
			},
		];
	}

	// Read a setting value by its flat key (Obsidian 1.13 declarative controls).
	getControlValue(key: string): unknown {
		return (this.plugin.settings as unknown as Record<string, unknown>)[key];
	}

	// Persist a declarative control change. Mirrors the display() onChange:
	// write the value, saveSettings(), and reload open editor views when the
	// line-wrapping option changes (display() did this via hide()).
	async setControlValue(key: string, value: unknown): Promise<void> {
		(this.plugin.settings as unknown as Record<string, unknown>)[key] = value;
		await this.plugin.saveSettings();
		if (key === 'lineWrapping') {
			const loaderViews = getLoaderViews(this.app);
			for (const loaderView of loaderViews) {
				await loaderView.reload();
			}
		}
	}
}
