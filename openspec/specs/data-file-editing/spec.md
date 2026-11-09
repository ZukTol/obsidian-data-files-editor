# Data File Editing

## Purpose

Data Files Editor lets users open, edit, and create supported text-based files in an Obsidian vault.
This baseline describes the behavior of the existing plugin.

## Requirements

The requirements cover file registration, creation, editing, and persistence.

### Requirement: Settings defaults and persistence

The plugin SHALL persist changes to its load, creation, autosave, and line-wrapping settings and
enable each missing setting by default. Changes to load and creation settings SHALL
take effect on the next plugin load.

#### Scenario: Start with saved settings from an earlier version

- **WHEN** the plugin loads with some settings missing from its saved data
- **THEN** it uses the saved values that are present and enables the missing settings

#### Scenario: Change a load or creation setting

- **WHEN** the user changes a load or creation setting
- **THEN** the plugin saves the change and applies it to registration on the next plugin load

### Requirement: File extension routing

The plugin SHALL associate enabled extensions with its editors on startup. `.txt`, `.xml`, and
`.xsd` use the plain-text editor, `.json` uses the JSON editor, `.jsonl` uses the JSON Lines editor,
and `.yaml` and `.yml` use the YAML editor. The XML setting controls `.xml` and `.xsd` together,
and the YAML setting controls `.yaml` and `.yml` together.

#### Scenario: Open a file with loading enabled

- **WHEN** the user opens a vault file whose extension is enabled for loading
- **THEN** the plugin opens the file in the editor associated with that extension

#### Scenario: Enable XML and JSON loading with TXT loading disabled

- **WHEN** the plugin loads with XML and JSON loading enabled and TXT loading disabled
- **THEN** it registers `.xml` and `.xsd` for the plain-text editor and `.json` for the JSON editor
- **AND** it leaves `.txt` unregistered by the plugin

#### Scenario: Enable TXT loading with XML and JSON loading disabled

- **WHEN** the plugin loads with TXT loading enabled and XML and JSON loading disabled
- **THEN** it registers `.txt` for the plain-text editor
- **AND** it leaves `.xml`, `.xsd`, and `.json` unregistered by the plugin

### Requirement: File creation commands

The plugin SHALL offer `Create .<extension> file` commands in the file context menu for enabled
creation settings. The available commands cover `.txt`, `.json`, `.jsonl`, `.xml`, and `.yaml`.
Each creation setting SHALL operate independently of the corresponding load setting.

#### Scenario: Enable creation with loading disabled

- **WHEN** the plugin loads with JSON creation enabled and JSON loading disabled
- **THEN** the file context menu includes `Create .json file`

#### Scenario: Disable creation with loading enabled

- **WHEN** the plugin loads with YAML creation disabled and YAML loading enabled
- **THEN** the file context menu omits `Create .yaml file` and the plugin still opens `.yaml` and
  `.yml` files in the YAML editor

### Requirement: File creation destination and outcome

The plugin SHALL create an empty `Unknown.<extension>` inside a selected folder or alongside a
selected file and ask Obsidian to open it in a new tab. If the target path is occupied or creation
or opening fails, the plugin SHALL show a notice. An occupied path SHALL be preserved.

#### Scenario: Create from a folder menu

- **WHEN** the user selects `Create .yaml file` from the context menu for `config`
- **THEN** it creates an empty `config/Unknown.yaml` and asks Obsidian to open it in a new tab

#### Scenario: Create from a file menu

- **WHEN** the user selects `Create .json file` from the context menu for `config/settings.md`
- **THEN** it creates an empty `config/Unknown.json` and asks Obsidian to open it in a new tab

#### Scenario: Target path already exists

- **WHEN** a file or folder already occupies the target path
- **THEN** the plugin shows a notice identifying the occupied path and leaves that entry intact

#### Scenario: Opening the new file fails

- **WHEN** Obsidian fails to open a file after the plugin successfully creates it
- **THEN** the plugin shows a notice and the new file remains in the vault

### Requirement: Format-specific editing

The plugin SHALL present editable text for every supported format. It SHALL provide syntax
highlighting and a four-space indentation unit for JSON, JSON Lines, and YAML. The YAML editor
SHALL use the active theme's code colors when available.

#### Scenario: Open structured data

- **WHEN** the user edits a JSON, JSON Lines, or YAML file in its plugin editor
- **THEN** the editor applies the format's syntax highlighting and uses four spaces per indent level

#### Scenario: Open an XML or XSD file

- **WHEN** the user opens an XML or XSD file with XML loading enabled
- **THEN** the plugin presents the file as editable plain text without XML syntax highlighting

### Requirement: File content and history

The plugin SHALL load the file's text into the editor and supply the current editor text to Obsidian
for saving. When a view opens a different file, the plugin SHALL reset its selection and undo and
redo history. An update to the current file without clearing the view SHALL retain undo history.

#### Scenario: Reuse a view for another file

- **WHEN** Obsidian opens a different file in an editor with a selection and undo or redo history
- **THEN** the editor shows the new file with the cursor at the start and resets undo and redo

#### Scenario: Refresh the current file

- **WHEN** Obsidian supplies updated text for the current file without clearing the view
- **THEN** the editor shows the updated text and retains its undo history

### Requirement: Autosave setting

The plugin SHALL request Obsidian's debounced save when editor text changes with autosave enabled.
With autosave disabled, it SHALL suppress those requests and continue to handle saves initiated by
Obsidian's file lifecycle.

#### Scenario: Edit with autosave enabled

- **WHEN** an editor document changes while autosave is enabled
- **THEN** the plugin requests a debounced save from Obsidian

#### Scenario: Disable autosave while a file is open

- **WHEN** the user disables autosave and then edits an already open file
- **THEN** the edit does not request a debounced save

### Requirement: Line wrapping

The plugin SHALL use the current line-wrapping setting for newly opened editors. When the user
changes the setting and closes the settings tab, the plugin SHALL update wrapping in its open
editors without changing their text, selections, or undo and redo history, or requesting a save.

#### Scenario: Toggle wrapping with unsaved edits

- **WHEN** the user changes `Wrap long lines` and closes settings while a plugin editor has unsaved
  text, a selection, and undo and redo history
- **THEN** the editor uses the new wrapping setting and preserves the text, selection, and history
- **AND** the wrapping update does not request a save

### Requirement: JSON Lines validation rules

The JSON Lines editor SHALL accept an empty document or one JSON value per line. It SHALL accept LF
and CRLF line endings and an optional newline after the last record. It SHALL report an error with
the line number for each blank, whitespace-only, or malformed record line.

#### Scenario: Validate multiple JSON value types

- **WHEN** the editor validates lines containing `{"id":1}`, `null`, and `[2]` as separate records
  followed by a final newline
- **THEN** validation returns no errors

#### Scenario: Validate blank and malformed records

- **WHEN** an empty line and a malformed JSON value appear among otherwise valid records
- **THEN** validation reports a separate error at each affected line

### Requirement: JSON Lines diagnostics and saving

The JSON Lines editor SHALL show line diagnostics during editing when its validation worker is
available and validate again as needed on save. It SHALL fall back to synchronous validation on
save if the worker is unavailable. If the document changes during save validation, the editor
SHALL discard the result. It SHALL delegate a save to Obsidian when validation reports no errors
for the current text. If validation reports errors, it SHALL block the save and report the file
name and error count.

#### Scenario: Show validation errors in the editor

- **WHEN** the validation worker detects invalid records in the current document
- **THEN** the editor shows diagnostics on the affected lines and in the lint gutter

#### Scenario: Attempt to save invalid text

- **WHEN** a save validates the current text and finds errors
- **THEN** the editor displays the diagnostics, reports the file name and error count, and skips
  writing the invalid text
- **AND** further ordinary save attempts suppress repeat notices until a save validates successfully

#### Scenario: Attempt to save and clear invalid text

- **WHEN** Obsidian requests a save with `clear` set and the current text has validation errors
- **THEN** the plugin shows the notice again and rejects the save request

#### Scenario: Save with the validation worker unavailable

- **WHEN** Obsidian requests a save and the validation worker is unavailable
- **THEN** the plugin checks the current text using synchronous validation and delegates the save
  only if validation succeeds

#### Scenario: Edit while a save is being validated

- **WHEN** the document changes before validation for a pending save completes
- **THEN** the plugin discards that result and skips the pending save

## Obsidian API references

The host defines extension registration, file-menu callbacks, vault file creation, and opening a
new workspace tab.
[Extension registration](https://github.com/obsidianmd/obsidian-developer-docs/blob/c56c7e770ba25dd0ea392aacf4588f9425970d36/en/Reference/TypeScript%20API/Plugin/registerExtensions.md)
[Context menus](https://github.com/obsidianmd/obsidian-developer-docs/blob/c56c7e770ba25dd0ea392aacf4588f9425970d36/en/Plugins/User%20interface/Context%20menus.md)
[Vault.create](https://github.com/obsidianmd/obsidian-developer-docs/blob/c56c7e770ba25dd0ea392aacf4588f9425970d36/en/Reference/TypeScript%20API/Vault/create.md)
[Workspace.getLeaf](https://github.com/obsidianmd/obsidian-developer-docs/blob/c56c7e770ba25dd0ea392aacf4588f9425970d36/en/Reference/TypeScript%20API/Workspace/getLeaf_1.md)

Obsidian's text file view defines the save lifecycle, debounced save requests, and the editor reset
signal when switching files.
[TextFileView](https://github.com/obsidianmd/obsidian-developer-docs/blob/c56c7e770ba25dd0ea392aacf4588f9425970d36/en/Reference/TypeScript%20API/TextFileView.md)
[TextFileView.setViewData](https://github.com/obsidianmd/obsidian-developer-docs/blob/c56c7e770ba25dd0ea392aacf4588f9425970d36/en/Reference/TypeScript%20API/TextFileView/setViewData.md)
