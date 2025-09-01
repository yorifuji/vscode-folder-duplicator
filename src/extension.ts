import * as vscode from 'vscode';
import { DuplicateFolderCommand } from './commands/duplicateFolder';
import { VSCodeApiAdapter } from './infrastructure/vscodeApi';

export function activate(context: vscode.ExtensionContext) {
  const vscodeAdapter = new VSCodeApiAdapter();
  const duplicateFolderCommand = new DuplicateFolderCommand(vscodeAdapter);

  const disposable = vscode.commands.registerCommand(
    'folder-duplicator.duplicate',
    async () => {
      await duplicateFolderCommand.execute();
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}