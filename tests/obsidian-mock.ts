export const notices: string[] = [];

export class Notice {
	constructor(message: string) {
		notices.push(message);
	}
}

export class TextFileView {
	file: {name: string} | null = null;
	saved: Array<boolean | undefined> = [];

	constructor(..._args: unknown[]) {
	}

	async save(clear?: boolean): Promise<void> {
		this.saved.push(clear);
	}

	onClose(): Promise<void> {
		return Promise.resolve();
	}
}
