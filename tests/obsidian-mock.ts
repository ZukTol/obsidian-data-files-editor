import type {Menu, TAbstractFile, ViewCreator} from "obsidian";

export const notices: string[] = [];

type FileMenuHandler = (menu: Menu, file: TAbstractFile) => void;

export class Plugin {
	data: unknown = null;
	views: Array<{type: string; creator: ViewCreator}> = [];
	extensions: Array<{extensions: string[]; viewType: string}> = [];
	fileMenuHandlers: FileMenuHandler[] = [];
	private settingsTabReady: () => void = () => undefined;
	settingsTabAdded = new Promise<void>(resolve => this.settingsTabReady = resolve);
	app = {
		workspace: {
			on: (_name: string, callback: FileMenuHandler) => {
				this.fileMenuHandlers.push(callback);
				return {};
			}
		}
	};

	async loadData(): Promise<unknown> {
		return this.data;
	}

	registerView(type: string, creator: ViewCreator): void {
		this.views.push({type, creator});
	}

	registerExtensions(extensions: string[], viewType: string): void {
		this.extensions.push({extensions, viewType});
	}

	registerEvent(): void {
	}

	addSettingTab(): void {
		this.settingsTabReady();
	}
}

export class PluginSettingTab {
	constructor(..._args: unknown[]) {
	}
}

export class TFile {
}

export class Setting {
}

export function normalizePath(path: string): string {
	return path;
}

export class Notice {
	constructor(message: string) {
		notices.push(message);
	}
}

export class TextFileView {
	file: {name: string} | null = null;
	saved: Array<boolean | undefined> = [];

	constructor(..._args: unknown[]) {
	}

	async save(clear?: boolean): Promise<void> {
		this.saved.push(clear);
	}

	onClose(): Promise<void> {
		return Promise.resolve();
	}
}
