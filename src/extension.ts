// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as root from "./cernRoot";
import * as data from "./taskAndDebugConfigs";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  root.validate();

  // set enable command
  const configureEnvironmentCmd = vscode.commands.registerCommand(
    `${root.rootNamespace}.configureEnvironment`,
    () => {
      const config = vscode.workspace.getConfiguration(root.rootNamespace);
      if (config.get("intellisense")) {
        root.enableIntelliSense();
      }

      const vscodeDir = root.getVSCodeDir();
      if (vscodeDir === undefined) {
        vscode.window.showErrorMessage("No workspace folder open.");
        return;
      }
      const indentation = 4; //TODO: set to workspace indentation
      if (config.get("buildAndRunTasks")) {
        root.injectTasks([data.buildTask, data.runTask], vscodeDir, indentation);
      }
      if (config.get("debuggingConfiguration")) {
        root.injectDebugConfig(data.debugConfig, vscodeDir, indentation);
        root.injectTasks([data.debugTask], vscodeDir, indentation);
      }
    },
  );
  context.subscriptions.push(configureEnvironmentCmd);
}

// This method is called when your extension is deactivated
export function deactivate() {}
