const readline = require("readline");
const { spawnSync } = require("child_process");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Run safe bulk apply now? Type YES: ", answer => {
  rl.close();

  if (answer.trim() !== "YES") {
    console.log("Cancelled.");
    process.exit(0);
  }

  spawnSync("node", ["apply-all.js"], { stdio: "inherit" });
});
