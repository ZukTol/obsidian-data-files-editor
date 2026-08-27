import {keymap} from "@codemirror/view";
import {indentLess, indentWithTab} from "@codemirror/commands";
import {Extension} from "@codemirror/state";
import {indentUnit} from "@codemirror/language";

export const getIndentByTabExtension = (): Extension[] => 
	[
		keymap.of([indentWithTab]),
		indentUnit.of("    ")
	];

export const getInsertTabsExtension = (): Extension[] => 
	[
		keymap.of([
			// {
			// 	key: 'Tab',
			// 	preventDefault: true,
			// 	run: insertTab,
			// },
			{
				key: 'Shift-Tab',
				preventDefault: true,
				run: indentLess,
			},
		])
	];
