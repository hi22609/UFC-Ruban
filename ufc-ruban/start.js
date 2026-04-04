/**
 * RUBAN Start Script
 * Runs server + Discord bot as child processes
 */
const { spawn } = require('child_process');
const path = require('path');

function start(name, script) {
  const proc = spawn('node', [script], {
    cwd: __dirname,
    stdio: 'inherit',
    env: process.env
  });
  proc.on('exit', (code) => {
    console.log(`[${name}] exited with code ${code} — restarting in 5s`);
    setTimeout(() => start(name, script), 5000);
  });
  proc.on('error', (err) => {
    console.error(`[${name}] error: ${err.message}`);
  });
  console.log(`[Start] Launched ${name} (${script})`);
  return proc;
}

start('Server', 'server/index.js');
setTimeout(() => start('Bot', 'scheduler.js'), 3000);
