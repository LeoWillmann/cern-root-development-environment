# cern-root-development-environment README

Initialize your workspace to develop and run code with the Cern ROOT framework. This extension adds the options to enable intellisense for ROOT and create tasks to run (on the ROOT interpreter) and build c++ code.

## Features

* `cernRoot.configureEnvironment` command to enable intellisense and add tasks and launch debug configurations.

Open the **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`).

![Executing configure command](https://github.com/LeoWillmann/cern-root-development-environment/blob/master/images/executing_command.png?raw=true)

The extension will create or update `.vscode/tasks.json` (contains build tasks). These tasks can be executed **Command Palette** and running `Tasks: Run Task` This gives you a task selection menu. Alternatively create a keyboard shortcut for that command.

![Executing configure command](https://github.com/LeoWillmann/cern-root-development-environment/blob/master/images/buildTasks.png?raw=true)

To debug, set breakpoints in your c++ code and press **F5** or select **Run -> Start Debugging** to start debugging.

![Executing configure command](https://github.com/LeoWillmann/cern-root-development-environment/blob/master/images/debugger.png?raw=true)

All tasks and debugging actions execute on the file that is currently open in the editor. If you have a single entrypoint such as a `main.cpp` it is encouraged to change the `${file}` mentions in [.vscode/tasks.json](.vscode/tasks.json).

## Requirements

Need to have `ROOTSYS` environment variable configured to point to a valid root install.

This extension is dependent on the `ms-vscode.cpptools` extension to provide intellisense.

## Extension Settings

Change what actions are completed when the `cernRoot.configureEnvironment` command is called

* `cernRoot.intellisense`, enables intellisense generation.
* `cernRoot.buildAndRunTasks`, creates build and run tasks.
* `cernRoot.debuggingConfiguration`, creates debug build task and debug launch config.

## Known Issues

None
