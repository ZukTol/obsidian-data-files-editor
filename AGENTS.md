#  Project description
[Description](README.md)

# Repository Guide

## Commands

- Use npm; the repository has a lockfile and the release workflow runs on Node 20.
- `npm run dev` starts a persistent esbuild watch and writes an ignored `main.js` with an inline source map. Reload the plugin in the surrounding Obsidian test vault to exercise changes.
- `npm run build` is the authoritative compile check: TypeScript first (`tsc -noEmit -skipLibCheck`), then a minified production bundle to `main.js`.
- `npm run lint` runs ESLint including Obsidian-specific rules.
- `npm test` runs tests. All tests should pass.
- `npm run check` runs lint, tests, and the production build in sequence. CI uses the same command.

## Completion Criteria

- Run `npm run check` after changes and resolve failures before considering the task complete. Report any checks that could not run and why.
- Cover behavior changes and bug fixes with meaningful automated tests where practical; documentation-only changes do not need new tests.
- For changes that affect Obsidian behavior, verify the affected scenario in the test vault when available. Report manual verification separately from automated checks, and explicitly state when it was not performed.
- Summarize what changed, the verification results, and any remaining limitations.

## Runtime Shape

- `src/main.ts` is the only bundle entrypoint. It loads persisted settings, registers Obsidian file views/extensions, and adds file-menu creation commands.
- `src/views/base-view.ts` adapts Obsidian `TextFileView` persistence to an embedded CodeMirror 6 `EditorView`; JSON and YAML add language support, while XML deliberately reuses the TXT view rather than having its own view class.
- Load/create settings are consumed when `onload()` registers handlers. Changing those toggles only persists data; reload the plugin before expecting registration changes. Line wrapping is different: closing the settings tab rebuilds currently open plugin views.
- Keep format registration gates independent: `tryRegisterJson()` checks `doLoadJson`, while TXT registration checks `doLoadTxt`.
- `data.json` is ignored runtime state from Obsidian. Defaults and the persisted shape belong in `src/loader-plugin-settings.ts`.

## Artifacts And Releases

- Never edit or commit `main.js`; esbuild generates it and `.gitignore` excludes it. Release assets are exactly `main.js`, `manifest.json`, and `styles.css`.
- Keep `package.json`, `manifest.json`, and `versions.json` release versions aligned. `npm version` invokes `version-bump.mjs` and stages the latter two files; `.npmrc` configures unprefixed version tags.
- Verify `versions.json` after every version bump. `version-bump.mjs` only adds an entry when its `minAppVersion` is absent from all existing values, so a bump that retains `0.15.0` may require correcting the file manually.
