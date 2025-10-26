#!/bin/bash

# 克隆项目
git clone https://github.com/yourname/your-nextjs-app.git
cd your-nextjs-app

# 构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f nextjs-app