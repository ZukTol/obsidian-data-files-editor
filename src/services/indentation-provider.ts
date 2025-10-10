import {keymap} from "@codemirror/view";
import {indentLess, indentWithTab, insertTab} from "@codemirror/commands";
import {Extension} from "@codemirror/state";
import {indentUnit} from "@codemirror/language";

export const getIndentByTabExtension = (): Extension[] => 
	[
		keymap.of([indentWithTab]),
		indentUnit.of("    ")
	];



const insertFourSpaces = (view: {state: any, dispatch: any}) => {
	const { state, dispatch } = view;
	const selection = state.selection.main;
	const transaction = state.update({
		changes: {
			from: selection.from,
			to: selection.to,
			insert: "    " // Insert four spaces
		},
		selection: {
			anchor: selection.from + 4
		}
	});
	dispatch(transaction);
	return true;
};




const removeFourSpaces = (view: {state: any, dispatch: any}) => {
	const { state, dispatch } = view;
	const selection = state.selection.main;
	const line = state.doc.lineAt(selection.from);
	const lineText = line.text;
	
	// Check if the line starts with at least 4 spaces
	if (lineText.startsWith("    ")) {
		const transaction = state.update({
			changes: {
				from: line.from,
				to: line.from + 4,
				insert: "" // Remove four spaces
			},
			selection: {
				anchor: Math.max(line.from, selection.from - 4)
			}
		});
		dispatch(transaction);
		return true;
	}
	
	// If line doesn't start with 4 spaces, try to remove what's available
	const leadingSpaces = lineText.match(/^ */)?.[0] || "";
	if (leadingSpaces.length > 0) {
		const spacesToRemove = Math.min(4, leadingSpaces.length);
		const transaction = state.update({
			changes: {
				from: line.from,
				to: line.from + spacesToRemove,
				insert: ""
			},
			selection: {
				anchor: Math.max(line.from, selection.from - spacesToRemove)
			}
		});
		dispatch(transaction);
		return true;
	}
	
	return false; // No indentation to remove
};


export const getInsertTabsExtension = (): Extension[] => 
	[
		keymap.of([
			// {
			// 	key: 'Tab',
			// 	preventDefault: true,
			// 	run: insertTab,
			// },
			// {
			// 	key: 'Shift-Tab',
			// 	preventDefault: true,
			// 	run: indentLess,
			// },			
			{
				key: 'Tab',
				preventDefault: true,
				run: insertFourSpaces,
			},			
			{
				key: 'Shift-Tab',
				preventDefault: true,
				run: removeFourSpaces,
			}
		])
	];
