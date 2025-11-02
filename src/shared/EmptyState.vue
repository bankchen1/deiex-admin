<template>
  <div class="empty-state" :class="{ compact: size === 'small' }">
    <div class="empty-icon">
      <component :is="iconComponent" v-if="iconComponent" />
      <InboxOutlined v-else />
    </div>
    <div class="empty-title">{{ title }}</div>
    <div v-if="description" class="empty-description">{{ description }}</div>
    <div v-if="$slots.action || action" class="empty-action">
      <slot name="action">
        <a-button v-if="action" :type="actionType" @click="handleAction">
          {{ actionText }}
        </a-button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  InboxOutlined,
  FileSearchOutlined,
  FolderOpenOutlined,
  DisconnectOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'

interface Props {
  title?: string
  description?: string
  icon?: 'inbox' | 'search' | 'folder' | 'disconnect' | 'error' | Component
  size?: 'default' | 'small'
  action?: () => void
  actionText?: string
  actionType?: 'primary' | 'default' | 'dashed'
}

interface Emits {
  (e: 'action'): void
}

const { t } = useI18n()

const props = withDefaults(defineProps<Props>(), {
  title: () => t('common.noData'),
  description: '',
  icon: 'inbox',
  size: 'default',
  actionText: () => t('common.create'),
  actionType: 'primary',
})

const emit = defineEmits<Emits>()

// Icon mapping
const iconMap: Record<string, Component> = {
  inbox: InboxOutlined,
  search: FileSearchOutlined,
  folder: FolderOpenOutlined,
  disconnect: DisconnectOutlined,
  error: ExclamationCircleOutlined,
}

// Get icon component
const iconComponent = computed(() => {
  if (typeof props.icon === 'string') {
    return iconMap[props.icon] || InboxOutlined
  }
  return props.icon
})

// Handle action
function handleAction(): void {
  if (props.action) {
    props.action()
  }
  emit('action')
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-state.compact {
  padding: 24px 16px;
}

.empty-icon {
  font-size: 64px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-state.compact .empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
}

.empty-state.compact .empty-title {
  font-size: 14px;
  margin-bottom: 4px;
}

.empty-description {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 16px;
  max-width: 400px;
}

.empty-state.compact .empty-description {
  font-size: 12px;
  margin-bottom: 12px;
}

.empty-action {
  margin-top: 8px;
}
</style>
