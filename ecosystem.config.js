// PM2 config for Hostinger VPS:  pm2 start ecosystem.config.js
// Keep instances at 1 — the AI blog scheduler runs inside this process.
module.exports = {
  apps: [
    {
      name: "myloanwala",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      exec_mode: "fork",
      env: { NODE_ENV: "production" },
      max_memory_restart: "700M",
    },
  ],
};
