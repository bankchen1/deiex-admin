<template>
  <div class="market-symbols-page">
    <a-page-header title="Trading Symbols" sub-title="Manage trading pairs and market symbols">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon><PlusOutlined /></template>
            Add Symbol
          </a-button>
          <a-button @click="handleRefresh">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
          <a-button @click="handleExport">
            <template #icon><DownloadOutlined /></template>
            Export
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- Filters -->
    <a-card :bordered="false" style="margin-bottom: 16px">
      <a-form layout="inline">
        <a-form-item label="Status">
          <a-select
            v-model:value="filters.status"
            placeholder="All Status"
            style="width: 120px"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="active">Active</a-select-option>
            <a-select-option value="paused">Paused</a-select-option>
            <a-select-option value="delisted">Delisted</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Base Currency">
          <a-select
            v-model:value="filters.base"
            placeholder="All Base"
            style="width: 150px"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="BTC">BTC</a-select-option>
            <a-select-option value="ETH">ETH</a-select-option>
            <a-select-option value="USDT">USDT</a-select-option>
            <a-select-option value="USDC">USDC</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Quote Currency">
          <a-select
            v-model:value="filters.quote"
            placeholder="All Quote"
            style="width: 150px"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="BTC">BTC</a-select-option>
            <a-select-option value="ETH">ETH</a-select-option>
            <a-select-option value="USDT">USDT</a-select-option>
            <a-select-option value="USDC">USDC</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input-search
            v-model:value="filters.search"
            placeholder="Search symbol..."
            style="width: 200px"
            @press-enter="handleSearch"
          />
        </a-form-item>
      </a-form>
    </a-card>

    <!-- Symbols Table -->
    <a-card :bordered="false">
      <a-table
        :data-source="symbolList"
        :columns="columns"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} symbols`,
        }"
        :loading="loading"
        row-key="symbol"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'symbol'">
            <span class="symbol">{{ record.base }}/{{ record.quote }}</span>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
          </template>

          <template v-else-if="column.key === 'price'">
            <span class="price">{{ formatPrice(record.price, record.quotePrecision) }}</span>
          </template>

          <template v-else-if="column.key === 'change'">
            <span :class="getChangeClass(record.change)">{{ record.change }}%</span>
          </template>

          <template v-else-if="column.key === 'volume'">
            <span class="volume">{{ formatNumber(record.volume) }}</span>
          </template>

          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">View</a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">Edit</a-button>
              <a-popconfirm
                v-if="record.status !== 'delisted'"
                title="Are you sure you want to delist this symbol?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="handleDelist(record)"
              >
                <a-button type="link" size="small" danger>Delist</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Symbol Detail Drawer -->
    <a-drawer
      v-model:open="detailDrawerOpen"
      title="Symbol Details"
      width="600"
      @close="handleCloseDetail"
    >
      <a-descriptions v-if="selectedSymbol" :column="1" bordered>
        <a-descriptions-item label="Symbol">
          {{ selectedSymbol.base }}/{{ selectedSymbol.quote }}
        </a-descriptions-item>
        <a-descriptions-item label="Status">
          <a-tag :color="getStatusColor(selectedSymbol.status)">{{ selectedSymbol.status }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Base Currency">
          {{ selectedSymbol.base }}
        </a-descriptions-item>
        <a-descriptions-item label="Quote Currency">
          {{ selectedSymbol.quote }}
        </a-descriptions-item>
        <a-descriptions-item label="Base Precision">
          {{ selectedSymbol.basePrecision }}
        </a-descriptions-item>
        <a-descriptions-item label="Quote Precision">
          {{ selectedSymbol.quotePrecision }}
        </a-descriptions-item>
        <a-descriptions-item label="Min Order Size">
          {{ selectedSymbol.minOrderSize }}
        </a-descriptions-item>
        <a-descriptions-item label="Max Order Size">
          {{ selectedSymbol.maxOrderSize }}
        </a-descriptions-item>
        <a-descriptions-item label="Fee Rate"> {{ selectedSymbol.feeRate }}% </a-descriptions-item>
        <a-descriptions-item label="Price Change Limit">
          {{ selectedSymbol.priceChangeLimit }}%
        </a-descriptions-item>
      </a-descriptions>
    </a-drawer>

    <!-- Edit Symbol Modal -->
    <a-modal
      v-model:open="editModalOpen"
      :title="editMode === 'create' ? 'Add New Symbol' : 'Edit Symbol'"
      :width="600"
      @ok="handleSave"
      @cancel="handleCancel"
    >
      <a-form :model="formState" layout="vertical" :rules="formRules">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Base Currency" name="base">
              <a-input v-model:value="formState.base" placeholder="e.g., BTC" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Quote Currency" name="quote">
              <a-input v-model:value="formState.quote" placeholder="e.g., USDT" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Base Precision" name="basePrecision">
              <a-input-number
                v-model:value="formState.basePrecision"
                style="width: 100%"
                placeholder="e.g., 8"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Quote Precision" name="quotePrecision">
              <a-input-number
                v-model:value="formState.quotePrecision"
                style="width: 100%"
                placeholder="e.g., 2"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Min Order Size" name="minOrderSize">
              <a-input-number
                v-model:value="formState.minOrderSize"
                style="width: 100%"
                placeholder="e.g., 0.001"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Max Order Size" name="maxOrderSize">
              <a-input-number
                v-model:value="formState.maxOrderSize"
                style="width: 100%"
                placeholder="e.g., 1000"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Fee Rate (%)" name="feeRate">
          <a-input-number
            v-model:value="formState.feeRate"
            style="width: 100%"
            placeholder="e.g., 0.1"
          />
        </a-form-item>
        <a-form-item label="Price Change Limit (%)" name="priceChangeLimit">
          <a-input-number
            v-model:value="formState.priceChangeLimit"
            style="width: 100%"
            placeholder="e.g., 20"
          />
        </a-form-item>
        <a-form-item label="Status" name="status">
          <a-select v-model:value="formState.status">
            <a-select-option value="active">Active</a-select-option>
            <a-select-option value="paused">Paused</a-select-option>
            <a-select-option value="delisted">Delisted</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { PlusOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import type { Instrument } from '@/contracts/config'

// Mock data
interface Symbol {
  symbol: string
  base: string
  quote: string
  status: 'active' | 'paused' | 'delisted'
  price: number
  change: number
  volume: number
  basePrecision: number
  quotePrecision: number
  minOrderSize: number
  maxOrderSize: number
  feeRate: number
  priceChangeLimit: number
  lastUpdated: string
}

// State
const loading = ref(false)
const detailDrawerOpen = ref(false)
const editModalOpen = ref(false)
const editMode = ref<'create' | 'edit'>('create')
const selectedSymbol = ref<Symbol | null>(null)

// Forms
const formState = reactive({
  base: '',
  quote: '',
  status: 'active' as 'active' | 'paused' | 'delisted',
  basePrecision: 8,
  quotePrecision: 2,
  minOrderSize: 0.001,
  maxOrderSize: 1000,
  feeRate: 0.1,
  priceChangeLimit: 20,
})

const formRules = {
  base: [{ required: true, message: 'Please input base currency' }],
  quote: [{ required: true, message: 'Please input quote currency' }],
}

// Filters
const filters = reactive({
  status: undefined as string | undefined,
  base: undefined as string | undefined,
  quote: undefined as string | undefined,
  search: '',
})

// Pagination
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
})

// Mock data
const mockSymbols: Symbol[] = [
  {
    symbol: 'BTCUSDT',
    base: 'BTC',
    quote: 'USDT',
    status: 'active',
    price: 35000.5,
    change: 3.7,
    volume: 12500.5,
    basePrecision: 8,
    quotePrecision: 2,
    minOrderSize: 0.001,
    maxOrderSize: 1000,
    feeRate: 0.1,
    priceChangeLimit: 20,
    lastUpdated: '2024-01-01',
  },
  {
    symbol: 'ETHUSDT',
    base: 'ETH',
    quote: 'USDT',
    status: 'active',
    price: 2800.75,
    change: -1.59,
    volume: 45000.25,
    basePrecision: 8,
    quotePrecision: 2,
    minOrderSize: 0.01,
    maxOrderSize: 5000,
    feeRate: 0.1,
    priceChangeLimit: 15,
    lastUpdated: '2024-01-01',
  },
  {
    symbol: 'BNBUSDT',
    base: 'BNB',
    quote: 'USDT',
    status: 'paused',
    price: 300.5,
    change: 2.3,
    volume: 125000.5,
    basePrecision: 8,
    quotePrecision: 2,
    minOrderSize: 0.1,
    maxOrderSize: 10000,
    feeRate: 0.1,
    priceChangeLimit: 20,
    lastUpdated: '2024-01-01',
  },
]

// Computed
const symbolList = computed(() => {
  let result = [...mockSymbols]

  // Apply filters
  if (filters.status) {
    result = result.filter((s) => s.status === filters.status)
  }
  if (filters.base) {
    result = result.filter((s) => s.base === filters.base)
  }
  if (filters.quote) {
    result = result.filter((s) => s.quote === filters.quote)
  }
  if (filters.search) {
    result = result.filter(
      (s) =>
        s.symbol.toLowerCase().includes(filters.search.toLowerCase()) ||
        `${s.base}/${s.quote}`.toLowerCase().includes(filters.search.toLowerCase())
    )
  }

  return result
})

// Columns
const columns = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    width: 150,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    width: 120,
    sorter: (a: Symbol, b: Symbol) => a.price - b.price,
  },
  {
    title: 'Change',
    dataIndex: 'change',
    key: 'change',
    width: 100,
    sorter: (a: Symbol, b: Symbol) => a.change - b.change,
  },
  {
    title: '24h Volume',
    dataIndex: 'volume',
    key: 'volume',
    width: 120,
    sorter: (a: Symbol, b: Symbol) => a.volume - b.volume,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 180,
  },
]

// Methods
function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    active: 'green',
    paused: 'orange',
    delisted: 'red',
  }
  return colorMap[status] || 'default'
}

function getChangeClass(change: number): string {
  return change >= 0 ? 'text-green' : 'text-red'
}

function formatPrice(price: number, precision: number): string {
  return price.toFixed(precision)
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K'
  }
  return num.toFixed(2)
}

function handleRefresh() {
  console.log('Refreshing symbols')
}

function handleExport() {
  console.log('Exporting symbols')
}

function handleFilterChange() {
  console.log('Filters changed')
}

function handleSearch() {
  console.log('Searching symbols')
}

function handleTableChange(pagination: any) {
  console.log('Table changed:', pagination)
}

function handleView(record: Symbol) {
  selectedSymbol.value = record
  detailDrawerOpen.value = true
}

function handleEdit(record: Symbol) {
  Object.assign(formState, record)
  editMode.value = 'edit'
  editModalOpen.value = true
}

function handleDelist(record: Symbol) {
  console.log('Delisting symbol:', record)
}

function handleCreate() {
  Object.assign(formState, {
    base: '',
    quote: '',
    status: 'active',
    basePrecision: 8,
    quotePrecision: 2,
    minOrderSize: 0.001,
    maxOrderSize: 1000,
    feeRate: 0.1,
    priceChangeLimit: 20,
  })
  editMode.value = 'create'
  editModalOpen.value = true
}

function handleSave() {
  console.log('Saving symbol:', formState)
  editModalOpen.value = false
}

function handleCancel() {
  editModalOpen.value = false
}

function handleCloseDetail() {
  detailDrawerOpen.value = false
}

onMounted(() => {
  console.log('Market symbols page mounted')
})
</script>

<style scoped>
.market-symbols-page {
  padding: 24px;
}

.symbol {
  font-weight: 600;
  color: #1890ff;
}

.price {
  font-weight: 500;
  color: #333;
}

.text-green {
  color: #52c41a;
}

.text-red {
  color: #ff4d4f;
}

.volume {
  font-weight: 500;
}

:deep(.ant-drawer-body) {
  padding: 24px;
}
</style>
