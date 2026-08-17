import { Diagnostic } from "@codemirror/lint";

interface JsonlWorkerRequest {
	id: number;
	content: string;
}

interface JsonlWorkerResponse {
	id: number;
	diagnostics: Diagnostic[];
}

interface PendingValidation {
	id: number;
	content: string;
	resolve: (diagnostics: Diagnostic[]) => void;
	reject: (reason: Error) => void;
}

export function getJsonlDiagnostics(content: string): Diagnostic[] {
	const diagnostics: Diagnostic[] = [];

	if (content.length === 0)
		return diagnostics;

	const lines = content.split("\n");
	let offset = 0;

	for (let index = 0; index < lines.length; index++) {
		const line = lines[index];
		const lineNumber = index + 1;
		const isTrailingLine = index === lines.length - 1 && line.length === 0;

		if (isTrailingLine)
			continue;

		if (line.trim().length === 0) {
			diagnostics.push({
				from: offset,
				to: offset + line.length,
				severity: "error",
				message: `Line ${lineNumber} is blank. Each JSONL line must contain a JSON value.`
			});
		} else {
			try {
				JSON.parse(line);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				diagnostics.push({
					from: offset,
					to: offset + line.length,
					severity: "error",
					message: `Line ${lineNumber}: ${message}`
				});
			}
		}

		offset += line.length + 1;
	}

	return diagnostics;
}

export default class JsonlValidatorWorker {
	private worker: Worker | null = null;
	private workerUrl: string | null = null;
	private pending: PendingValidation | null = null;
	private pendingPromise: Promise<Diagnostic[]> | null = null;
	private cachedContent: string | null = null;
	private cachedDiagnostics: Diagnostic[] = [];
	private nextRequestId = 0;

	validate(content: string): Promise<Diagnostic[]> {
		if (content === this.cachedContent)
			return Promise.resolve(this.cachedDiagnostics);

		if (this.pending?.content === content && this.pendingPromise)
			return this.pendingPromise;

		if (this.pending)
			this.stopWorker();

		if (!this.worker)
			this.startWorker();

		const id = ++this.nextRequestId;
		this.pendingPromise = new Promise((resolve, reject) => {
			this.pending = {id, content, resolve, reject};
			this.worker?.postMessage({id, content} as JsonlWorkerRequest);
		});
		return this.pendingPromise;
	}

	destroy(): void {
		this.stopWorker();
	}

	private startWorker(): void {
		const workerSource = `
			const validate = ${getJsonlDiagnostics.toString()};
			self.onmessage = event => {
				const { id, content } = event.data;
				self.postMessage({ id, diagnostics: validate(content) });
			};
		`;

		this.workerUrl = URL.createObjectURL(new Blob([workerSource], {type: "text/javascript"}));
		try {
			this.worker = new Worker(this.workerUrl);
		} catch (error) {
			this.releaseWorker();
			throw error;
		}
		this.worker.onmessage = (event: MessageEvent<JsonlWorkerResponse>) => {
			if (!this.pending || event.data.id !== this.pending.id)
				return;

			const {content, resolve} = this.pending;
			this.cachedContent = content;
			this.cachedDiagnostics = event.data.diagnostics;
			this.pending = null;
			this.pendingPromise = null;
			resolve(event.data.diagnostics);
		};
		this.worker.onerror = (event: ErrorEvent) =>
			this.rejectPending(new Error(event.message || "JSONL validation worker failed"));
		this.worker.onmessageerror = () =>
			this.rejectPending(new Error("JSONL validation worker returned an unreadable response"));
	}

	private rejectPending(error: Error): void {
		const pending = this.pending;
		this.pending = null;
		this.pendingPromise = null;
		this.releaseWorker();
		pending?.reject(error);
	}

	private stopWorker(): void {
		const pending = this.pending;
		this.pending = null;
		this.pendingPromise = null;
		this.releaseWorker();
		pending?.resolve([]);
	}

	private releaseWorker(): void {
		this.worker?.terminate();
		this.worker = null;

		if (this.workerUrl) {
			URL.revokeObjectURL(this.workerUrl);
			this.workerUrl = null;
		}
	}
}
