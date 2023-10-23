import * as core from "@actions/core";
import { runCommand } from "./command";

async function run(): Promise<void> {
  try {
    const shell = core.getInput("shell");
    const inputRun = core.getInput("run");
    const workingDirectory = core.getInput("working-directory");
    await runCommand({
      shell,
      run: inputRun,
      workingDirectory,
    });
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

void run();
