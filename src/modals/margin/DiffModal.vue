<template>
  <a-modal
    :open="open"
    title="View Configuration Differences"
    :width="1000"
    :footer="null"
    @cancel="handleClose"
  >
    <a-spin :spinning="loading">
      <a-tabs v-model:active-key="activeTab">
        <a-tab-pane key="templates" tab="Template Changes">
          <div v-if="diffData?.templates">
            <!-- Added Templates -->
            <a-card
              v-if="diffData.templates.added && diffData.templates.added.length > 0"
              title="Added Templates"
              size="small"
              style="margin-bottom: 16px"
            >
              <a-collapse>
                <a-collapse-panel
                  v-for="template in diffData.templates.added"
                  :key="template.id"
                  :header="`${template.name} (New)`"
                >
                  <DiffViewer :old-value="null" :new-value="template" format="json" />
                </a-collapse-panel>
              </a-collapse>
            </a-card>

            <!-- Modified Templates -->
            <a-card
              v-if="diffData.templates.modified && diffData.templates.modified.length > 0"
              title="Modified Templates"
              size="small"
              style="margin-bottom: 16px"
            >
              <a-collapse>
                <a-collapse-panel
                  v-for="change in diffData.templates.modified"
                  :key="change.id"
                  :header="`${change.new.name} (Modified)`"
                >
                  <DiffViewer :old-value="change.old" :new-value="change.new" format="json" />
                </a-collapse-panel>
              </a-collapse>
            </a-card>

            <!-- Deleted Templates -->
            <a-card
              v-if="diffData.templates.deleted && diffData.templates.deleted.length > 0"
              title="Deleted Templates"
              size="small"
            >
              <a-collapse>
                <a-collapse-panel
                  v-for="template in diffData.templates.deleted"
                  :key="template.id"
                  :header="`${template.name} (Deleted)`"
                >
                  <DiffViewer :old-value="template" :new-value="null" format="json" />
                </a-collapse-panel>
              </a-collapse>
            </a-card>

            <!-- No Changes -->
            <a-empty
              v-if="
                (!diffData.templates.added || diffData.templates.added.length === 0) &&
                (!diffData.templates.modified || diffData.templates.modified.length === 0) &&
                (!diffData.templates.deleted || diffData.templates.deleted.length === 0)
              "
              description="No template changes"
            />
          </div>
          <a-empty v-else description="No diff data available" />
        </a-tab-pane>

        <a-tab-pane key="bindings" tab="Binding Changes">
          <div v-if="diffData?.bindings">
            <!-- Added Bindings -->
            <a-card
              v-if="diffData.bindings.added && diffData.bindings.added.length > 0"
              title="Added Bindings"
              size="small"
              style="margin-bottom: 16px"
            >
              <a-table
                :columns="bindingColumns"
                :data-source="diffData.bindings.added"
                :pagination="false"
                size="small"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'change'">
                    <a-tag color="green">Added</a-tag>
                  </template>
                </template>
              </a-table>
            </a-card>

            <!-- Modified Bindings -->
            <a-card
              v-if="diffData.bindings.modified && diffData.bindings.modified.length > 0"
              title="Modified Bindings"
              size="small"
              style="margin-bottom: 16px"
            >
              <a-table
                :columns="bindingChangeColumns"
                :data-source="diffData.bindings.modified"
                :pagination="false"
                size="small"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'oldTemplate'">
                    <a-tag color="red">{{ record.old.templateName }}</a-tag>
                  </template>
                  <template v-if="column.key === 'newTemplate'">
                    <a-tag color="green">{{ record.new.templateName }}</a-tag>
                  </template>
                </template>
              </a-table>
            </a-card>

            <!-- Deleted Bindings -->
            <a-card
              v-if="diffData.bindings.deleted && diffData.bindings.deleted.length > 0"
              title="Deleted Bindings"
              size="small"
            >
              <a-table
                :columns="bindingColumns"
                :data-source="diffData.bindings.deleted"
                :pagination="false"
                size="small"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'change'">
                    <a-tag color="red">Deleted</a-tag>
                  </template>
                </template>
              </a-table>
            </a-card>

            <!-- No Changes -->
            <a-empty
              v-if="
                (!diffData.bindings.added || diffData.bindings.added.length === 0) &&
                (!diffData.bindings.modified || diffData.bindings.modified.length === 0) &&
                (!diffData.bindings.deleted || diffData.bindings.deleted.length === 0)
              "
              description="No binding changes"
            />
          </div>
          <a-empty v-else description="No diff data available" />
        </a-tab-pane>

        <a-tab-pane key="summary" tab="Summary">
          <a-descriptions bordered :column="1">
            <a-descriptions-item label="Template Changes">
              <a-space>
                <a-tag color="green"> Added: {{ diffData?.templates?.added?.length || 0 }} </a-tag>
                <a-tag color="blue">
                  Modified: {{ diffData?.templates?.modified?.length || 0 }}
                </a-tag>
                <a-tag color="red">
                  Deleted: {{ diffData?.templates?.deleted?.length || 0 }}
                </a-tag>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="Binding Changes">
              <a-space>
                <a-tag color="green"> Added: {{ diffData?.bindings?.added?.length || 0 }} </a-tag>
                <a-tag color="blue">
                  Modified: {{ diffData?.bindings?.modified?.length || 0 }}
                </a-tag>
                <a-tag color="red"> Deleted: {{ diffData?.bindings?.deleted?.length || 0 }} </a-tag>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="Total Changes">
              <a-tag color="purple">
                {{
                  (diffData?.templates?.added?.length || 0) +
                  (diffData?.templates?.modified?.length || 0) +
                  (diffData?.templates?.deleted?.length || 0) +
                  (diffData?.bindings?.added?.length || 0) +
                  (diffData?.bindings?.modified?.length || 0) +
                  (diffData?.bindings?.deleted?.length || 0)
                }}
              </a-tag>
            </a-descriptions-item>
          </a-descriptions>

          <a-alert
            v-if="hasChanges"
            type="info"
            message="Review Changes"
            description="Please review all changes carefully before publishing. These changes will affect the production environment."
            show-icon
            style="margin-top: 16px"
          />
        </a-tab-pane>
      </a-tabs>
    </a-spin>

    <template #footer>
      <a-button @click="handleClose">Close</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DiffViewer from '@/shared/DiffViewer.vue'

interface Props {
  open: boolean
  diffData?: any
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  diffData: null,
  loading: false,
})

const emit = defineEmits<Emits>()

const activeTab = ref('summary')

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
  {
    title: 'Change',
    key: 'change',
  },
]

const bindingChangeColumns = [
  {
    title: 'Symbol',
    dataIndex: ['new', 'symbol'],
    key: 'symbol',
  },
  {
    title: 'Old Template',
    key: 'oldTemplate',
  },
  {
    title: 'New Template',
    key: 'newTemplate',
  },
]

const hasChanges = computed(() => {
  if (!props.diffData) return false
  const templates = props.diffData.templates || {}
  const bindings = props.diffData.bindings || {}
  return (
    (templates.added?.length || 0) > 0 ||
    (templates.modified?.length || 0) > 0 ||
    (templates.deleted?.length || 0) > 0 ||
    (bindings.added?.length || 0) > 0 ||
    (bindings.modified?.length || 0) > 0 ||
    (bindings.deleted?.length || 0) > 0
  )
})

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

:deep(.ant-table-small) {
  font-size: 13px;
}
</style>
