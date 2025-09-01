import * as path from 'path';
import {
  FileSystemAdapter,
  FolderDuplicationOptions,
  NamingStrategy
} from '../types';

export class FolderDuplicationService {
  constructor(
    private readonly fileSystem: FileSystemAdapter,
    private readonly namingStrategy: NamingStrategy
  ) {}

  async duplicateFolder(options: FolderDuplicationOptions): Promise<string> {
    const { sourcePath, targetPath, excludePatterns } = options;

    if (!(await this.fileSystem.exists(sourcePath))) {
      throw new Error(`Source folder does not exist: ${sourcePath}`);
    }

    if (await this.fileSystem.exists(targetPath)) {
      throw new Error(`Target folder already exists: ${targetPath}`);
    }

    await this.fileSystem.copyDirectory(
      sourcePath,
      targetPath,
      excludePatterns
    );

    return targetPath;
  }

  generateTargetPath(sourcePath: string): string {
    const baseName = path.basename(sourcePath);
    const parentDir = path.dirname(sourcePath);
    const newName = this.namingStrategy.generateName(baseName);
    return path.join(parentDir, newName);
  }

  async findAvailablePath(basePath: string): Promise<string> {
    let targetPath = basePath;
    let counter = 1;

    while (await this.fileSystem.exists(targetPath)) {
      const dir = path.dirname(basePath);
      const name = path.basename(basePath);
      targetPath = path.join(dir, `${name}_${counter}`);
      counter++;
    }

    return targetPath;
  }
}