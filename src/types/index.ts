export interface FolderDuplicationOptions {
  sourcePath: string;
  targetPath: string;
  excludePatterns?: string[];
}

export interface NamingStrategy {
  generateName(baseName: string): string;
}

export interface FileSystemAdapter {
  copyDirectory(source: string, target: string, excludePatterns?: string[]): Promise<void>;
  exists(path: string): Promise<boolean>;
  createDirectory(path: string): Promise<void>;
}

export interface VSCodeAdapter {
  getWorkspaceFolders(): readonly WorkspaceFolder[] | undefined;
  getConfiguration<T>(section: string, defaultValue: T): T;
  showInputBox(options: InputBoxOptions): Promise<string | undefined>;
  showErrorMessage(message: string): Promise<void>;
  showInformationMessage(message: string): Promise<void>;
  withProgress<R>(
    options: ProgressOptions,
    task: (progress: Progress<{ message?: string; increment?: number }>, token: CancellationToken) => Promise<R>
  ): Promise<R>;
  openFolder(uri: Uri, newWindow: boolean): Promise<void>;
}

export interface WorkspaceFolder {
  readonly uri: Uri;
  readonly name: string;
  readonly index: number;
}

export interface Uri {
  readonly fsPath: string;
  readonly scheme: string;
  readonly authority: string;
  readonly path: string;
  readonly query: string;
  readonly fragment: string;
  with(change: {
    scheme?: string;
    authority?: string;
    path?: string;
    query?: string;
    fragment?: string;
  }): Uri;
}

export interface InputBoxOptions {
  prompt?: string;
  placeHolder?: string;
  value?: string;
  validateInput?(value: string): string | undefined | null | Promise<string | undefined | null>;
}

export interface ProgressOptions {
  location: number;
  title?: string;
  cancellable?: boolean;
}

export interface Progress<T> {
  report(value: T): void;
}

export interface CancellationToken {
  readonly isCancellationRequested: boolean;
  readonly onCancellationRequested: (listener: () => void) => { dispose(): void };
}