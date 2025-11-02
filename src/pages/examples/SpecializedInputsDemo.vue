<template>
  <div class="specialized-inputs-demo">
    <a-card title="Specialized Input Components Demo" style="margin-bottom: 24px">
      <a-space direction="vertical" :size="24" style="width: 100%">
        <!-- IconPicker Demo -->
        <div class="demo-section">
          <h3>IconPicker Component</h3>
          <p>
            Select icons from Ant Design Icons or custom uploaded icons with search and preview.
          </p>
          <IconPicker
            v-model="iconValue"
            placeholder="Select an icon"
            :custom-icons="customIcons"
            @change="handleIconChange"
          />
          <div v-if="iconValue" style="margin-top: 8px">
            <a-tag>Selected: {{ iconValue }}</a-tag>
          </div>
        </div>

        <a-divider />

        <!-- ImageUploader Demo -->
        <div class="demo-section">
          <h3>ImageUploader Component</h3>
          <p>Upload images with validation for size, dimensions, and format.</p>
          <ImageUploader
            v-model="imageValue"
            :max-size="2 * 1024 * 1024"
            :max-width="1920"
            :max-height="1080"
            accept="image/png,image/jpeg"
            upload-text="Upload Image"
            @change="handleImageChange"
          />
          <div v-if="imageValue" style="margin-top: 8px">
            <a-tag color="success">Image uploaded</a-tag>
          </div>
        </div>

        <a-divider />

        <!-- JsonEditor Demo -->
        <div class="demo-section">
          <h3>JsonEditor Component</h3>
          <p>Edit JSON with syntax highlighting, formatting, validation, and copy functionality.</p>
          <JsonEditor
            v-model="jsonValue"
            :rows="8"
            auto-format
            auto-validate
            @change="handleJsonChange"
          />
        </div>

        <a-divider />

        <!-- TagPicker Demo -->
        <div class="demo-section">
          <h3>TagPicker Component</h3>
          <p>Multi-select tags with suggestions, presets, and custom color mapping.</p>
          <TagPicker
            v-model="tagValue"
            placeholder="Select or create tags"
            :options="tagOptions"
            :suggestions="tagSuggestions"
            :presets="tagPresets"
            :color-map="tagColorMap"
            show-suggestions
            show-presets
            @change="handleTagChange"
          />
          <div v-if="tagValue.length > 0" style="margin-top: 8px">
            <a-tag v-for="tag in tagValue" :key="tag">{{ tag }}</a-tag>
          </div>
        </div>

        <a-divider />

        <!-- SearchBar Demo -->
        <div class="demo-section">
          <h3>SearchBar Component</h3>
          <p>Unified search and filtering with multiple filter types and advanced options.</p>
          <SearchBar
            placeholder="Search users..."
            search-width="400px"
            :filters="searchFilters"
            :advanced-filters="advancedFilters"
            show-advanced
            auto-search
            @search="handleSearch"
            @reset="handleReset"
          />
          <div v-if="searchResult" style="margin-top: 16px">
            <a-alert :message="searchResult" type="info" show-icon />
          </div>
        </div>
      </a-space>
    </a-card>

    <!-- Component Values Display -->
    <a-card title="Current Values">
      <pre>{{ componentValues }}</pre>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import IconPicker from '@/shared/IconPicker.vue'
import ImageUploader from '@/shared/ImageUploader.vue'
import JsonEditor from '@/shared/JsonEditor.vue'
import TagPicker from '@/shared/TagPicker.vue'
import SearchBar from '@/shared/SearchBar.vue'

// IconPicker state
const iconValue = ref('')
const customIcons = ref([
  { id: 'btc', name: 'Bitcoin', url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg' },
  { id: 'eth', name: 'Ethereum', url: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg' },
])

// ImageUploader state
const imageValue = ref('')

// JsonEditor state
const jsonValue = ref(
  JSON.stringify(
    {
      name: 'DEIEX Admin',
      version: '1.0.0',
      features: ['KYC', 'Users', 'Assets', 'Orders', 'Config'],
    },
    null,
    2
  )
)

// TagPicker state
const tagValue = ref<string[]>(['high-risk', 'vip'])
const tagOptions = [
  { label: 'High Risk', value: 'high-risk', color: 'red' },
  { label: 'VIP', value: 'vip', color: 'gold' },
  { label: 'Verified', value: 'verified', color: 'green' },
  { label: 'Suspended', value: 'suspended', color: 'orange' },
  { label: 'New User', value: 'new-user', color: 'blue' },
]
const tagSuggestions = ['whale', 'active-trader', 'institutional']
const tagPresets = [
  { name: 'Risk Tags', tags: ['high-risk', 'suspicious', 'blacklisted'] },
  { name: 'VIP Tags', tags: ['vip', 'whale', 'institutional'] },
]
const tagColorMap = {
  whale: 'purple',
  'active-trader': 'cyan',
  institutional: 'magenta',
}

// SearchBar state
const searchResult = ref('')
const searchFilters = [
  {
    key: 'status',
    type: 'select' as const,
    placeholder: 'Status',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Suspended', value: 'suspended' },
    ],
  },
  {
    key: 'vipLevel',
    type: 'select' as const,
    placeholder: 'VIP Level',
    options: [
      { label: 'VIP 0', value: 0 },
      { label: 'VIP 1', value: 1 },
      { label: 'VIP 2', value: 2 },
      { label: 'VIP 3', value: 3 },
    ],
  },
  {
    key: 'dateRange',
    type: 'date-range' as const,
    placeholder: ['Start Date', 'End Date'],
    width: '300px',
  },
]
const advancedFilters = [
  {
    key: 'country',
    type: 'input' as const,
    placeholder: 'Country',
  },
  {
    key: 'balanceRange',
    type: 'number-range' as const,
    placeholder: ['Min Balance', 'Max Balance'],
    min: 0,
  },
]

// Component values for display
const componentValues = computed(() => ({
  icon: iconValue.value,
  image: imageValue.value ? 'Image uploaded' : 'No image',
  json: jsonValue.value,
  tags: tagValue.value,
}))

// Event handlers
function handleIconChange(value: string) {
  message.success(`Icon selected: ${value}`)
}

function handleImageChange(value: string) {
  message.success('Image uploaded successfully')
}

function handleJsonChange(value: string) {
  console.log('JSON changed:', value)
}

function handleTagChange(value: string[]) {
  message.info(`Tags updated: ${value.join(', ')}`)
}

function handleSearch(query: string, filters: Record<string, any>) {
  searchResult.value = `Search: "${query}" with filters: ${JSON.stringify(filters, null, 2)}`
  message.info('Search executed')
}

function handleReset() {
  searchResult.value = ''
  message.info('Search reset')
}
</script>

<style scoped>
.specialized-inputs-demo {
  padding: 24px;
}

.demo-section {
  width: 100%;
}

.demo-section h3 {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
}

.demo-section p {
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.65);
}

pre {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
