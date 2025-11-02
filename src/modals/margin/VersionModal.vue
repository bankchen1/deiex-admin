<template>
  <a-modal
    :open="open"
    :title="`Version ${version?.version || ''} Details`"
    :width="800"
    :footer="null"
    @cancel="handleClose"
  >
    <a-spin :spinning="loading">
      <div v-if="version">
        <!-- Version Information -->
        <a-descriptions bordered :column="2" style="margin-bottom: 16px">
          <a-descriptions-item label="Version">
            <a-tag color="blue">{{ version.version }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Status">
            <a-tag :color="version.version === currentVersion ? 'green' : 'default'">
              {{ version.version === currentVersion ? 'Current' : 'Historical' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Created By">
            {{ version.createdBy }}
          </a-descriptions-item>
          <a-descriptions-item label="Created At">
            {{ formatDate(version.createdAt) }}
          </a-descriptions-item>
          <a-descriptions-item label="Tags" :span="2">
            <a-space v-if="version.tags && version.tags.length > 0">
              <a-tag v-for="tag in version.tags" :key="tag" color="purple">
                {{ tag }}
              </a-tag>
            </a-space>
            <span v-else style="color: #999">No tags</span>
          </a-descriptions-item>
          <a-descriptions-item label="Notes" :span="2">
            <div style="white-space: pre-wrap">{{ version.notes || 'No notes' }}</div>
          </a-descriptions-item>
        </a-descriptions>

        <!-- Version Content -->
        <a-tabs v-model:active-key="activeTab">
          <a-tab-pane key="templates" tab="Templates">
            <a-card
              v-if="versionData?.templates && versionData.templates.length > 0"
              :bordered="false"
            >
              <a-collapse>
                <a-collapse-panel
                  v-for="template in versionData.templates"
                  :key="template.id"
                  :header="`${template.name} - ${template.tiers.length} tier(s)`"
                >
                  <a-descriptions bordered :column="1" size="small">
                    <a-descriptions-item label="Name">
                      {{ template.name }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Description">
                      {{ template.description || 'N/A' }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Tiers">
                      <a-table
                        :columns="tierColumns"
                        :data-source="template.tiers"
                        :pagination="false"
                        size="small"
                      />
                    </a-descriptions-item>
                  </a-descriptions>
                </a-collapse-panel>
              </a-collapse>
            </a-card>
            <a-empty v-else description="No templates in this version" />
          </a-tab-pane>

          <a-tab-pane key="bindings" tab="Bindings">
            <a-card
              v-if="versionData?.bindings && versionData.bindings.length > 0"
              :bordered="false"
            >
              <a-table
                :columns="bindingColumns"
                :data-source="versionData.bindings"
                :pagination="{ pageSize: 10 }"
                size="small"
              />
            </a-card>
            <a-empty v-else description="No bindings in this version" />
          </a-tab-pane>

          <a-tab-pane key="summary" tab="Summary">
            <a-descriptions bordered :column="1">
              <a-descriptions-item label="Total Templates">
                <a-tag color="blue">{{ versionData?.templates?.length || 0 }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Total Bindings">
                <a-tag color="green">{{ versionData?.bindings?.length || 0 }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Unique Symbols">
                <a-tag color="purple">{{ uniqueSymbols }}</a-tag>
              </a-descriptions-item>
            </a-descriptions>

            <a-card
              v-if="versionData?.templates && versionData.templates.length > 0"
              title="Template Summary"
              size="small"
              style="margin-top: 16px"
            >
              <a-list :data-source="versionData.templates" size="small">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta
                      :title="item.name"
                      :description="`${item.tiers.length} tier(s) - Max leverage: ${getMaxLeverage(item)}`"
                    />
                  </a-list-item>
                </template>
              </a-list>
            </a-card>
          </a-tab-pane>
        </a-tabs>

        <!-- Actions -->
        <a-divider />
        <a-space>
          <a-button
            v-if="version.version !== currentVersion"
            type="primary"
            danger
            @click="handleRollback"
          >
            <template #icon><RollbackOutlined /></template>
            Rollback to This Version
          </a-button>
          <a-button @click="handleViewDiff">
            <template #icon><DiffOutlined /></template>
            Compare with Current
          </a-button>
          <a-button @click="handleExport">
            <template #icon><ExportOutlined /></template>
            Export Version
          </a-button>
        </a-space>
      </div>
      <a-empty v-else description="No version data available" />
    </a-spin>

    <template #footer>
      <a-button @click="handleClose">Close</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RollbackOutlined, DiffOutlined, ExportOutlined } from '@ant-design/icons-vue'
import { formatDate as formatDateUtil } from '@/utils/date'

interface Version {
  id: string
  version: string
  createdAt: string
  createdBy: string
  notes: string
  tags: string[]
}

interface Props {
  open: boolean
  version?: Version | null
  versionData?: any
  currentVersion?: string
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'rollback', versionId: string): void
  (e: 'viewDiff', versionId: string): void
  (e: 'export', versionId: string): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  version: null,
  versionData: null,
  currentVersion: '',
  loading: false,
})

const emit = defineEmits<Emits>()

const activeTab = ref('summary')

const tierColumns = [
  {
    title: 'Notional From',
    dataIndex: 'notionalFrom',
    key: 'notionalFrom',
  },
  {
    title: 'Notional To',
    dataIndex: 'notionalTo',
    key: 'notionalTo',
  },
  {
    title: 'Initial Margin',
    dataIndex: 'initialMarginRate',
    key: 'initialMarginRate',
    customRender: ({ text }: { text: number }) => `${(text * 100).toFixed(2)}%`,
  },
  {
    title: 'Maintenance Margin',
    dataIndex: 'maintenanceMarginRate',
    key: 'maintenanceMarginRate',
    customRender: ({ text }: { text: number }) => `${(text * 100).toFixed(2)}%`,
  },
  {
    title: 'Max Leverage',
    dataIndex: 'maxLeverage',
    key: 'maxLeverage',
    customRender: ({ text }: { text: number }) => `${text}x`,
  },
]

const bindingColumns = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
  },
  {
    title: 'Template',
    dataIndex: 'templateName',
    key: 'templateName',
  },
]

const uniqueSymbols = computed(() => {
  if (!props.versionData?.bindings) return 0
  const symbols = new Set(props.versionData.bindings.map((b: any) => b.symbol))
  return symbols.size
})

function formatDate(date: string): string {
  return formatDateUtil(date, 'YYYY-MM-DD HH:mm:ss')
}

function getMaxLeverage(template: any): number {
  if (!template.tiers || template.tiers.length === 0) return 0
  return Math.max(...template.tiers.map((t: any) => t.maxLeverage))
}

function handleRollback() {
  if (props.version) {
    emit('rollback', props.version.id)
  }
}

function handleViewDiff() {
  if (props.version) {
    emit('viewDiff', props.version.id)
  }
}

function handleExport() {
  if (props.version) {
    emit('export', props.version.id)
  }
}

function handleClose() {
  emit('update:open', false)
  emit('close')
}
</script>

<style scoped>
:deep(.ant-collapse) {
  background: transparent;
}

:deep(.ant-collapse-item) {
  margin-bottom: 8px;
}

:deep(.ant-descriptions-item-label) {
  font-weight: 500;
}
</style>
