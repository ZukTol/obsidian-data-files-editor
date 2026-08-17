import {build} from "esbuild";
import {createRequire} from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const obsidianMockPath = path.resolve("tests/obsidian-mock.ts");

const result = await build({
	entryPoints: ["tests/jsonl-validator.test.ts"],
	bundle: true,
	platform: "node",
	format: "cjs",
	write: false,
	plugins: [{
		name: "obsidian-mock",
		setup(build) {
			build.onResolve({filter: /^obsidian$/}, () => ({path: obsidianMockPath}));
		}
	}]
});

const testModule = {exports: {}};
const execute = new Function("require", "module", "exports", result.outputFiles[0].text);
execute(require, testModule, testModule.exports);
await testModule.exports.default;
