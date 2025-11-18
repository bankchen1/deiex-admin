# Migration Script

This script helps with the migration from the old directory structure to the new one following the "唯一真源通用 Vue3 范式 v1.0".

```bash
#!/bin/bash

# This script creates the new directory structure and provides guidance for migration

echo "Creating new directory structure..."

# Create new directories
mkdir -p src/views
mkdir -p src/ui/app-shell
mkdir -p src/ui/pages
mkdir -p src/ui/sections
mkdir -p src/ui/widgets
mkdir -p src/ui/primitives

echo "New directory structure created:"
echo "src/views/"
echo "src/ui/app-shell/"
echo "src/ui/pages/"
echo "src/ui/sections/"
echo "src/ui/widgets/"
echo "src/ui/primitives/"

echo ""
echo "Next steps:"
echo "1. Move your page components from src/pages/ to src/views/ and rename them to *View.vue"
echo "2. Create corresponding UI components in the appropriate src/ui/ subdirectories"
echo "3. Update imports in your code to reference the new paths"
echo "4. Create composables for data fetching in src/composables/"

echo ""
echo "For example:"
echo "- Move src/pages/users/List.vue to src/views/users/UsersView.vue"
echo "- Create src/ui/pages/users/UsersPage.vue for the UI"
echo "- Create src/composables/useUsers.ts for data fetching"