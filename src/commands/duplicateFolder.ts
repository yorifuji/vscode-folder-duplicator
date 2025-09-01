import * as path from 'path';
import { VSCodeAdapter, Uri } from '../types';
import { FolderDuplicationService } from '../services/folderService';
import { CustomNamingStrategy, AutoTimestampNamingStrategy } from '../services/namingService';
import { NodeFileSystemAdapter } from '../infrastructure/fileSystem';

export class DuplicateFolderCommand {
  constructor(private readonly vscode: VSCodeAdapter) {}

  async execute(): Promise<void> {
    try {
      const workspaceFolders = this.vscode.getWorkspaceFolders();
      
      if (!workspaceFolders || workspaceFolders.length === 0) {
        await this.vscode.showErrorMessage('フォルダが開かれていません');
        return;
      }

      const currentFolder = workspaceFolders[0]!;
      const sourcePath = currentFolder.uri.fsPath;
      const folderName = path.basename(sourcePath);

      // 自動でタイムスタンプ付きの名前を生成
      const autoNamingStrategy = new AutoTimestampNamingStrategy();
      const suggestedName = autoNamingStrategy.generateName(folderName);

      const newName = await this.vscode.showInputBox({
        prompt: '新しいフォルダ名を入力してください（Enterで自動生成名を使用）',
        placeHolder: suggestedName,
        value: suggestedName,
        validateInput: (value: string) => {
          if (!value || value.trim() === '') {
            return 'フォルダ名を入力してください';
          }
          if (value.includes('/') || value.includes('\\')) {
            return 'フォルダ名に / や \\ は使用できません';
          }
          return undefined;
        }
      });

      if (!newName) {
        return;
      }

      await this.vscode.withProgress(
        {
          location: 15,
          title: 'フォルダを複製しています...',
          cancellable: false
        },
        async (progress) => {
          progress.report({ message: '準備中...', increment: 10 });

          const fileSystem = new NodeFileSystemAdapter();
          const namingStrategy = new CustomNamingStrategy(newName);
          const service = new FolderDuplicationService(fileSystem, namingStrategy);

          progress.report({ message: 'フォルダをコピー中...', increment: 30 });

          const targetPath = service.generateTargetPath(sourcePath);
          const availablePath = await service.findAvailablePath(targetPath);

          // 設定から除外パターンを取得
          const excludePatterns = this.vscode.getConfiguration<string[]>('excludePatterns', []);

          await service.duplicateFolder({
            sourcePath,
            targetPath: availablePath,
            excludePatterns
          });

          progress.report({ message: '新しいウィンドウで開いています...', increment: 50 });

          const newUri: Uri = {
            fsPath: availablePath,
            scheme: 'file',
            authority: '',
            path: availablePath,
            query: '',
            fragment: '',
            with: () => newUri
          };

          await this.vscode.openFolder(newUri, true);

          progress.report({ message: '完了', increment: 10 });
        }
      );

      await this.vscode.showInformationMessage(
        `フォルダが正常に複製されました: ${newName}`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      await this.vscode.showErrorMessage(`フォルダの複製に失敗しました: ${message}`);
    }
  }
}