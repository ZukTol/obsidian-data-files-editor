import {strict as assert} from "node:assert";
import {Diagnostic} from "@codemirror/lint";
import {getJsonlDiagnostics} from "../src/services/jsonl-validator";
import JsonlView from "../src/views/jsonl-view";
import {notices} from "./obsidian-mock";

interface DocumentStub {
	toString(): string;
}

interface EditorStub {
	state: {
		doc: DocumentStub;
		field(): undefined;
	};
	dispatchCount: number;
	dispatch(): void;
}

interface ValidatorStub {
	validate(content: string): Promise<Diagnostic[]>;
	destroy(): void;
}

interface JsonlViewHarness {
	validator: ValidatorStub;
	cmEditor: EditorStub;
	file: {name: string} | null;
	saved: Array<boolean | undefined>;
	save(clear?: boolean): Promise<void>;
}

function createEditor(content: string): EditorStub {
	return {
		state: {
			doc: {toString: () => content},
			field: () => undefined
		},
		dispatchCount: 0,
		dispatch() {
			this.dispatchCount++;
		}
	};
}

function createView(validator?: ValidatorStub): JsonlViewHarness {
	const view = new JsonlView(null as never, {settings: {}} as never) as unknown as JsonlViewHarness;
	if (validator)
		view.validator = validator;
	view.file = {name: "records.jsonl"};
	return view;
}

function resolvedValidator(diagnostics: Diagnostic[]): ValidatorStub {
	return {
		validate: async () => diagnostics,
		destroy: () => undefined
	};
}

async function run(): Promise<void> {
	assert.equal(getJsonlDiagnostics('{"a":1}\n{"b":2}').length, 0, "accepts LF records");
	assert.equal(getJsonlDiagnostics('{"a":1}\r\n{"b":2}\r\n').length, 0, "accepts CRLF records");
	assert.equal(getJsonlDiagnostics('{"a":1}\n{"b":2}\n').length, 0, "accepts a trailing newline");

	const blankLine = getJsonlDiagnostics('{"a":1}\n\n{"b":2}');
	assert.equal(blankLine.length, 1, "rejects an internal blank line");
	assert.match(blankLine[0].message, /^Line 2 /);

	const multipleErrors = getJsonlDiagnostics('{oops}\n{"valid":true}\nnope');
	assert.equal(multipleErrors.length, 2, "reports multiple invalid records");
	assert.match(multipleErrors[0].message, /^Line 1:/);
	assert.match(multipleErrors[1].message, /^Line 3:/);

	const originalWarn = console.warn;
	const globals = globalThis as unknown as {Worker: typeof Worker};
	const originalWorker = globals.Worker;
	console.warn = () => undefined;
	globals.Worker = class {
		constructor() {
			throw new Error("Worker blocked");
		}
	} as unknown as typeof Worker;
	try {
		const workerFailure = createView();
		workerFailure.cmEditor = createEditor('{"valid":true}');
		await workerFailure.save(false);
		assert.deepEqual(workerFailure.saved, [false], "uses synchronous fallback when the worker fails");

		workerFailure.cmEditor = createEditor("{oops}");
		await workerFailure.save(false);
		await workerFailure.save(false);
		assert.deepEqual(workerFailure.saved, [false], "fallback still blocks invalid JSONL");
		assert.equal(notices.length, 1, "does not repeat autosave notices for one invalid period");
	} finally {
		console.warn = originalWarn;
		globals.Worker = originalWorker;
	}

	let finishValidation: (diagnostics: Diagnostic[]) => void = () => undefined;
	const validation = new Promise<Diagnostic[]>(resolve => finishValidation = resolve);
	const staleDocument = createView({
		validate: () => validation,
		destroy: () => undefined
	});
	staleDocument.cmEditor = createEditor('{"before":true}');
	const save = staleDocument.save(false);
	staleDocument.cmEditor.state = createEditor('{"after":true}').state;
	finishValidation([]);
	await save;
	assert.equal(staleDocument.saved.length, 0, "discards validation after the document changes");

	const closeWithErrors = createView(resolvedValidator(multipleErrors));
	closeWithErrors.cmEditor = createEditor("{oops}");
	await assert.rejects(() => closeWithErrors.save(true), /Cannot save records\.jsonl/);

	console.log("JSONL validation tests passed");
}

export default run();
