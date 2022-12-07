import * as vscode from 'vscode';
import {setUp} from './commands'

const setUpName = "safeinclude.setUp";

function isHeader(file: vscode.Uri): boolean {
	const headerExtensions = [".h", ".hpp", ".h++", ".hh"];
	return headerExtensions.some(extension => file.fsPath.endsWith(extension));
}

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand(setUpName, () => { setUp() }));

	vscode.workspace.onDidCreateFiles(
		async (event) => { 
			for (const file of event.files) {
				if (isHeader(file)) {
					vscode.workspace.openTextDocument(file)
						.then(doc =>
							vscode.window.showTextDocument(doc)
								.then(setUp)
					);
				}
			}
		}
	);

}

export function deactivate() {}
