import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { ensureStandaloneAssets } from "./standalone-assets.mjs";

const root = process.cwd();
const standaloneRoot = path.join(root, ".next", "standalone");
const serverPath = path.join(standaloneRoot, "server.js");

if (!fs.existsSync(serverPath)) {
  console.error("Standalone server is missing. Run `npm run build` before `npm start`.");
  process.exit(1);
}

ensureStandaloneAssets(root);

const args = process.argv.slice(2);
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  const next = args[index + 1];

  if ((arg === "-p" || arg === "--port") && next) {
    process.env.PORT = next;
    index += 1;
  } else if (arg?.startsWith("--port=")) {
    process.env.PORT = arg.slice("--port=".length);
  } else if ((arg === "-H" || arg === "--hostname") && next) {
    process.env.HOSTNAME = next;
    index += 1;
  } else if (arg?.startsWith("--hostname=")) {
    process.env.HOSTNAME = arg.slice("--hostname=".length);
  }
}

const child = spawn(process.execPath, [serverPath], {
  cwd: standaloneRoot,
  env: process.env,
  stdio: "inherit"
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
