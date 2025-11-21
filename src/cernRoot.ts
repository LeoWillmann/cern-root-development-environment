import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as cp from "child_process";

export const rootNamespace = "cernRoot";
const includePath = "${env:ROOTSYS}/include/";
const rootSys = process.env.ROOTSYS;

export function validate() {
  if (!rootSys) {
    vscode.window.showWarningMessage(
      "ROOTSYS environment variable not set. Please set ROOTSYS to the output of 'root-config --prefix'",
    );
  }
}

export async function enableIntelliSense() {
  enableSetCppStandard();

  const config = vscode.workspace.getConfiguration("C_Cpp.default");
  const currentIncludes: string[] = config.get("includePath") ?? [];

  console.log(currentIncludes);

  // Set intellisense include path
  if (!currentIncludes.includes(includePath)) {
    await config.update(
      "includePath",
      [...currentIncludes, includePath],
      vscode.ConfigurationTarget.Workspace,
    );
    vscode.window.showInformationMessage(
      `Added ROOT include path: ${includePath}`,
    );
  }
}

// Set intellisense C++ standard
async function enableSetCppStandard() {
  // Run root-config --cxxstandard to get the standard
  let cppStandard: string | undefined;
  const command = `${rootSys}/bin/root-config --cxxstandard`;
  try {
    cppStandard = cp.execSync(command).toString().trim();
  } catch (err) {
    vscode.window.showErrorMessage(`Failed to run ${command}`);
    return;
  }

  const config = vscode.workspace.getConfiguration("C_Cpp.default");
  await config.update(
    "cppStandard",
    "c++" + cppStandard,
    vscode.ConfigurationTarget.Workspace,
  );
  vscode.window.showInformationMessage(
    `Set IntelliSense C++ standard to ${cppStandard}`,
  );
}

export function getVSCodeDir() {
  const wsFolders = vscode.workspace.workspaceFolders;
  if (!wsFolders) {
    return undefined;
  }

  const wsPath = wsFolders[0].uri.fsPath;
  const vscodeDir = path.join(wsPath, ".vscode");
  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir);
  }
  return vscodeDir;
}

export function injectTasks(tasks: any[], vscodeDir: string, indentation: number) {
  const tasksFile = path.join(vscodeDir, "tasks.json");
  let tasksJson: any;

  if (!fs.existsSync(tasksFile)) {
    tasksJson = {
      version: "2.0.0",
      tasks: tasks,
    };
    fs.writeFileSync(tasksFile, JSON.stringify(tasksJson, null, indentation));
    vscode.window.showInformationMessage("Created tasks.json with ROOT tasks.");
    return;
  }

  try {
    tasksJson = JSON.parse(fs.readFileSync(tasksFile, "utf8"));
    if (!Array.isArray(tasksJson.tasks)) {
      tasksJson.tasks = [];
    }

    const failedTasks: string[] = [];

    for (const task of tasks) {
      // Only add if not already present
      const exists = tasksJson.tasks.some((t: any) => t.label === task.label);

      if (!exists) {
        tasksJson.tasks.push(task);
        fs.writeFileSync(
          tasksFile,
          JSON.stringify(tasksJson, null, indentation),
        );
      } else {
        failedTasks.push(task.label);
      }
    }

    if (failedTasks.length === 0) {
      vscode.window.showInformationMessage(
        "Created tasks.json with ROOT tasks.",
      );
    } else {
      vscode.window.showInformationMessage(
        `Failed to add '${failedTasks.join(
          ", ",
        )}' task(s) due to label naming conflict.`,
      );
    }
  } catch (err) {
    vscode.window.showErrorMessage("Could not parse tasks.json: " + err);
  }
}

export function injectDebugConfig(debugConfig: any, vscodeDir: string, indentation: number) {
  const launchFile = path.join(vscodeDir, "launch.json");

  if (!fs.existsSync(launchFile)) {
    const launchJson = {
      version: "0.2.0",
      configurations: [debugConfig],
    };
    fs.writeFileSync(launchFile, JSON.stringify(launchJson, null, indentation));
    vscode.window.showInformationMessage(
      "Created launch.json with ROOT debug configuration.",
    );
    return;
  }
  try {
    const launchJson = JSON.parse(fs.readFileSync(launchFile, "utf8"));
    if (!Array.isArray(launchJson.configurations)) {
      launchJson.configurations = [];
    }

    const exists = launchJson.configurations.some(
      (c: any) => c.name === debugConfig.name,
    );
    if (!exists) {
      launchJson.configurations.push(debugConfig);
      fs.writeFileSync(
        launchFile,
        JSON.stringify(launchJson, null, indentation),
      );
      vscode.window.showInformationMessage(
        "Added ROOT debug configuration to launch.json.",
      );
    } else {
      vscode.window.showInformationMessage(
        "ROOT debug configuration already exists in launch.json.",
      );
    }
  } catch (err) {
    vscode.window.showErrorMessage("Could not parse launch.json: " + err);
  }
}
