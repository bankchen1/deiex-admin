#!/bin/bash

# Fix unused imports in specific files

# src/forms/icons/IconMappingForm.vue - remove watch
sed -i '' 's/import { ref, reactive, watch } from/import { ref, reactive } from/' src/forms/icons/IconMappingForm.vue

# src/forms/mappings/RedirectForm.vue - remove Dayjs
sed -i '' 's/import { ref, reactive, watch, type Dayjs } from/import { ref, reactive, watch } from/' src/forms/mappings/RedirectForm.vue

# src/modals/security/EditRoleDrawer.vue - remove watch
sed -i '' 's/import { ref, computed, watch } from/import { ref, computed } from/' src/modals/security/EditRoleDrawer.vue

# src/modals/strategies/RunBacktestDrawer.vue - remove watch
sed -i '' 's/import { ref, reactive, computed, watch } from/import { ref, reactive, computed } from/' src/modals/strategies/RunBacktestDrawer.vue

# src/modals/content/NotificationDrawer.vue - remove message
sed -i '' 's/import { ref } from/import { ref } from/' src/modals/content/NotificationDrawer.vue
sed -i '' '/^import { message } from/d' src/modals/content/NotificationDrawer.vue

# src/layouts/components/SidebarNav.vue - remove unused import
sed -i '' '/^import { ref } from/d' src/layouts/components/SidebarNav.vue

echo "Unused imports fixed"
