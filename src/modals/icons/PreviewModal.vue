<template>
  <a-modal :open="open" title="Icon Preview" width="800px" :footer="null" @cancel="handleClose">
    <a-spin :spinning="loading">
      <div v-if="icon" class="preview-modal">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-card title="Light Version" size="small">
              <div class="preview-container">
                <img :src="icon.lightUrl" :alt="icon.name" class="preview-image" />
              </div>
              <a-divider />
              <div class="preview-info">
                <div class="info-item">
                  <span class="info-label">URL:</span>
                  <a-typography-text copyable :content="icon.lightUrl">
                    {{ truncateUrl(icon.lightUrl) }}
                  </a-typography-text>
                </div>
                <div class="info-item">
                  <span class="info-label">CDN Path:</span>
                  <a-typography-text copyable :content="icon.cdnPath">
                    {{ icon.cdnPath }}
                  </a-typography-text>
                </div>
              </div>
            </a-card>
          </a-col>

          <a-col :span="12">
            <a-card v-if="icon.darkUrl" title="Dark Version" size="small">
              <div class="preview-container dark">
                <img :src="icon.darkUrl" :alt="icon.name" class="preview-image" />
              </div>
              <a-divider />
              <div class="preview-info">
                <div class="info-item">
                  <span class="info-label">URL:</span>
                  <a-typography-text copyable :content="icon.darkUrl">
                    {{ truncateUrl(icon.darkUrl) }}
                  </a-typography-text>
                </div>
              </div>
            </a-card>
            <a-card v-else title="Dark Version" size="small">
              <a-empty description="No dark version available" />
            </a-card>
          </a-col>
        </a-row>

        <a-divider />

        <a-descriptions title="Icon Details" :column="2" bordered size="small">
          <a-descriptions-item label="Name">{{ icon.name }}</a-descriptions-item>
          <a-descriptions-item label="Type">
            <a-tag :color="icon.type === 'svg' ? 'blue' : 'green'">
              {{ icon.type.toUpperCase() }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Dimensions">
            {{ icon.width }}x{{ icon.height }}px
          </a-descriptions-item>
          <a-descriptions-item label="File Size">
            {{ formatFileSize(icon.fileSize) }}
          </a-descriptions-item>
          <a-descriptions-item label="Transparency">
            <a-tag :color="icon.hasTransparency ? 'success' : 'default'">
              {{ icon.hasTransparency ? 'Yes' : 'No' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Tags">
            <a-space wrap>
              <a-tag v-for="tag in icon.tags" :key="tag">{{ tag }}</a-tag>
              <span v-if="icon.tags.length === 0" style="color: rgba(0, 0, 0, 0.45)">
                No tags
              </span>
            </a-space>
          </a-descriptions-item>
          <a-descriptions-item label="Created At">
            {{ formatDate(icon.createdAt) }}
          </a-descriptions-item>
          <a-descriptions-item label="Updated At">
            {{ formatDate(icon.updatedAt) }}
          </a-descriptions-item>
        </a-descriptions>

        <a-divider />

        <div class="size-preview">
          <div class="size-preview-title">Size Preview</div>
          <a-space :size="24" align="center">
            <div v-for="size in previewSizes" :key="size" class="size-item">
              <img
                :src="icon.lightUrl"
                :alt="icon.name"
                :style="{ width: `${size}px`, height: `${size}px` }"
                class="size-image"
              />
              <div class="size-label">{{ size }}px</div>
            </div>
          </a-space>
        </div>

        <template v-if="showActions">
          <a-divider />
          <a-space>
            <a-button type="primary" @click="handleEdit"> Edit Details </a-button>
            <a-button @click="handleReplace"> Replace Files </a-button>
            <a-button danger @click="handleDelete"> Delete Icon </a-button>
          </a-space>
        </template>
      </div>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useIconsStore } from '@/stores/icons'
import type { IconAsset } from '@/services/api/facade'
import { formatDate } from '@/utils/date'

interface Props {
  open: boolean
  iconId?: string
  iconData?: IconAsset
  showActions?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'edit', icon: IconAsset): void
  (e: 'replace', icon: IconAsset): void
  (e: 'delete', icon: IconAsset): void
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
})

const emit = defineEmits<Emits>()

const iconsStore = useIconsStore()
const loading = ref(false)
const icon = ref<IconAsset | null>(null)

const previewSizes = [16, 24, 32, 48, 64]

// Watch for open state and load data
watch(
  () => props.open,
  async (newVal) => {
    if (newVal) {
      if (props.iconData) {
        icon.value = props.iconData
      } else if (props.iconId) {
        await loadIcon()
      }
    } else {
      icon.value = null
    }
  }
)

async function loadIcon() {
  if (!props.iconId) return

  loading.value = true
  try {
    const response = await iconsStore.fetchAssetById(props.iconId)
    icon.value = response.data
  } catch (error: any) {
    message.error('Failed to load icon details')
    handleClose()
  } finally {
    loading.value = false
  }
}

function truncateUrl(url: string, maxLength: number = 40): string {
  if (url.length <= maxLength) return url
  return url.substring(0, maxLength - 3) + '...'
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function handleEdit() {
  if (icon.value) {
    emit('edit', icon.value)
  }
}

function handleReplace() {
  if (icon.value) {
    emit('replace', icon.value)
  }
}

function handleDelete() {
  if (!icon.value) return

  Modal.confirm({
    title: 'Delete Icon',
    content: `Are you sure you want to delete "${icon.value.name}"? This action cannot be undone.`,
    okText: 'Delete',
    okType: 'danger',
    onOk: () => {
      if (icon.value) {
        emit('delete', icon.value)
      }
    },
  })
}

function handleClose() {
  emit('update:open', false)
}
</script>

<style scoped>
.preview-modal {
  padding: 8px 0;
}

.preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: #fafafa;
  border-radius: 4px;
  padding: 24px;
}

.preview-container.dark {
  background: #1f1f1f;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.info-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
  min-width: 70px;
}

.size-preview {
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.size-preview-title {
  font-weight: 500;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.size-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.size-image {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 4px;
  background: white;
}

.size-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
