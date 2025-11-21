export interface TaskDefinition {
  label: string;
  type: string;
  command: string;
  args: string[];
  problemMatcher: [];
}

export const debugTask: TaskDefinition = {
  label: "Cern Root: Build ROOT Program (Debug)",
  type: "shell",
  command: "bash",
  args: [
    "-c",
    "g++ -ggdb ${file} -o ${fileDirname}/${fileBasenameNoExtension} $($ROOTSYS/bin/root-config --cflags --libs)",
    "# Everything needs to be on a single line due to the 'bash -c' command.",
  ],
  problemMatcher: [],
};

export const buildTask: TaskDefinition = {
  label: "Cern Root: Build ROOT Program (Production)",
  type: "shell",
  command: "bash",
  args: [
    "-c",
    "g++ ${file} -o ${fileDirname}/${fileBasenameNoExtension} $($ROOTSYS/bin/root-config --cflags --libs)",
    "# Everything needs to be on a single line due to the 'bash -c' command.",
  ],
  problemMatcher: [],
};

export const runTask: TaskDefinition = {
  label: "Cern Root: Run in ROOT interpreter as Macro",
  type: "shell",
  command: "${env:ROOTSYS}/bin/root",
  args: ["-l", "-q", "${file}"],
  problemMatcher: [],
};

export const debugConfig = {
  name: "Debug ROOT Program",
  type: "cppdbg",
  request: "launch",
  program:
    "${workspaceFolder}/${relativeFileDirname}/${fileBasenameNoExtension}",
  args: [],
  stopAtEntry: false,
  cwd: "${workspaceFolder}",
  environment: [],
  externalConsole: false,
  MIMode: "gdb",
  preLaunchTask: debugTask.label,
};
