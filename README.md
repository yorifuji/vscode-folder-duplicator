# Folder Duplicator

Duplicate the currently open folder and open it in a new window.

## Features

- Duplicate the current workspace folder alongside the original.
- Support custom naming of the new folder.
- Handles large folders with progress notifications.
- Customize exclude patterns via settings.

## Usage

1. Open a folder in VS Code.
2. Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`).
3. Run "Duplicate Current Folder".
4. Enter a new folder name (or accept the suggested one).
5. After duplication completes, the folder opens in a new window automatically.

## Settings

You can customize exclude patterns from VS Code settings:

```json
{
  "folderDuplicator.excludePatterns": [
    "node_modules",
    ".git",
    "dist",
    "*.log",
    ".DS_Store"
  ]
}
```

By default, the exclude patterns list is empty (all files are copied).

## Development

```bash
# Install dependencies
npm install

# Type-check TypeScript
npm run check

# Build
npm run compile

# Run tests
npm test

# Watch mode (dev)
npm run watch
```

## Debugging

1. Open the project folder in VS Code.
2. Press F5 to start debugging.
3. In the new VS Code window, run the command to verify behavior.

## Architecture

Layered architecture:
- **Commands layer**: VS Code command handlers
- **Services layer**: Business logic
- **Infrastructure layer**: File system / VS Code API

## License

MIT
