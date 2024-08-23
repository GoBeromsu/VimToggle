import { MarkdownView, Plugin } from "obsidian";

export default class VimTogglePlugin extends Plugin {
	async onload() {
		this.registerEvent(
			this.app.workspace.on("file-open", async () => {
				const view =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (view) {
					const editor = (view as any).sourceMode?.cmEditor?.cm?.cm;
					editor.on("vim-mode-change", () => {
						console.log("Insert mode : ", this.isInsertMode());
					});
				}
			})
		);
	}

	isInsertMode() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return null;

		const editor = view.editor;
		const cm = (editor as any).cm;
		const vimState = cm?.cm?.state?.vim;
		return vimState.insertMode;
	}
}
