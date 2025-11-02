<template>
  <div class="i18n-settings-page">
    <a-page-header
      title="Internationalization (i18n)"
      sub-title="Manage translation keys and text for multiple languages"
    >
      <template #extra>
        <a-space>
          <a-badge :count="settingsStore.missingKeys.length" :overflow-count="99">
            <a-button @click="handleScanMissing">
              <template #icon><ScanOutlined /></template>
              Scan Missing Keys
            </a-button>
          </a-badge>
        </a-space>
      </template>
    </a-page-header>

    <a-card>
      <I18nKeyTable
        :data-source="settingsStore.i18nEntries"
        :loading="settingsStore.loading"
        :modules="availableModules"
        @change="handleTableChange"
        @add="handleAdd"
        @edit="handleEdit"
        @delete="handleDelete"
        @bulk-import="showBulkImportModal = true"
        @export="handleExport"
        @scan-missing="handleScanMissing"
      />
    </a-card>

    <!-- Add/Edit Entry Drawer -->
    <a-drawer
      v-model:open="showEntryDrawer"
      :title="drawerMode === 'create' ? 'Add I18n Entry' : 'Edit I18n Entry'"
      width="600px"
      :body-style="{ paddingBottom: '80px' }"
    >
      <I18nEntryForm
        :initial-values="currentEntry"
        :mode="drawerMode"
        :loading="settingsStore.loading"
        @submit="handleSubmitEntry"
        @cancel="showEntryDrawer = false"
      />
    </a-drawer>

    <!-- Bulk Import Modal -->
    <BulkI18nImportModal
      v-model:open="showBulkImportModal"
      :loading="settingsStore.loading"
      @submit="handleBulkImport"
    />

    <!-- Missing Keys Modal -->
    <a-modal
      v-model:open="showMissingKeysModal"
      title="Missing Translation Keys"
      width="800px"
      :footer="null"
    >
      <a-alert
        v-if="settingsStore.missingKeys.length === 0"
        message="No Missing Keys"
        description="All translation keys are defined."
        type="success"
        show-icon
      />
      <div v-else>
        <a-alert
          message="Missing Keys Found"
          :description="`Found ${settingsStore.missingKeys.length} missing translation keys in the codebase.`"
          type="warning"
          show-icon
          style="margin-bottom: 16px"
        />
        <a-list
          :data-source="settingsStore.missingKeys"
          :pagination="{ pageSize: 10 }"
          size="small"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-typography-text code>{{ item }}</a-typography-text>
              <template #actions>
                <a-button type="link" size="small" @click="handleAddMissingKey(item)">
                  Add Entry
                </a-button>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { ScanOutlined } from '@ant-design/icons-vue'
import { useSettingsStore } from '@/stores/settings'
import I18nKeyTable from '@/tables/settings/I18nKeyTable.vue'
import I18nEntryForm from '@/forms/settings/I18nEntryForm.vue'
import BulkI18nImportModal from '@/modals/settings/BulkI18nImportModal.vue'
import type { I18nEntry } from '@/services/api/settings'

const settingsStore = useSettingsStore()

const showEntryDrawer = ref(false)
const showBulkImportModal = ref(false)
const showMissingKeysModal = ref(false)
const drawerMode = ref<'create' | 'edit'>('create')
const currentEntry = ref<Partial<I18nEntry> | undefined>(undefined)

const availableModules = computed(() => {
  const modules = new Set<string>()
  settingsStore.i18nEntries.forEach((entry) => {
    if (entry.module) {
      modules.add(entry.module)
    }
  })
  return Array.from(modules).sort()
})

onMounted(async () => {
  await settingsStore.fetchI18nEntries()
})

function handleTableChange(params: any) {
  settingsStore.fetchI18nEntries(params)
}

function handleAdd() {
  drawerMode.value = 'create'
  currentEntry.value = undefined
  showEntryDrawer.value = true
}

function handleEdit(record: I18nEntry) {
  drawerMode.value = 'edit'
  currentEntry.value = { ...record }
  showEntryDrawer.value = true
}

async function handleDelete(record: I18nEntry) {
  try {
    await settingsStore.deleteI18nEntry(record.key)
    message.success('I18n entry deleted successfully')
  } catch (error) {
    message.error('Failed to delete i18n entry')
  }
}

async function handleSubmitEntry(values: Partial<I18nEntry>) {
  try {
    if (drawerMode.value === 'create') {
      await settingsStore.createI18nEntry(values as Omit<I18nEntry, 'lastUpdated'>)
      message.success('I18n entry created successfully')
    } else {
      await settingsStore.updateI18nEntry(values.key!, values)
      message.success('I18n entry updated successfully')
    }
    showEntryDrawer.value = false
  } catch (error) {
    message.error(`Failed to ${drawerMode.value} i18n entry`)
  }
}

async function handleBulkImport(data: { entries: any[]; overwrite: boolean }) {
  try {
    await settingsStore.bulkImportI18n(data)
    message.success('I18n entries imported successfully')
    showBulkImportModal.value = false
  } catch (error) {
    message.error('Failed to import i18n entries')
  }
}

async function handleExport() {
  try {
    await settingsStore.exportI18n()
    message.success('I18n entries exported successfully')
  } catch (error) {
    message.error('Failed to export i18n entries')
  }
}

async function handleScanMissing() {
  try {
    await settingsStore.scanMissingKeys()
    showMissingKeysModal.value = true
    if (settingsStore.missingKeys.length === 0) {
      message.success('No missing keys found')
    } else {
      message.warning(`Found ${settingsStore.missingKeys.length} missing keys`)
    }
  } catch (error) {
    message.error('Failed to scan missing keys')
  }
}

function handleAddMissingKey(key: string) {
  const parts = key.split('.')
  const module = parts[0] || 'common'

  drawerMode.value = 'create'
  currentEntry.value = {
    key,
    module,
    en: '',
    zh: '',
  }
  showMissingKeysModal.value = false
  showEntryDrawer.value = true
}
</script>

<style scoped>
.i18n-settings-page {
  padding: 24px;
}
</style>
