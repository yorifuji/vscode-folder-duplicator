import { cp, access, mkdir } from 'fs/promises';
import * as path from 'path';
import { FileSystemAdapter } from '../types';

export class NodeFileSystemAdapter implements FileSystemAdapter {
  async copyDirectory(
    source: string,
    target: string,
    excludePatterns: string[] = []
  ): Promise<void> {
    await cp(source, target, {
      recursive: true,
      dereference: false,
      filter: (src) => {
        const name = path.basename(src);
        return !this.shouldExclude(name, excludePatterns);
      }
    });
  }

  async exists(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }

  async createDirectory(path: string): Promise<void> {
    await mkdir(path, { recursive: true });
  }

  private shouldExclude(name: string, patterns: string[]): boolean {
    return patterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(
          '^' + pattern.replace(/\*/g, '.*') + '$'
        );
        return regex.test(name);
      }
      return name === pattern;
    });
  }
}