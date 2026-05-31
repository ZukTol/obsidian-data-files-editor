export interface LoaderPluginSettings {
	doLoadTxt: boolean;
	doCreateTxt: boolean;
	doLoadXml: boolean;
	doCreateXml: boolean;
	doLoadJson: boolean;
	doCreateJson: boolean;
	doLoadYaml: boolean;
	doCreateYaml: boolean;
	doLoadAstro: boolean;
	doCreateAstro: boolean;
	doLoadTs: boolean;
	doCreateTs: boolean;
	doLoadCss: boolean;
	doCreateCss: boolean;
	doLoadHtml: boolean;
	doCreateHtml: boolean;
	doLoadJs: boolean;
	doCreateJs: boolean;
	doLoadMjs: boolean;
	doCreateMjs: boolean;
	doAutosaveFiles: boolean;
	lineWrapping: boolean;
}

export const DEFAULT_SETTINGS: LoaderPluginSettings = {
	doLoadTxt: true,
	doCreateTxt: true,
	doLoadXml: true,
	doCreateXml: true,
	doLoadJson: true,
	doCreateJson: true,
	doLoadYaml: true,
	doCreateYaml: true,
	doLoadAstro: false,
	doCreateAstro: false,
	doLoadTs: false,
	doCreateTs: false,
	doLoadCss: false,
	doCreateCss: false,
	doLoadHtml: false,
	doCreateHtml: false,
	doLoadJs: false,
	doCreateJs: false,
	doLoadMjs: false,
	doCreateMjs: false,
	doAutosaveFiles: true,
	lineWrapping: true
}
