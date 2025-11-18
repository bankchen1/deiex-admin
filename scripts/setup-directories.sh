#!/bin/bash

# 设置目录结构创建脚本的权限
chmod +x scripts/create-directory-structure.sh
chmod +x scripts/migration.sh

echo "✅ Script permissions set!"

# 运行目录结构创建脚本
echo "Creating directory structure..."
bash scripts/create-directory-structure.sh

echo "✅ Directory structure creation completed!"