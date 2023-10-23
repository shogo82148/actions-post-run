import { runCommand } from "../src/command";
import { mkdtemp, readFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { expect, test } from "@jest/globals";

test("run script", async () => {
  const dir = await mkdtemp(join(tmpdir(), "actions-post-run-"));
  await runCommand({
    shell: "bash",
    run: "echo hello world > hello.txt",
    workingDirectory: dir,
  });
  const data = await readFile(join(dir, "hello.txt"), "utf8");
  expect(data).toBe("hello world\n");
});
