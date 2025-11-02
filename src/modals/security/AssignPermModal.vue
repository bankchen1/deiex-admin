<template>
  <a-modal
    :open="open"
    title="Assign Permissions"
    :width="720"
    :confirm-loading="loading"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div class="assign-perm-modal">
      <a-alert
        v-if="roleInfo"
        :message="`Assigning permissions to role: ${roleInfo.name}`"
        type="info"
        show-icon
        style="margin-bottom: 16px"
      />

      <a-input-search
        v-model:value="searchText"
        placeholder="Search permissions..."
        style="margin-bottom: 16px"
      />

      <a-tree
        v-model:checked-keys="selectedPermissions"
        :tree-data="filteredPermissionTree"
        checkable
        :height="400"
        :field-names="{ title: 'title', key: 'key', children: 'children' }"
      >
        <template #title="{ title }">
          <span v-html="highlightText(title)"></span>
        </template>
      </a-tree>

      <div class="selected-count">Selected: {{ selectedPermissions.length }} permissions</div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PermissionNode, Role } from '@/services/api/config.security'

interface Props {
  open: boolean
  roleInfo?: Role | null
  permissionTree: PermissionNode[]
  initialPermissions?: string[]
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'confirm', permissions: string[]): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  initialPermissions: () => [],
})

const emit = defineEmits<Emits>()

const searchText = ref('')
const selectedPermissions = ref<string[]>([])

// Filter permission tree based on search
const filteredPermissionTree = computed(() => {
  if (!searchText.value) {
    return props.permissionTree
  }

  const filterTree = (nodes: PermissionNode[]): PermissionNode[] => {
    return nodes.reduce((acc, node) => {
      const matchesSearch = node.title.toLowerCase().includes(searchText.value.toLowerCase())
      const filteredChildren = node.children ? filterTree(node.children) : []

      if (matchesSearch || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children,
        })
      }

      return acc
    }, [] as PermissionNode[])
  }

  return filterTree(props.permissionTree)
})

// Highlight search text
function highlightText(text: string) {
  if (!searchText.value) {
    return text
  }

  const regex = new RegExp(`(${searchText.value})`, 'gi')
  return text.replace(regex, '<span style="color: #1890ff; font-weight: 600;">$1</span>')
}

watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      selectedPermissions.value = [...props.initialPermissions]
      searchText.value = ''
    }
  }
)

function handleOk() {
  emit('confirm', selectedPermissions.value)
}

function handleCancel() {
  emit('update:open', false)
  emit('cancel')
}
</script>

<style scoped>
.assign-perm-modal {
  padding: 8px 0;
}

.selected-count {
  margin-top: 16px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
}
</style>
