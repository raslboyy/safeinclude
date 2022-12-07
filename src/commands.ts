import * as vscode from "vscode";
import { v4 as uuidv4 } from "uuid";

function getGUID(): string {
    let uuid = uuidv4();
    return uuid.toUpperCase().replace(/-/g, '_');
}

function createDirectives(uri: vscode.Uri): Array<string> {
    let guid = getGUID();
    return [
        "#ifndef " + guid + "\n",
        "#define " + guid + "\n",
        "#endif /* " + guid + " */\n"
    ]
}

export async function setUp(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined)
        return;
    editor.selection.active.translate(2);
    await editor.edit((edit) => {
        const document = editor.document;
        const bottomLine = document.lineAt(document.lineCount - 1).text;
        if (bottomLine.length !== 0)
          edit.insert(new vscode.Position(document.lineCount, 0), "\n");
        
        const directives = createDirectives(document.uri);
        edit.insert(
            new vscode.Position(0, 0),
            directives[0] + directives[1] + "\n"
        );
        edit.insert(new vscode.Position(document.lineCount, 0), "\n\n" + directives[2]);
    });
}