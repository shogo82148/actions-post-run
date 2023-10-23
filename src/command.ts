import { mkdtemp, writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { rmRF, which } from "@actions/io";
import { exec } from "@actions/exec";
import { debug } from "@actions/core";
import { parse, ParseEntry } from "shell-quote";

interface Input {
  shell?: string;
  run: string;
  workingDirectory?: string;
}

export async function runCommand(input: Input): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "actions-post-run-"));
  debug(`Created temporary directory ${dir}`);

  try {
    const shell = await getShell(input.shell);
    const filePath = join(dir, "run" + (shell.ext ? "." + shell.ext : ""));
    await writeFile(filePath, input.run, "utf8");
    debug(`Wrote script to ${filePath}`);

    const commandLine = `"${shell.command}"`;
    const args = replacePlaceholder(shell.args, filePath);
    debug(`Running command ${commandLine} ${args.join(" ")}`);
    await exec(commandLine, args, {
      cwd: input.workingDirectory,
    });
  } finally {
    await rmRF(dir);
    debug(`Removed temporary directory ${dir}`);
  }
  return "";
}

interface Shell {
  command: string;
  args: string[];
  ext: string;
}

async function getShell(shell?: string): Promise<Shell> {
  if (!shell) {
    const bash = await which("bash", false);
    if (bash) {
      return {
        command: bash,
        args: ["-e", "{0}"],
        ext: "sh",
      };
    }

    // fallback to sh
    const sh = await which("sh", true);
    return {
      command: sh,
      args: ["-e", "{0}"],
      ext: "sh",
    };
  }

  // bash
  if (shell === "bash") {
    const bash = await which("bash", false);
    if (bash) {
      return {
        command: bash,
        args: ["--noprofile", "--norc", "-eo", "pipefail", "{0}"],
        ext: "sh",
      };
    }

    // fallback to sh
    const sh = await which("sh", true);
    if (sh) {
      return {
        command: sh,
        args: ["-e", "{0}"],
        ext: "sh",
      };
    }
  }

  // sh
  if (shell === "sh") {
    const sh = await which("sh", true);
    return {
      command: sh,
      args: ["-e", "{0}"],
      ext: "sh",
    };
  }

  // pwsh
  if (shell === "pwsh") {
    const pwsh = await which("pwsh", true);
    return {
      command: pwsh,
      args: ["-command", ". '{0}'"],
      ext: "ps1",
    };
  }

  // python
  if (shell === "python") {
    const python = await which("python", true);
    return {
      command: python,
      args: ["{0}"],
      ext: "py",
    };
  }

  // cmd
  if (shell === "cmd") {
    return {
      command: process.env.ComSpec || "cmd",
      args: ["/D", "/E:ON", "/V:OFF", "/S", "/C", 'CALL "{0}"'],
      ext: "cmd",
    };
  }

  // powershell
  if (shell === "powershell") {
    const powershell = await which("powershell", true);
    return {
      command: powershell,
      args: ["-command", ". '{0}'"],
      ext: "ps1",
    };
  }

  // custom shell
  const args = stringifyParseEntries(parse(shell));
  return {
    command: args[0],
    args: args.slice(1),
    ext: "",
  };
}

function stringifyParseEntries(entries: ParseEntry[]): string[] {
  return entries.map((entry) => {
    if (typeof entry === "string") {
      return entry;
    }
    if ("op" in entry && entry.op === "glob") {
      return entry.pattern;
    }
    if ("op" in entry) {
      return entry.op;
    }
    return "";
  });
}

function replacePlaceholder(args: string[], filename: string): string[] {
  return args.map((arg) => arg.replace("{0}", filename));
}
