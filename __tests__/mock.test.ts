import { runCommand } from "../src/command";
import { expect, test, jest } from "@jest/globals";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as fs from "fs/promises";

jest.mock("fs/promises");
jest.mock("@actions/io");
jest.mock("@actions/exec");

test("bash", async () => {
  const mockMkdtemp = jest.mocked(fs.mkdtemp);
  mockMkdtemp.mockResolvedValue("/tmp/actions-post-run-1234");

  const spyRmRF = jest.spyOn(io, "rmRF");
  const mockWitch = jest.mocked(io.which);
  mockWitch.mockResolvedValue("/bin/bash");
  const spyExec = jest.spyOn(exec, "exec");
  await runCommand({
    shell: "bash",
    run: "echo hello world > hello.txt",
  });

  expect(mockMkdtemp).toBeCalled();
  expect(spyRmRF).toBeCalledWith("/tmp/actions-post-run-1234");
  expect(spyExec).toBeCalledWith(
    '"/bin/bash"',
    ["--noprofile", "--norc", "-eo", "pipefail", "/tmp/actions-post-run-1234/run.sh"],
    {
      cwd: undefined,
    },
  );
});

test("sh", async () => {
  const mockMkdtemp = jest.mocked(fs.mkdtemp);
  mockMkdtemp.mockResolvedValue("/tmp/actions-post-run-1234");

  const spyRmRF = jest.spyOn(io, "rmRF");
  const mockWitch = jest.mocked(io.which);
  mockWitch.mockResolvedValue("/bin/sh");
  const spyExec = jest.spyOn(exec, "exec");
  await runCommand({
    shell: "sh",
    run: "echo hello world > hello.txt",
  });

  expect(mockMkdtemp).toBeCalled();
  expect(spyRmRF).toBeCalledWith("/tmp/actions-post-run-1234");
  expect(spyExec).toBeCalledWith('"/bin/sh"', ["-e", "/tmp/actions-post-run-1234/run.sh"], {
    cwd: undefined,
  });
});

test("pwsh", async () => {
  const mockMkdtemp = jest.mocked(fs.mkdtemp);
  mockMkdtemp.mockResolvedValue("/tmp/actions-post-run-1234");

  const spyRmRF = jest.spyOn(io, "rmRF");
  const mockWitch = jest.mocked(io.which);
  mockWitch.mockResolvedValue("/bin/pwsh");
  const spyExec = jest.spyOn(exec, "exec");
  await runCommand({
    shell: "pwsh",
    run: "Write-Host 'hello world' > hello.txt",
  });

  expect(mockMkdtemp).toBeCalled();
  expect(spyRmRF).toBeCalledWith("/tmp/actions-post-run-1234");
  expect(spyExec).toBeCalledWith('"/bin/pwsh"', ["-command", ". '/tmp/actions-post-run-1234/run.ps1'"], {
    cwd: undefined,
  });
});

test("python", async () => {
  const mockMkdtemp = jest.mocked(fs.mkdtemp);
  mockMkdtemp.mockResolvedValue("/tmp/actions-post-run-1234");

  const spyRmRF = jest.spyOn(io, "rmRF");
  const mockWitch = jest.mocked(io.which);
  mockWitch.mockResolvedValue("/bin/python");
  const spyExec = jest.spyOn(exec, "exec");
  await runCommand({
    shell: "python",
    run: "print('hello world')",
  });

  expect(mockMkdtemp).toBeCalled();
  expect(spyRmRF).toBeCalledWith("/tmp/actions-post-run-1234");
  expect(spyExec).toBeCalledWith('"/bin/python"', ["/tmp/actions-post-run-1234/run.py"], {
    cwd: undefined,
  });
});

test("powershell", async () => {
  const mockMkdtemp = jest.mocked(fs.mkdtemp);
  mockMkdtemp.mockResolvedValue("/tmp/actions-post-run-1234");

  const spyRmRF = jest.spyOn(io, "rmRF");
  const mockWitch = jest.mocked(io.which);
  mockWitch.mockResolvedValue("/bin/powershell");
  const spyExec = jest.spyOn(exec, "exec");
  await runCommand({
    shell: "powershell",
    run: "Write-Host 'hello world' > hello.txt",
  });

  expect(mockMkdtemp).toBeCalled();
  expect(spyRmRF).toBeCalledWith("/tmp/actions-post-run-1234");
  expect(spyExec).toBeCalledWith('"/bin/powershell"', ["-command", ". '/tmp/actions-post-run-1234/run.ps1'"], {
    cwd: undefined,
  });
});

test("custom shell", async () => {
  const mockMkdtemp = jest.mocked(fs.mkdtemp);
  mockMkdtemp.mockResolvedValue("/tmp/actions-post-run-1234");

  const spyRmRF = jest.spyOn(io, "rmRF");
  const mockWitch = jest.mocked(io.which);
  mockWitch.mockResolvedValue("/bin/powershell");
  const spyExec = jest.spyOn(exec, "exec");
  await runCommand({
    shell: "perl {0}",
    run: "Write-Host 'hello world' > hello.txt",
  });

  expect(mockMkdtemp).toBeCalled();
  expect(spyRmRF).toBeCalledWith("/tmp/actions-post-run-1234");
  expect(spyExec).toBeCalledWith('"perl"', ["/tmp/actions-post-run-1234/run"], {
    cwd: undefined,
  });
});
