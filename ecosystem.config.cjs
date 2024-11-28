module.exports = {
  apps: [
    {
      name: "nextjs-chat-app", // 启动任务
      script: "npm",
      args: "start",
      instances: "max", // 根据 CPU 核心数自动启动多实例
      watch: false, // 不监听文件变化
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
    },
  ],
};
