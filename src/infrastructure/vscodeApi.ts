import * as vscode from 'vscode';
import {
  VSCodeAdapter,
  WorkspaceFolder,
  Uri,
  InputBoxOptions,
  ProgressOptions,
  Progress
} from '../types';

export class VSCodeApiAdapter implements VSCodeAdapter {
  getWorkspaceFolders(): readonly WorkspaceFolder[] | undefined {
    return vscode.workspace.workspaceFolders as WorkspaceFolder[] | undefined;
  }

  getConfiguration<T>(section: string, defaultValue: T): T {
    const config = vscode.workspace.getConfiguration('folderDuplicator');
    return config.get<T>(section, defaultValue);
  }

  async showInputBox(options: InputBoxOptions): Promise<string | undefined> {
    return vscode.window.showInputBox(options as vscode.InputBoxOptions);
  }

  async showErrorMessage(message: string): Promise<void> {
    await vscode.window.showErrorMessage(message);
  }

  async showInformationMessage(message: string): Promise<void> {
    await vscode.window.showInformationMessage(message);
  }

  async withProgress<R>(
    options: ProgressOptions,
    task: (progress: Progress<{ message?: string; increment?: number }>) => Promise<R>
  ): Promise<R> {
    return vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: options.title,
        cancellable: options.cancellable
      },
      task as any
    );
  }

  async openFolder(uri: Uri, newWindow: boolean): Promise<void> {
    const vscodeUri = vscode.Uri.file(uri.fsPath);
    await vscode.commands.executeCommand(
      'vscode.openFolder',
      vscodeUri,
      { forceNewWindow: newWindow }
    );
  }
}