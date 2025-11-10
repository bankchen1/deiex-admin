<template>
  <div class="permission-tree">
    <a-card title="Permission Tree" :loading="loading">
      <template #extra>
        <a-space>
          <a-button size="small" @click="expandAll">Expand All</a-button>
          <a-button size="small" @click="collapseAll">Collapse All</a-button>
        </a-space>
      </template>

      <a-input-search
        v-model:value="searchText"
        placeholder="Search permissions..."
        style="margin-bottom: 16px"
      />

      <a-tree
        v-model:expanded-keys="expandedKeys"
        :tree-data="filteredTreeData"
        :field-names="{ title: 'title', key: 'key', children: 'children' }"
        show-line
        :height="600"
      >
        <template #title="{ title, key }">
          <span v-html="highlightText(title)"></span>
          <a-tag v-if="isLeafNode(key)" size="small" style="margin-left: 8px">
            {{ key }}
          </a-tag>
        </template>
      </a-tree>

      <a-empty v-if="filteredTreeData.length === 0" description="No permissions found" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PermissionNode } from '@/services/api/facade'

interface Props {
  treeData: PermissionNode[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const searchText = ref('')
const expandedKeys = ref<string[]>([])

// Filter tree data based on search
const filteredTreeData = computed(() => {
  if (!searchText.value) {
    return props.treeData
  }

  const filterTree = (nodes: PermissionNode[]): PermissionNode[] => {
    return nodes.reduce((acc, node) => {
      const matchesSearch =
        node.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
        node.key.toLowerCase().includes(searchText.value.toLowerCase())
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

  return filterTree(props.treeData)
})

// Auto-expand when searching
watch(searchText, (newVal) => {
  if (newVal) {
    expandAll()
  }
})

function expandAll() {
  const keys: string[] = []
  const collectKeys = (nodes: PermissionNode[]) => {
    nodes.forEach((node) => {
      keys.push(node.key)
      if (node.children) {
        collectKeys(node.children)
      }
    })
  }
  collectKeys(props.treeData)
  expandedKeys.value = keys
}

function collapseAll() {
  expandedKeys.value = []
}

function isLeafNode(key: string): boolean {
  const findNode = (nodes: PermissionNode[], targetKey: string): PermissionNode | null => {
    for (const node of nodes) {
      if (node.key === targetKey) {
        return node
      }
      if (node.children) {
        const found = findNode(node.children, targetKey)
        if (found) return found
      }
    }
    return null
  }

  const node = findNode(props.treeData, key)
  return node ? !node.children || node.children.length === 0 : false
}

function highlightText(text: string) {
  if (!searchText.value) {
    return text
  }

  const regex = new RegExp(`(${searchText.value})`, 'gi')
  return text.replace(regex, '<span style="color: #1890ff; font-weight: 600;">$1</span>')
}
</script>

<style scoped>
.permission-tree {
  height: 100%;
}
</style>
