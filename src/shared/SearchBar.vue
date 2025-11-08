<template>
  <div class="search-bar">
    <a-space :size="16" wrap>
      <!-- Search input -->
      <a-input
        v-model:value="searchQuery"
        :placeholder="placeholder"
        :style="{ width: searchWidth }"
        allow-clear
        @change="handleSearch"
        @press-enter="handleSearch"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>

      <!-- Filter fields -->
      <template v-for="filter in filters" :key="filter.key">
        <!-- Select filter -->
        <a-select
          v-if="filter.type === 'select'"
          v-model:value="filterValues[filter.key]"
          :placeholder="filter.placeholder"
          :style="{ width: filter.width || '180px' }"
          :options="filter.options"
          :mode="filter.mode"
          :allow-clear="filter.allowClear !== false"
          @change="handleFilterChange"
        />

        <!-- Date range filter -->
        <a-range-picker
          v-else-if="filter.type === 'date-range'"
          v-model:value="filterValues[filter.key]"
          :placeholder="filter.placeholder || ['Start Date', 'End Date']"
          :style="{ width: filter.width || '280px' }"
          :show-time="filter.showTime"
          :format="filter.format"
          @change="handleFilterChange"
        />

        <!-- Number range filter -->
        <a-space v-else-if="filter.type === 'number-range'" :size="8">
          <a-input-number
            :value="(filterValues[filter.key] as number[])?.[0]"
            :placeholder="filter.placeholder?.[0] || 'Min'"
            :style="{ width: filter.width || '120px' }"
            :min="filter.min"
            :max="filter.max"
            @update:value="(val) => updateNumberRange(filter.key, 0, val)"
          />
          <span>-</span>
          <a-input-number
            :value="(filterValues[filter.key] as number[])?.[1]"
            :placeholder="filter.placeholder?.[1] || 'Max'"
            :style="{ width: filter.width || '120px' }"
            :min="filter.min"
            :max="filter.max"
            @update:value="(val) => updateNumberRange(filter.key, 1, val)"
          />
        </a-space>

        <!-- Input filter -->
        <a-input
          v-else-if="filter.type === 'input'"
          v-model:value="filterValues[filter.key]"
          :placeholder="filter.placeholder"
          :style="{ width: filter.width || '180px' }"
          allow-clear
          @change="handleFilterChange"
        />
      </template>

      <!-- Action buttons -->
      <a-space :size="8">
        <a-button type="primary" @click="handleSearch"> Search </a-button>
        <a-button @click="handleReset"> Reset </a-button>
        <a-button v-if="showAdvanced" type="link" @click="advancedVisible = !advancedVisible">
          {{ advancedVisible ? 'Hide' : 'Show' }} Advanced
          <DownOutlined v-if="!advancedVisible" />
          <UpOutlined v-else />
        </a-button>
      </a-space>
    </a-space>

    <!-- Advanced filters -->
    <div v-if="advancedVisible && advancedFilters.length > 0" class="advanced-filters">
      <a-divider style="margin: 16px 0" />
      <a-space :size="16" wrap>
        <template v-for="filter in advancedFilters" :key="filter.key">
          <!-- Same filter types as above -->
          <a-select
            v-if="filter.type === 'select'"
            v-model:value="filterValues[filter.key]"
            :placeholder="filter.placeholder"
            :style="{ width: filter.width || '180px' }"
            :options="filter.options"
            :mode="filter.mode"
            :allow-clear="filter.allowClear !== false"
            @change="handleFilterChange"
          />

          <a-range-picker
            v-else-if="filter.type === 'date-range'"
            v-model:value="filterValues[filter.key]"
            :placeholder="filter.placeholder || ['Start Date', 'End Date']"
            :style="{ width: filter.width || '280px' }"
            :show-time="filter.showTime"
            :format="filter.format"
            @change="handleFilterChange"
          />

          <a-input
            v-else-if="filter.type === 'input'"
            v-model:value="filterValues[filter.key]"
            :placeholder="filter.placeholder"
            :style="{ width: filter.width || '180px' }"
            allow-clear
            @change="handleFilterChange"
          />
        </template>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { SearchOutlined, DownOutlined, UpOutlined } from '@ant-design/icons-vue'

interface FilterOption {
  label: string
  value: string | number
}

interface Filter {
  key: string
  type: 'select' | 'date-range' | 'number-range' | 'input'
  placeholder?: string | string[]
  width?: string
  options?: FilterOption[]
  mode?: 'multiple' | 'tags'
  allowClear?: boolean
  showTime?: boolean
  format?: string
  min?: number
  max?: number
}

interface Props {
  placeholder?: string
  searchWidth?: string
  filters?: Filter[]
  advancedFilters?: Filter[]
  showAdvanced?: boolean
  autoSearch?: boolean
  debounceTime?: number
}

interface Emits {
  (e: 'search', query: string, filters: Record<string, any>): void
  (e: 'reset'): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  searchWidth: '300px',
  filters: () => [],
  advancedFilters: () => [],
  showAdvanced: false,
  autoSearch: false,
  debounceTime: 500,
})

const emit = defineEmits<Emits>()

// State
const searchQuery = ref('')
const filterValues = reactive<Record<string, any>>({})
const advancedVisible = ref(false)

let searchTimer: NodeJS.Timeout | null = null

// Initialize filter values
watch(
  () => props.filters,
  (filters) => {
    filters.forEach((filter) => {
      if (!(filter.key in filterValues)) {
        if (filter.type === 'number-range') {
          filterValues[filter.key] = [undefined, undefined]
        } else {
          filterValues[filter.key] = undefined
        }
      }
    })
  },
  { immediate: true }
)

// Handle search
function handleSearch(): void {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  emit('search', searchQuery.value, { ...filterValues })
}

// Update number range value
function updateNumberRange(key: string, index: number, value: number | undefined): void {
  if (!filterValues[key]) {
    filterValues[key] = [undefined, undefined]
  }
  const arr = filterValues[key] as (number | undefined)[]
  arr[index] = value
  handleFilterChange()
}

// Handle filter change
function handleFilterChange(): void {
  if (props.autoSearch) {
    if (searchTimer) {
      clearTimeout(searchTimer)
    }

    searchTimer = setTimeout(() => {
      handleSearch()
    }, props.debounceTime)
  }
}

// Handle reset
function handleReset(): void {
  searchQuery.value = ''

  // Reset all filter values
  Object.keys(filterValues).forEach((key) => {
    const filter = [...props.filters, ...props.advancedFilters].find((f) => f.key === key)
    if (filter?.type === 'number-range') {
      filterValues[key] = [undefined, undefined]
    } else {
      filterValues[key] = undefined
    }
  })

  emit('reset')
  handleSearch()
}
</script>

<style scoped>
.search-bar {
  width: 100%;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.advanced-filters {
  margin-top: 8px;
}
</style>
