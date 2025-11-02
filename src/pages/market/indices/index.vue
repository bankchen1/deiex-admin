<template>
  <div class="market-indices-page">
    <a-page-header title="Market Indices" sub-title="Manage market indices and benchmarks">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon><PlusOutlined /></template>
            Add Index
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
            <a-select-option value="inactive">Inactive</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Category">
          <a-select
            v-model:value="filters.category"
            placeholder="All Categories"
            style="width: 150px"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="crypto">Crypto</a-select-option>
            <a-select-option value="equity">Equity</a-select-option>
            <a-select-option value="commodity">Commodity</a-select-option>
            <a-select-option value="fx">Foreign Exchange</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input-search
            v-model:value="filters.search"
            placeholder="Search index..."
            style="width: 200px"
            @press-enter="handleSearch"
          />
        </a-form-item>
      </a-form>
    </a-card>

    <!-- Indices Table -->
    <a-card :bordered="false">
      <a-table
        :data-source="indexList"
        :columns="columns"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} indices`,
        }"
        :loading="loading"
        row-key="symbol"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="index-name">
              <div class="index-title">{{ record.name }}</div>
              <div class="index-symbol">{{ record.symbol }}</div>
            </div>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
          </template>

          <template v-else-if="column.key === 'value'">
            <span class="index-value">{{ formatNumber(record.value) }}</span>
          </template>

          <template v-else-if="column.key === 'change'">
            <span :class="getChangeClass(record.change)">{{ record.change }}%</span>
          </template>

          <template v-else-if="column.key === 'volume'">
            <span class="index-volume">{{ formatNumber(record.volume) }}</span>
          </template>

          <template v-else-if="column.key === 'pe'">
            <span>{{ record.pe ? record.pe.toFixed(2) : '-' }}</span>
          </template>

          <template v-else-if="column.key === 'dividendYield'">
            <span>{{ record.dividendYield ? record.dividendYield.toFixed(2) : '-' }}%</span>
          </template>

          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">View</a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">Edit</a-button>
              <a-popconfirm
                v-if="record.status !== 'delisted'"
                title="Are you sure you want to deactivate this index?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="handleToggleStatus(record)"
              >
                <a-button
                  type="link"
                  size="small"
                  :danger="record.status === 'active'"
                  @click.prevent
                >
                  {{ record.status === 'active' ? 'Deactivate' : 'Activate' }}
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Index Detail Drawer -->
    <a-drawer
      v-model:open="detailDrawerOpen"
      title="Index Details"
      width="600"
      @close="handleCloseDetail"
    >
      <a-descriptions v-if="selectedIndex" :column="1" bordered>
        <a-descriptions-item label="Name">
          {{ selectedIndex.name }}
        </a-descriptions-item>
        <a-descriptions-item label="Symbol">
          {{ selectedIndex.symbol }}
        </a-descriptions-item>
        <a-descriptions-item label="Status">
          <a-tag :color="getStatusColor(selectedIndex.status)">{{ selectedIndex.status }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Category">
          {{ selectedIndex.category }}
        </a-descriptions-item>
        <a-descriptions-item label="Current Value">
          {{ formatNumber(selectedIndex.value) }}
        </a-descriptions-item>
        <a-descriptions-item label="Change (24h)">
          <span :class="getChangeClass(selectedIndex.change)">{{ selectedIndex.change }}%</span>
        </a-descriptions-item>
        <a-descriptions-item label="Market Cap">
          {{ formatNumber(selectedIndex.marketCap) }}
        </a-descriptions-item>
        <a-descriptions-item label="Dividend Yield">
          {{ selectedIndex.dividendYield ? selectedIndex.dividendYield.toFixed(2) : '-' }}%
        </a-descriptions-item>
        <a-descriptions-item label="P/E Ratio">
          {{ selectedIndex.pe ? selectedIndex.pe.toFixed(2) : '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="Components Count">
          {{ selectedIndex.componentsCount }}
        </a-descriptions-item>
        <a-descriptions-item label="Calculation Method">
          {{ selectedIndex.calculationMethod }}
        </a-descriptions-item>
        <a-descriptions-item label="Constituents">
          <a-tag
            v-for="(constituent, index) in selectedIndex.constituents"
            :key="index"
            color="blue"
          >
            {{ constituent.symbol }} ({{ constituent.weight }}%)
          </a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-drawer>

    <!-- Edit Index Modal -->
    <a-modal
      v-model:open="editModalOpen"
      :title="editMode === 'create' ? 'Add New Index' : 'Edit Index'"
      :width="700"
      @ok="handleSave"
      @cancel="handleCancel"
    >
      <a-form :model="formState" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Name" name="name">
              <a-input v-model:value="formState.name" placeholder="Index name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Symbol" name="symbol">
              <a-input v-model:value="formState.symbol" placeholder="Index symbol" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Category" name="category">
              <a-select v-model:value="formState.category" placeholder="Select category">
                <a-select-option value="crypto">Crypto</a-select-option>
                <a-select-option value="equity">Equity</a-select-option>
                <a-select-option value="commodity">Commodity</a-select-option>
                <a-select-option value="fx">Foreign Exchange</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Status" name="status">
              <a-select v-model:value="formState.status">
                <a-select-option value="active">Active</a-select-option>
                <a-select-option value="inactive">Inactive</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Current Value" name="value">
              <a-input-number
                v-model:value="formState.value"
                style="width: 100%"
                placeholder="Current value"
                :precision="2"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="P/E Ratio" name="pe">
              <a-input-number
                v-model:value="formState.pe"
                style="width: 100%"
                placeholder="P/E Ratio"
                :precision="2"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Calculation Method" name="calculationMethod">
          <a-select v-model:value="formState.calculationMethod" placeholder="Select method">
            <a-select-option value="price-weighted">Price Weighted</a-select-option>
            <a-select-option value="market-cap-weighted">Market Cap Weighted</a-select-option>
            <a-select-option value="equal-weighted">Equal Weighted</a-select-option>
            <a-select-option value="fundamental-weighted">Fundamental Weighted</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Description" name="description">
          <a-textarea
            v-model:value="formState.description"
            placeholder="Index description"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { PlusOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons-vue'

// Types
interface Constituent {
  symbol: string
  weight: number
}

interface MarketIndex {
  symbol: string
  name: string
  status: 'active' | 'inactive'
  category: 'crypto' | 'equity' | 'commodity' | 'fx'
  value: number
  change: number
  volume: number
  pe?: number
  dividendYield?: number
  marketCap: number
  componentsCount: number
  calculationMethod:
    | 'price-weighted'
    | 'market-cap-weighted'
    | 'equal-weighted'
    | 'fundamental-weighted'
  description: string
  constituents: Constituent[]
}

// State
const loading = ref(false)
const detailDrawerOpen = ref(false)
const editModalOpen = ref(false)
const editMode = ref<'create' | 'edit'>('create')
const selectedIndex = ref<MarketIndex | null>(null)

// Forms
const formState = reactive({
  symbol: '',
  name: '',
  status: 'active' as 'active' | 'inactive',
  category: 'crypto' as 'crypto' | 'equity' | 'commodity' | 'fx',
  value: 0,
  change: 0,
  volume: 0,
  pe: 0,
  dividendYield: 0,
  marketCap: 0,
  componentsCount: 0,
  calculationMethod: 'market-cap-weighted' as
    | 'price-weighted'
    | 'market-cap-weighted'
    | 'equal-weighted'
    | 'fundamental-weighted',
  description: '',
  constituents: [] as Constituent[],
})

// Filters
const filters = reactive({
  status: undefined as string | undefined,
  category: undefined as string | undefined,
  search: '',
})

// Pagination
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
})

// Mock data
const mockIndices: MarketIndex[] = [
  {
    symbol: 'DEIEX-COMP',
    name: 'DEIEX Composite Index',
    status: 'active',
    category: 'crypto',
    value: 12500.5,
    change: 2.5,
    volume: 5000000,
    pe: 22.5,
    dividendYield: 1.2,
    marketCap: 1250000000,
    componentsCount: 50,
    calculationMethod: 'market-cap-weighted',
    description: 'A broad market index of the top 50 cryptocurrencies',
    constituents: [
      { symbol: 'BTC', weight: 40 },
      { symbol: 'ETH', weight: 25 },
      { symbol: 'BNB', weight: 10 },
      { symbol: 'SOL', weight: 8 },
      { symbol: 'XRP', weight: 7 },
      { symbol: 'ADA', weight: 5 },
      { symbol: 'DOT', weight: 5 },
    ],
  },
  {
    symbol: 'DEIEX-DEFI',
    name: 'DEIEX DeFi Index',
    status: 'active',
    category: 'crypto',
    value: 8500.25,
    change: -1.2,
    volume: 2500000,
    pe: 18.7,
    dividendYield: 0.8,
    marketCap: 850000000,
    componentsCount: 20,
    calculationMethod: 'market-cap-weighted',
    description: 'An index of decentralized finance tokens',
    constituents: [
      { symbol: 'UNI', weight: 20 },
      { symbol: 'AAVE', weight: 18 },
      { symbol: 'COMP', weight: 15 },
      { symbol: 'LINK', weight: 12 },
      { symbol: 'UNI', weight: 10 },
      { symbol: 'SNX', weight: 10 },
      { symbol: 'YFI', weight: 15 },
    ],
  },
  {
    symbol: 'DEIEX-NFT',
    name: 'DEIEX NFT Index',
    status: 'active',
    category: 'crypto',
    value: 4200.75,
    change: 5.3,
    volume: 1200000,
    pe: 0,
    dividendYield: 0,
    marketCap: 420000000,
    componentsCount: 15,
    calculationMethod: 'market-cap-weighted',
    description: 'An index of NFT-related tokens',
    constituents: [
      { symbol: 'SAND', weight: 30 },
      { symbol: 'MANA', weight: 25 },
      { symbol: 'ENJ', weight: 20 },
      { symbol: 'ILV', weight: 15 },
      { symbol: 'AXS', weight: 10 },
    ],
  },
]

// Computed
const indexList = computed(() => {
  let result = [...mockIndices]

  // Apply filters
  if (filters.status) {
    result = result.filter((s) => s.status === filters.status)
  }
  if (filters.category) {
    result = result.filter((s) => s.category === filters.category)
  }
  if (filters.search) {
    result = result.filter(
      (s) =>
        s.symbol.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.name.toLowerCase().includes(filters.search.toLowerCase())
    )
  }

  return result
})

// Columns
const columns = [
  {
    title: 'Index',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    width: 120,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    width: 120,
    sorter: (a: MarketIndex, b: MarketIndex) => a.value - b.value,
  },
  {
    title: 'Change',
    dataIndex: 'change',
    key: 'change',
    width: 100,
    sorter: (a: MarketIndex, b: MarketIndex) => a.change - b.change,
  },
  {
    title: 'Volume',
    dataIndex: 'volume',
    key: 'volume',
    width: 120,
    sorter: (a: MarketIndex, b: MarketIndex) => a.volume - b.volume,
  },
  {
    title: 'P/E',
    dataIndex: 'pe',
    key: 'pe',
    width: 100,
  },
  {
    title: 'Dividend',
    dataIndex: 'dividendYield',
    key: 'dividendYield',
    width: 100,
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
    inactive: 'red',
  }
  return colorMap[status] || 'default'
}

function getChangeClass(change: number): string {
  return change >= 0 ? 'text-green' : 'text-red'
}

function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K'
  }
  return num.toFixed(2)
}

function handleRefresh() {
  console.log('Refreshing market indices')
}

function handleExport() {
  console.log('Exporting market indices')
}

function handleFilterChange() {
  console.log('Filters changed')
}

function handleSearch() {
  console.log('Searching indices')
}

function handleTableChange(pagination: any) {
  console.log('Table changed:', pagination)
}

function handleView(record: MarketIndex) {
  selectedIndex.value = record
  detailDrawerOpen.value = true
}

function handleEdit(record: MarketIndex) {
  Object.assign(formState, record)
  editMode.value = 'edit'
  editModalOpen.value = true
}

function handleToggleStatus(record: MarketIndex) {
  console.log('Toggling status for:', record)
}

function handleCreate() {
  Object.assign(formState, {
    symbol: '',
    name: '',
    status: 'active',
    category: 'crypto',
    value: 0,
    change: 0,
    volume: 0,
    pe: 0,
    dividendYield: 0,
    marketCap: 0,
    componentsCount: 0,
    calculationMethod: 'market-cap-weighted',
    description: '',
    constituents: [],
  })
  editMode.value = 'create'
  editModalOpen.value = true
}

function handleSave() {
  console.log('Saving index:', formState)
  editModalOpen.value = false
}

function handleCancel() {
  editModalOpen.value = false
}

function handleCloseDetail() {
  detailDrawerOpen.value = false
}

onMounted(() => {
  console.log('Market indices page mounted')
})
</script>

<style scoped>
.market-indices-page {
  padding: 24px;
}

.index-name {
  text-align: left;
}

.index-title {
  font-weight: 600;
  color: #1890ff;
}

.index-symbol {
  font-size: 12px;
  color: #8c8c8c;
}

.index-value {
  font-weight: 500;
  color: #333;
}

.text-green {
  color: #52c41a;
}

.text-red {
  color: #ff4d4f;
}

.index-volume {
  font-weight: 500;
}

:deep(.ant-drawer-body) {
  padding: 24px;
}
</style>
