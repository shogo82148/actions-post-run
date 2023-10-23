import { mkdtemp, writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { rmRF } from "@actions/io";
import { exec } from "@actions/exec";
import { debug } from "@actions/core";

interface Input {
  shell?: string;
  run: string;
  workingDirectory?: string;
}

export async function runCommand(input: Input): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "actions-post-run-"));
  debug(`Created temporary directory ${dir}`);

  try {
    const filePath = join(dir, "command.sh");
    await writeFile(filePath, input.run, "utf8");
    await exec("bash", ["-e", filePath], {
      cwd: input.workingDirectory,
    });
  } finally {
    await rmRF(dir);
    debug(`Removed temporary directory ${dir}`);
  }
  return "";
}
