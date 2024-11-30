# 使用官方的 Node.js 镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 设置 npm 镜像为淘宝镜像
RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pnpm
# 安装依赖
RUN pnpm install

# 复制所有文件到容器中
COPY . .

# 构建 Next.js 应用
RUN pnpm run build

# 声明环境变量
ENV PORT 1126

# 暴露端口
EXPOSE 1126

# 启动应用
CMD ["npm", "start"]