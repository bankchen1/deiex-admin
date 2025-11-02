<template>
  <div class="version-control-demo">
    <a-card title="Version Control Components Demo" style="margin-bottom: 24px">
      <a-alert
        message="Version Control Components"
        description="This demo showcases the VersionBar and DiffViewer components used for configuration management with draft/publish/rollback workflows."
        type="info"
        show-icon
        style="margin-bottom: 24px"
      />

      <a-space direction="vertical" :size="24" style="width: 100%">
        <!-- VersionBar Demo -->
        <a-card title="VersionBar Component" size="small">
          <VersionBar
            :current-version="currentVersion"
            :draft-exists="draftExists"
            :versions="versions"
            :impact-estimation="impactEstimation"
            @publish="handlePublish"
            @rollback="handleRollback"
            @view-diff="handleViewDiff"
          />

          <a-divider />

          <a-space>
            <a-button @click="toggleDraft">
              {{ draftExists ? 'Remove Draft' : 'Create Draft' }}
            </a-button>
            <a-button @click="addVersion">Add Version to History</a-button>
          </a-space>
        </a-card>

        <!-- DiffViewer Demo -->
        <a-card title="DiffViewer Component" size="small">
          <a-tabs v-model:active-key="activeTab">
            <a-tab-pane key="json" tab="JSON Diff">
              <DiffViewer
                :old-value="jsonOldValue"
                :new-value="jsonNewValue"
                format="json"
                :highlight-changes="true"
              />
            </a-tab-pane>

            <a-tab-pane key="text" tab="Text Diff">
              <DiffViewer
                :old-value="textOldValue"
                :new-value="textNewValue"
                format="text"
                :highlight-changes="true"
              />
            </a-tab-pane>

            <a-tab-pane key="table" tab="Table Diff">
              <DiffViewer
                :old-value="tableOldValue"
                :new-value="tableNewValue"
                format="table"
                :highlight-changes="true"
              />
            </a-tab-pane>
          </a-tabs>
        </a-card>

        <!-- Combined Example -->
        <a-card title="Combined Example: Configuration Management" size="small">
          <a-alert
            message="Scenario"
            description="This example simulates a typical configuration management workflow where you can edit settings, view differences, and publish changes."
            type="info"
            show-icon
            style="margin-bottom: 16px"
          />

          <VersionBar
            :current-version="configVersion"
            :draft-exists="configDraftExists"
            :versions="configVersions"
            impact-estimation="This change will affect 15 active instruments and 230 users."
            @publish="handleConfigPublish"
            @rollback="handleConfigRollback"
            @view-diff="showConfigDiff = true"
          />

          <a-divider />

          <a-form layout="vertical">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="Trading Fee (Maker)">
                  <a-input-number
                    v-model:value="configDraft.makerFee"
                    :min="0"
                    :max="1"
                    :step="0.0001"
                    style="width: 100%"
                    @change="handleConfigChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Trading Fee (Taker)">
                  <a-input-number
                    v-model:value="configDraft.takerFee"
                    :min="0"
                    :max="1"
                    :step="0.0001"
                    style="width: 100%"
                    @change="handleConfigChange"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="Max Leverage">
                  <a-input-number
                    v-model:value="configDraft.maxLeverage"
                    :min="1"
                    :max="125"
                    style="width: 100%"
                    @change="handleConfigChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Maintenance Margin Rate">
                  <a-input-number
                    v-model:value="configDraft.maintenanceMarginRate"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    style="width: 100%"
                    @change="handleConfigChange"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item label="Enabled">
              <a-switch v-model:checked="configDraft.enabled" @change="handleConfigChange" />
            </a-form-item>
          </a-form>

          <!-- Config Diff Modal -->
          <a-modal
            v-model:open="showConfigDiff"
            title="Configuration Changes"
            width="80%"
            :footer="null"
          >
            <DiffViewer
              :old-value="configPublished"
              :new-value="configDraft"
              format="table"
              :highlight-changes="true"
            />
          </a-modal>
        </a-card>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { VersionBar, DiffViewer } from '@/shared'
import type { Version } from '@/types/components'

// VersionBar demo state
const currentVersion = ref('v1.2.3')
const draftExists = ref(true)
const impactEstimation = ref('This change will affect 42 instruments and 1,234 users.')

const versions = ref<Version[]>([
  {
    id: '3',
    version: 'v1.2.3',
    createdAt: '2024-01-15T10:30:00Z',
    createdBy: 'admin@deiex.com',
    notes: 'Updated trading fees for VIP tiers',
    tags: ['feature', 'fees'],
  },
  {
    id: '2',
    version: 'v1.2.2',
    createdAt: '2024-01-10T14:20:00Z',
    createdBy: 'admin@deiex.com',
    notes: 'Fixed margin calculation bug',
    tags: ['bugfix', 'margin'],
  },
  {
    id: '1',
    version: 'v1.2.1',
    createdAt: '2024-01-05T09:15:00Z',
    createdBy: 'admin@deiex.com',
    notes: 'Initial release with basic configuration',
    tags: ['release'],
  },
])

// DiffViewer demo state
const activeTab = ref('json')

// JSON diff example
const jsonOldValue = ref({
  symbol: 'BTCUSDT',
  baseAsset: 'BTC',
  quoteAsset: 'USDT',
  pricePrecision: 2,
  quantityPrecision: 6,
  minOrderQty: 0.001,
  maxOrderQty: 1000,
  visible: true,
  rank: 1,
})

const jsonNewValue = ref({
  symbol: 'BTCUSDT',
  baseAsset: 'BTC',
  quoteAsset: 'USDT',
  pricePrecision: 2,
  quantityPrecision: 8,
  minOrderQty: 0.0001,
  maxOrderQty: 5000,
  visible: true,
  rank: 1,
  tags: ['popular', 'spot'],
})

// Text diff example
const textOldValue = ref(`# Trading Configuration

## Spot Trading
- Maker Fee: 0.1%
- Taker Fee: 0.2%
- Min Order: $10

## Futures Trading
- Max Leverage: 100x
- Maintenance Margin: 0.5%`)

const textNewValue = ref(`# Trading Configuration

## Spot Trading
- Maker Fee: 0.08%
- Taker Fee: 0.15%
- Min Order: $5

## Futures Trading
- Max Leverage: 125x
- Maintenance Margin: 0.4%
- Liquidation Fee: 0.1%`)

// Table diff example
const tableOldValue = ref({
  makerFee: 0.001,
  takerFee: 0.002,
  maxLeverage: 100,
  maintenanceMarginRate: 0.005,
  enabled: true,
})

const tableNewValue = ref({
  makerFee: 0.0008,
  takerFee: 0.0015,
  maxLeverage: 125,
  maintenanceMarginRate: 0.004,
  enabled: true,
})

// Combined example state
const configVersion = ref('v2.1.0')
const configDraftExists = ref(false)
const showConfigDiff = ref(false)

const configPublished = reactive({
  makerFee: 0.001,
  takerFee: 0.002,
  maxLeverage: 100,
  maintenanceMarginRate: 0.005,
  enabled: true,
})

const configDraft = reactive({
  makerFee: 0.001,
  takerFee: 0.002,
  maxLeverage: 100,
  maintenanceMarginRate: 0.005,
  enabled: true,
})

const configVersions = ref<Version[]>([
  {
    id: '2',
    version: 'v2.1.0',
    createdAt: '2024-01-20T16:45:00Z',
    createdBy: 'admin@deiex.com',
    notes: 'Increased max leverage to 100x',
    tags: ['feature'],
  },
  {
    id: '1',
    version: 'v2.0.0',
    createdAt: '2024-01-15T10:00:00Z',
    createdBy: 'admin@deiex.com',
    notes: 'Major update with new fee structure',
    tags: ['release', 'breaking'],
  },
])

// VersionBar demo handlers
function toggleDraft(): void {
  draftExists.value = !draftExists.value
  message.info(draftExists.value ? 'Draft created' : 'Draft removed')
}

function addVersion(): void {
  const newVersion = {
    id: String(versions.value.length + 1),
    version: `v1.2.${versions.value.length + 1}`,
    createdAt: new Date().toISOString(),
    createdBy: 'admin@deiex.com',
    notes: 'New version added from demo',
    tags: ['demo'],
  }
  versions.value.unshift(newVersion)
  currentVersion.value = newVersion.version
  message.success('Version added to history')
}

async function handlePublish(data: { notes: string; tags: string[] }): Promise<void> {
  message.loading('Publishing changes...', 1)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newVersion = {
    id: String(versions.value.length + 1),
    version: `v1.2.${versions.value.length + 1}`,
    createdAt: new Date().toISOString(),
    createdBy: 'admin@deiex.com',
    notes: data.notes,
    tags: data.tags,
  }

  versions.value.unshift(newVersion)
  currentVersion.value = newVersion.version
  draftExists.value = false

  message.success('Changes published successfully')
}

async function handleRollback(versionId: string): Promise<void> {
  message.loading('Rolling back...', 1)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const version = versions.value.find((v) => v.id === versionId)
  if (version) {
    currentVersion.value = version.version
    message.success(`Rolled back to ${version.version}`)
  }
}

function handleViewDiff(): void {
  message.info('Opening diff viewer...')
}

// Combined example handlers
function handleConfigChange(): void {
  configDraftExists.value = JSON.stringify(configPublished) !== JSON.stringify(configDraft)
}

async function handleConfigPublish(data: { notes: string; tags: string[] }): Promise<void> {
  message.loading('Publishing configuration...', 1)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  Object.assign(configPublished, configDraft)

  const newVersion = {
    id: String(configVersions.value.length + 1),
    version: `v2.${configVersions.value.length}.0`,
    createdAt: new Date().toISOString(),
    createdBy: 'admin@deiex.com',
    notes: data.notes,
    tags: data.tags,
  }

  configVersions.value.unshift(newVersion)
  configVersion.value = newVersion.version
  configDraftExists.value = false

  message.success('Configuration published successfully')
}

async function handleConfigRollback(versionId: string): Promise<void> {
  message.loading('Rolling back configuration...', 1)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const version = configVersions.value.find((v) => v.id === versionId)
  if (version) {
    configVersion.value = version.version
    // In a real app, you would fetch the configuration for this version
    message.success(`Configuration rolled back to ${version.version}`)
  }
}
</script>

<style scoped>
.version-control-demo {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
}
</style>
