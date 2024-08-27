import { MarkdownView, Plugin, Editor, EditorPosition } from "obsidian";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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

	private isInsertMode() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		const cm = (view as any).sourceMode?.cmEditor?.cm?.cm;
		return cm?.state?.vim?.insertMode;
	}
}
