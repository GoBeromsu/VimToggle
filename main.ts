import { MarkdownView, Plugin, Editor, EditorPosition } from "obsidian";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
type Result<T, E> = { success: true; value: T } | { success: false; error: E };

export default class VimTogglePlugin extends Plugin {
	async onload() {
		this.registerEvent(
			// active-leaf-change event Updates the state
			// when the user switches to a different editor window.
			this.app.workspace.on("active-leaf-change", () => {
				const view =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (view) {
					console.log(
						"normal mode on active-leaf-change",
						this.isInsertMode()
					);
				}
			})
		);
	}

	isInsertMode() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		const cm = (view as any).sourceMode?.cmEditor?.cm?.cm;
		return cm?.state?.vim?.insertMode;
	}
	async getImSelectPath(): Promise<Result<string, string>> {
		try {
			const { stdout } = await execAsync("which im-select");
			return { success: true, value: stdout.trim() };
		} catch (error) {
			return {
				success: false,
				error: `Error finding im-select: ${error.message}`,
			};
		}
	}
	async getInputMethod(
		imSelectPath: string
	): Promise<Result<string, string>> {
		try {
			const { stdout } = await execAsync(`${imSelectPath}`);
			return { success: true, value: stdout.trim() };
		} catch (error) {
			return {
				success: false,
				error: `Error getting current input method: ${error.message}`,
			};
		}
	}
}
