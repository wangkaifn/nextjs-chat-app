## 项目启动

1.  npm install
2.  npm run dev
3.  npm run build

## docker 启动

```
docker build -t nextjs-chat-app .
docker run -d -p 3000:3000 nextjs-chat-app
```

## pm2 启动

```bash
 npm install -g pm2
 pm2 start ecosystem.config.cjs nextjs-chat-app
```
