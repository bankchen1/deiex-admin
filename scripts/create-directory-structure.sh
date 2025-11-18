#!/bin/bash

# 创建新的目录结构
echo "Creating new directory structure..."

# 创建 views 目录
mkdir -p src/views

# 创建 ui 目录结构
mkdir -p src/ui/app-shell
mkdir -p src/ui/pages
mkdir -p src/ui/sections
mkdir -p src/ui/widgets
mkdir -p src/ui/primitives

echo "✅ New directory structure created:"
echo "   src/views/"
echo "   src/ui/app-shell/"
echo "   src/ui/pages/"
echo "   src/ui/sections/"
echo "   src/ui/widgets/"
echo "   src/ui/primitives/"

# 创建 composables 目录（如果不存在）
mkdir -p src/composables

echo "✅ Directory structure setup completed!"

echo ""
echo "Next steps:"
echo "1. Move your page components from src/pages/ to src/views/ and rename them to *View.vue"
echo "2. Create corresponding UI components in the appropriate src/ui/ subdirectories"
echo "3. Update imports in your code to reference the new paths"
echo "4. Create composables for data fetching in src/composables/"