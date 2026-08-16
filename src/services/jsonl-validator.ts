import { Diagnostic } from "@codemirror/lint";
import { Text } from "@codemirror/state";

export function getJsonlDiagnostics(doc: Text): Diagnostic[] {
	const diagnostics: Diagnostic[] = [];

	if (doc.length === 0)
		return diagnostics;

	for (let lineNumber = 1; lineNumber <= doc.lines; lineNumber++) {
		const line = doc.line(lineNumber);
		const isTrailingLine = lineNumber === doc.lines && line.from === doc.length;

		if (isTrailingLine)
			continue;

		if (line.text.trim().length === 0) {
			diagnostics.push({
				from: line.from,
				to: line.to,
				severity: "error",
				message: `Line ${lineNumber} is blank. Each JSONL line must contain a JSON value.`
			});
			continue;
		}

		try {
			JSON.parse(line.text);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			diagnostics.push({
				from: line.from,
				to: line.to,
				severity: "error",
				message: `Line ${lineNumber}: ${message}`
			});
		}
	}

	return diagnostics;
}
