<template>
  <div class="risk-rules-page">
    <a-page-header title="Risk Rules" :ghost="false">
      <template #extra>
        <VersionBar
          :current-version="riskStore.currentVersion"
          :draft-exists="riskStore.hasDraftRules"
          :versions="riskStore.ruleVersions"
          :on-publish="handlePublish"
          :on-rollback="handleRollback"
          :on-view-diff="handleViewDiff"
        />
      </template>
    </a-page-header>

    <a-card :bordered="false" style="margin-top: 16px">
      <a-tabs v-model:active-key="activeTab" @change="handleTabChange">
        <a-tab-pane key="published" tab="Published Rules">
          <RiskRuleTable
            :data-source="riskStore.publishedRules"
            :loading="riskStore.rulesLoading"
            :pagination="publishedPagination"
            @change="handleTableChange"
            @create="handleCreate"
            @edit="handleEdit"
            @view="handleView"
            @delete="handleDelete"
            @simulate="handleSimulate"
            @toggle-enabled="handleToggleEnabled"
            @export="handleExport"
            @import="handleImport"
          />
        </a-tab-pane>

        <a-tab-pane key="drafts" tab="Draft Rules">
          <RiskRuleTable
            :data-source="riskStore.draftRules"
            :loading="riskStore.rulesLoading"
            :pagination="draftPagination"
            @change="handleTableChange"
            @create="handleCreate"
            @edit="handleEdit"
            @view="handleView"
            @delete="handleDelete"
            @simulate="handleSimulate"
            @toggle-enabled="handleToggleEnabled"
            @export="handleExport"
            @import="handleImport"
          />
        </a-tab-pane>

        <a-tab-pane key="simulator" tab="Rule Simulator">
          <RuleSimulator
            ref="simulatorRef"
            :loading="riskStore.rulesLoading"
            @simulate="handleSimulateTest"
          />
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- Edit/Create Drawer -->
    <a-drawer
      v-model:open="drawerVisible"
      :title="drawerMode === 'create' ? 'Create Risk Rule' : 'Edit Risk Rule'"
      width="720"
      :body-style="{ paddingBottom: '80px' }"
    >
      <RiskRuleForm
        :initial-data="currentRule"
        :mode="drawerMode"
        :loading="riskStore.rulesLoading"
        @submit="handleFormSubmit"
        @cancel="drawerVisible = false"
      />
    </a-drawer>

    <!-- View Drawer -->
    <a-drawer v-model:open="viewDrawerVisible" title="Rule Details" width="720">
      <a-descriptions v-if="currentRule" :column="1" bordered>
        <a-descriptions-item label="Rule Name">
          {{ currentRule.name }}
        </a-descriptions-item>
        <a-descriptions-item label="Description">
          {{ currentRule.description || 'N/A' }}
        </a-descriptions-item>
        <a-descriptions-item label="Priority">
          <a-tag :color="getPriorityColor(currentRule.priority)">
            {{ currentRule.priority }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Enabled">
          <a-badge
            :status="currentRule.enabled ? 'success' : 'default'"
            :text="currentRule.enabled ? 'Yes' : 'No'"
          />
        </a-descriptions-item>
        <a-descriptions-item label="Status">
          <a-badge
            :status="currentRule.status === 'published' ? 'success' : 'processing'"
            :text="currentRule.status"
          />
        </a-descriptions-item>
        <a-descriptions-item label="Conditions">
          <pre>{{ JSON.stringify(currentRule.conditions, null, 2) }}</pre>
        </a-descriptions-item>
        <a-descriptions-item label="Actions">
          <pre>{{ JSON.stringify(currentRule.actions, null, 2) }}</pre>
        </a-descriptions-item>
        <a-descriptions-item label="Match Count">
          {{ currentRule.matchCount || 0 }}
        </a-descriptions-item>
        <a-descriptions-item label="Last Matched">
          {{ currentRule.lastMatchedAt || 'Never' }}
        </a-descriptions-item>
        <a-descriptions-item label="Created At">
          {{ currentRule.createdAt }}
        </a-descriptions-item>
        <a-descriptions-item label="Updated At">
          {{ currentRule.updatedAt }}
        </a-descriptions-item>
      </a-descriptions>
    </a-drawer>

    <!-- Diff Modal -->
    <a-modal v-model:open="diffModalVisible" title="Review Changes" width="80%" :footer="null">
      <DiffViewer
        v-if="riskStore.ruleDiff"
        :old-value="riskStore.publishedRules"
        :new-value="riskStore.draftRules"
        format="json"
      />
    </a-modal>

    <!-- Publish Modal -->
    <a-modal
      v-model:open="publishModalVisible"
      title="Publish Risk Rules"
      :confirm-loading="riskStore.rulesLoading"
      @ok="handlePublishConfirm"
    >
      <a-form layout="vertical">
        <a-form-item label="Version Notes" required>
          <a-textarea
            v-model:value="publishNotes"
            placeholder="Describe the changes in this version"
            :rows="4"
          />
        </a-form-item>
        <a-form-item label="Tags (Optional)">
          <a-select
            v-model:value="publishTags"
            mode="tags"
            placeholder="Add tags for this version"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Import Modal -->
    <a-modal
      v-model:open="importModalVisible"
      title="Import Risk Rules"
      :confirm-loading="riskStore.rulesLoading"
      @ok="handleImportConfirm"
    >
      <a-upload
        :before-upload="handleBeforeUpload"
        :file-list="fileList"
        @remove="handleRemoveFile"
      >
        <a-button>
          <template #icon><UploadOutlined /></template>
          Select File
        </a-button>
      </a-upload>
      <p style="margin-top: 8px; color: #999">Supported formats: JSON, CSV</p>
    </a-modal>

    <!-- Simulate Modal -->
    <a-modal v-model:open="simulateModalVisible" title="Simulate Rule" width="800" :footer="null">
      <RuleSimulator
        ref="simulateModalRef"
        :rule-id="simulateRuleId"
        :loading="riskStore.rulesLoading"
        @simulate="handleSimulateRule"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRiskStore } from '@/stores/risk'
import RiskRuleTable from '@/tables/risk/RiskRuleTable.vue'
import RiskRuleForm from '@/forms/risk/RiskRuleForm.vue'
import RuleSimulator from '@/widgets/simulate/RuleSimulator.vue'
import VersionBar from '@/shared/VersionBar.vue'
import DiffViewer from '@/shared/DiffViewer.vue'
import type { RiskRule } from '@/types/models'
import type { UploadProps } from 'ant-design-vue'

const riskStore = useRiskStore()

const activeTab = ref('published')
const drawerVisible = ref(false)
const viewDrawerVisible = ref(false)
const diffModalVisible = ref(false)
const publishModalVisible = ref(false)
const importModalVisible = ref(false)
const simulateModalVisible = ref(false)
const drawerMode = ref<'create' | 'edit'>('create')
const currentRule = ref<RiskRule | null>(null)
const simulatorRef = ref()
const simulateModalRef = ref()
const simulateRuleId = ref<string>('')

const publishedPagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
})

const draftPagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
})

const publishNotes = ref('')
const publishTags = ref<string[]>([])
const fileList = ref<UploadProps['fileList']>([])

onMounted(() => {
  loadData()
})

async function loadData() {
  try {
    await Promise.all([
      riskStore.fetchPublishedRules(),
      riskStore.fetchDraftRules(),
      riskStore.fetchRuleVersions(),
    ])
  } catch (error) {
    console.error('Failed to load risk rules:', error)
  }
}

function handleTabChange(key: string) {
  activeTab.value = key
}

function handleTableChange(params: any) {
  console.log('Table changed:', params)
  // Handle pagination, sorting, filtering
}

function handleCreate() {
  currentRule.value = null
  drawerMode.value = 'create'
  drawerVisible.value = true
}

function handleEdit(record: RiskRule) {
  currentRule.value = record
  drawerMode.value = 'edit'
  drawerVisible.value = true
}

function handleView(record: RiskRule) {
  currentRule.value = record
  viewDrawerVisible.value = true
}

async function handleDelete(record: RiskRule) {
  try {
    await riskStore.deleteDraftRule(record.id)
    message.success('Rule deleted successfully')
  } catch (error) {
    console.error('Failed to delete rule:', error)
  }
}

function handleSimulate(record: RiskRule) {
  simulateRuleId.value = record.id
  simulateModalVisible.value = true
}

async function handleToggleEnabled(record: RiskRule, enabled: boolean) {
  try {
    await riskStore.updateDraftRule(record.id, { enabled })
    message.success(`Rule ${enabled ? 'enabled' : 'disabled'} successfully`)
  } catch (error) {
    console.error('Failed to toggle rule:', error)
  }
}

async function handleFormSubmit(data: Partial<RiskRule>) {
  try {
    if (drawerMode.value === 'create') {
      await riskStore.createDraftRule(data)
    } else if (currentRule.value) {
      await riskStore.updateDraftRule(currentRule.value.id, data)
    }
    drawerVisible.value = false
    await riskStore.fetchDraftRules()
  } catch (error) {
    console.error('Failed to save rule:', error)
  }
}

async function handlePublish() {
  await riskStore.fetchRuleDiff()
  publishModalVisible.value = true
}

async function handlePublishConfirm() {
  if (!publishNotes.value.trim()) {
    message.error('Please enter version notes')
    return
  }

  try {
    await riskStore.publishRules({
      notes: publishNotes.value,
      tags: publishTags.value,
    })
    publishModalVisible.value = false
    publishNotes.value = ''
    publishTags.value = []
    message.success('Rules published successfully')
  } catch (error) {
    console.error('Failed to publish rules:', error)
  }
}

async function handleRollback(versionId: string) {
  try {
    await riskStore.rollbackRules(versionId)
    message.success('Rules rolled back successfully')
  } catch (error) {
    console.error('Failed to rollback rules:', error)
  }
}

async function handleViewDiff() {
  await riskStore.fetchRuleDiff()
  diffModalVisible.value = true
}

async function handleExport() {
  try {
    await riskStore.exportRules('json')
  } catch (error) {
    console.error('Failed to export rules:', error)
  }
}

function handleImport() {
  importModalVisible.value = true
}

function handleBeforeUpload(file: File) {
  fileList.value = [file]
  return false
}

function handleRemoveFile() {
  fileList.value = []
}

async function handleImportConfirm() {
  if (!fileList.value || fileList.value.length === 0) {
    message.error('Please select a file to import')
    return
  }

  try {
    const file = fileList.value[0] as any
    await riskStore.importRules(file)
    importModalVisible.value = false
    fileList.value = []
  } catch (error) {
    console.error('Failed to import rules:', error)
  }
}

async function handleSimulateTest(testData: any) {
  try {
    const result = await riskStore.simulateRule(simulateRuleId.value, testData)
    if (simulatorRef.value) {
      simulatorRef.value.setResult(result.data)
    }
  } catch (error) {
    console.error('Failed to simulate rule:', error)
  }
}

async function handleSimulateRule(testData: any) {
  try {
    const result = await riskStore.simulateRule(simulateRuleId.value, testData)
    if (simulateModalRef.value) {
      simulateModalRef.value.setResult(result.data)
    }
  } catch (error) {
    console.error('Failed to simulate rule:', error)
  }
}

function getPriorityColor(priority: number): string {
  if (priority >= 90) return 'red'
  if (priority >= 70) return 'orange'
  if (priority >= 50) return 'blue'
  return 'default'
}
</script>

<style scoped>
.risk-rules-page {
  padding: 24px;
}

pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  max-height: 300px;
  overflow: auto;
}
</style>
