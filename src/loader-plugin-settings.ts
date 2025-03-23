export interface LoaderPluginSettings {
	doLoadTxt: boolean;
	doCreateTxt: boolean;
	doLoadXml: boolean;
	doCreateXml: boolean;
	doLoadJson: boolean;
	doCreateJson: boolean;
	doAutosaveFiles: boolean;
}

export const DEFAULT_SETTINGS: LoaderPluginSettings = {
	doLoadTxt: true,
	doCreateTxt: true,
	doLoadXml: true,
	doCreateXml: true,
	doLoadJson: true,
	doCreateJson: true,
	doAutosaveFiles: true
}
