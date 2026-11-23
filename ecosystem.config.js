// PM2 config for the Hostinger VPS (serves myloanwala.com + besthomeloanindia.com).
// Started by hostinger-deploy/server/release.sh, or by hand:  pm2 start ecosystem.config.js
// Keep instances at 1: the AI blog scheduler runs inside this process.
// Listens on 127.0.0.1 only; Caddy (ports 80/443) forwards both domains here.
module.exports = {
  apps: [
    {
      name: "myloanwala",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      instances: 1,
      exec_mode: "fork",
      env: { NODE_ENV: "production" },
      max_memory_restart: "700M",
      time: true,
    },
  ],
};
