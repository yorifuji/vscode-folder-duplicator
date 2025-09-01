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
        await this.vscode.showErrorMessage('No workspace folder is open');
        return;
      }

      const currentFolder = workspaceFolders[0]!;
      const sourcePath = currentFolder.uri.fsPath;
      const folderName = path.basename(sourcePath);

      // Generate a timestamped name automatically
      const autoNamingStrategy = new AutoTimestampNamingStrategy();
      const suggestedName = autoNamingStrategy.generateName(folderName);

      const newName = await this.vscode.showInputBox({
        prompt: 'Enter a new folder name',
        value: suggestedName,
        validateInput: (value: string) => {
          if (!value || value.trim() === '') {
            return 'Please enter a folder name';
          }
          if (value.includes('/') || value.includes('\\')) {
            return 'Folder name cannot contain / or \\' ;
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
          title: 'Duplicating folder...',
          cancellable: false
        },
        async (progress) => {
          progress.report({});

          const fileSystem = new NodeFileSystemAdapter();
          const namingStrategy = new CustomNamingStrategy(newName);
          const service = new FolderDuplicationService(fileSystem, namingStrategy);

          const targetPath = service.generateTargetPath(sourcePath);
          const availablePath = await service.findAvailablePath(targetPath);

          // Get exclude patterns from settings
          const excludePatterns = this.vscode.getConfiguration<string[]>('excludePatterns', []);

          await service.duplicateFolder({
            sourcePath,
            targetPath: availablePath,
            excludePatterns
          });

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
        }
      );

      await this.vscode.showInformationMessage(
        `Folder duplicated successfully: ${newName}`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      await this.vscode.showErrorMessage(`Failed to duplicate folder: ${message}`);
    }
  }
}
