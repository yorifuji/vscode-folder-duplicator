import { NamingStrategy } from '../types';

export class TimestampNamingStrategy implements NamingStrategy {
  generateName(baseName: string): string {
    const timestamp = new Date().toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .slice(0, -5);
    return `${baseName}_${timestamp}`;
  }
}

export class AutoTimestampNamingStrategy implements NamingStrategy {
  generateName(baseName: string): string {
    const cleanedName = this.removeExistingTimestamp(baseName);
    const timestamp = this.generateTimestamp();
    return `${cleanedName}.${timestamp}`;
  }

  private removeExistingTimestamp(name: string): string {
    // Remove suffix if it ends with a dot followed by 14 digits
    return name.replace(/\.\d{14}$/, '');
  }

  private generateTimestamp(): string {
    const now = new Date();
    const pad = (n: number): string => n.toString().padStart(2, '0');
    
    return now.getFullYear().toString() +
           pad(now.getMonth() + 1) +
           pad(now.getDate()) +
           pad(now.getHours()) +
           pad(now.getMinutes()) +
           pad(now.getSeconds());
  }
}

export class SequentialNamingStrategy implements NamingStrategy {
  generateName(baseName: string): string {
    const match = baseName.match(/_(\d+)$/);
    if (match?.[1]) {
      const num = parseInt(match[1], 10);
      return baseName.replace(/_\d+$/, `_${num + 1}`);
    }
    return `${baseName}_1`;
  }
}

export class CustomNamingStrategy implements NamingStrategy {
  constructor(private readonly customName: string) {}

  generateName(_baseName: string): string {
    return this.customName;
  }
}
