# Local Obsidian Developer Docs Source

- Vault root: `D:\repo\3rd party\obsidian-developer-docs`.
- Primary language and content root: `en/`.
- Origin recorded in the local Git configuration: `https://github.com/obsidianmd/obsidian-developer-docs.git`.
- Hosted site listed in the README: `https://docs.obsidian.md/`.
- When the skill was created on 2026-10-07, the local `main` branch pointed to `c56c7e770ba25dd0ea392aacf4588f9425970d36`.

These details describe an observed local snapshot, not a pinned checkout. The branch and working files may change; local modifications were not checked. For a reproducible specification, record the current commit when available and the files used. Do not update the vault automatically or describe it as current without verification.

## Topic Map

All documentation paths below are relative to the vault root. They are search entry points, not a required reading list. Class member directories are under `en/Reference/TypeScript API/`.

| Task | Sources |
| --- | --- |
| Class and method contracts | `en/Reference/TypeScript API/`: class pages and member subdirectories |
| Custom file views | `en/Plugins/User interface/Views.md`, `en/Plugins/User interface/Workspace.md`, `en/Reference/TypeScript API/TextFileView.md`, and the `TextFileView/` member directory |
| Lifecycle and events | `en/Plugins/Guides/Manage plugin lifecycle.md`, `en/Plugins/Events.md`, and the `Component/` and `Plugin/` API directories |
| File operations | `en/Plugins/Vault.md` and the `Vault/`, `TFile/`, and `FileManager/` API directories |
| Settings, commands, and context menus | Pages under `en/Plugins/User interface/`: `Settings.md`, `Commands.md`, and `Context menus.md` |
| CodeMirror and editor behavior | `en/Plugins/Editor/`, especially `Editor extensions.md` and `State management.md` |
| Mobile support and pop-out windows | `en/Plugins/Getting started/Mobile development.md` and `en/Plugins/Guides/Support pop-out windows.md` |
| Compatibility and manifest fields | `en/Reference/Manifest.md`, `en/Reference/Versions.md`, and version annotations on API pages |
| Release preparation | `en/Plugins/Releasing/Plugin guidelines.md`, `en/Community directory/Submission requirements for plugins.md`, and `en/Community directory/Developer policies.md` |

If paths have changed, locate pages again by filename and content. The Markdown includes wiki-links, ordinary links, YAML `aliases`, and callouts. Some API introduction versions appear on a standalone line without an `@since` label; read the surrounding context rather than treating the number as a separate requirement.

## Cross-Check the Project

The following paths are relative to the current project:

- `manifest.json`: declared minimum Obsidian version and platform support.
- `node_modules/obsidian/package.json`: installed API declaration package version.
- `node_modules/obsidian/obsidian.d.ts`: available declarations and API comments.
- `package-lock.json`: resolved package version, especially when `node_modules` is absent. The lockfile does not replace missing declarations.
- `AGENTS.md`: verification commands, test-vault scenarios, and project constraints.

For `TextFileView` persistence, also consult `TextFileView/requestSave.md`, `TextFileView/getViewData.md`, `TextFileView/setViewData.md`, and `TextFileView/clear.md` under the API reference root. These are search suggestions, not evidence that an editor change has already been verified.
