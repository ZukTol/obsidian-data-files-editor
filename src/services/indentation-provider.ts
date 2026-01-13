import {keymap} from "@codemirror/view";
import {indentLess, indentWithTab, insertTab} from "@codemirror/commands";
import {Extension} from "@codemirror/state";
import {indentUnit} from "@codemirror/language";

export const getIndentByTabExtension = (): Extension[] => 
	[
		keymap.of([indentWithTab]),
		indentUnit.of("    ")
	];





const insertFourSpaces = (view: any) => {
	const { state, dispatch } = view;
	const selection = state.selection.main;
	
	
	if (selection.from === selection.to) {
		const transaction = state.update({
			changes: {
				from: selection.from,
				to: selection.to,
				insert: "    " // Insert four spaces at cursor
			},
			selection: {
				anchor: selection.from + 4
			}
		});
		dispatch(transaction);
		return true;
	}
	
	// If one or more characters are selected, indent all selected lines
	const startLine = state.doc.lineAt(selection.from);
	const endLine = state.doc.lineAt(selection.to);
	const changes = [];
	
	// Add 4 spaces to the beginning of each line in the selection
	for (let lineNumber = startLine.number; lineNumber <= endLine.number; lineNumber++) {
		const line = state.doc.line(lineNumber);
		changes.push({
			from: line.from,
			to: line.from,
			insert: "    "
		});
	}
	
	
	const linesIndented = endLine.number - startLine.number + 1;
	const spacesAdded = linesIndented * 4;
	
	const transaction = state.update({
		changes: changes,
		selection: {
			anchor: selection.from + 4, 
			head: selection.to + spacesAdded 
		}
	});
	dispatch(transaction);
	return true;
};


const removeFourSpaces = (view: any) => {
	const { state, dispatch } = view;
	const selection = state.selection.main;
	
	// If no characters are selected 
	if (selection.from === selection.to) {
		const line = state.doc.lineAt(selection.from);
		const lineText = line.text;
		

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
	}
	
	// If one or more characters are selected, unindent all selected lines
	const startLine = state.doc.lineAt(selection.from);
	const endLine = state.doc.lineAt(selection.to);
	const changes = [];
	let totalSpacesRemoved = 0;
	let firstLineSpacesRemoved = 0;
	
	// Remove up to 4 spaces from the beginning of each line in the selection
	for (let lineNumber = startLine.number; lineNumber <= endLine.number; lineNumber++) {
		const line = state.doc.line(lineNumber);
		const lineText = line.text;
		const leadingSpaces = lineText.match(/^ */)?.[0] || "";
		const spacesToRemove = Math.min(4, leadingSpaces.length);
		
		if (spacesToRemove > 0) {
			changes.push({
				from: line.from,
				to: line.from + spacesToRemove,
				insert: ""
			});
			
			totalSpacesRemoved += spacesToRemove;
			if (lineNumber === startLine.number) {
				firstLineSpacesRemoved = spacesToRemove;
			}
		}
	}
	

	if (changes.length === 0) {
		return false;
	}
	
	// Calculate new selection range accounting for removed spaces
	const transaction = state.update({
		changes: changes,
		selection: {
			anchor: Math.max(startLine.from, selection.from - firstLineSpacesRemoved),
			head: Math.max(selection.to - totalSpacesRemoved, startLine.from)
		}
	});
	dispatch(transaction);
	return true;
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
