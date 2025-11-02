<template>
  <div class="icon-picker">
    <a-input
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      readonly
      @click="handleOpen"
    >
      <template #prefix>
        <component :is="selectedIconComponent" v-if="selectedIconComponent" />
        <AppstoreOutlined v-else />
      </template>
      <template #suffix>
        <CloseCircleOutlined v-if="modelValue && !disabled" @click.stop="handleClear" />
      </template>
    </a-input>

    <a-modal v-model:open="visible" title="Select Icon" width="800px" :footer="null">
      <div class="icon-picker-modal">
        <a-input
          v-model:value="searchQuery"
          placeholder="Search icons..."
          allow-clear
          style="margin-bottom: 16px"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>

        <a-tabs v-model:active-key="activeTab">
          <a-tab-pane key="antd" tab="Ant Design Icons">
            <div class="icon-grid">
              <div
                v-for="icon in filteredAntdIcons"
                :key="icon.name"
                class="icon-item"
                :class="{ selected: modelValue === icon.name }"
                @click="handleSelect(icon.name)"
              >
                <component :is="icon.component" class="icon" />
                <div class="icon-name">{{ icon.name }}</div>
              </div>
            </div>
          </a-tab-pane>

          <a-tab-pane key="custom" tab="Custom Icons">
            <div v-if="customIcons.length > 0" class="icon-grid">
              <div
                v-for="icon in filteredCustomIcons"
                :key="icon.id"
                class="icon-item"
                :class="{ selected: modelValue === icon.id }"
                @click="handleSelect(icon.id)"
              >
                <img :src="icon.url" :alt="icon.name" class="icon-image" />
                <div class="icon-name">{{ icon.name }}</div>
              </div>
            </div>
            <EmptyState
              v-else
              title="No Custom Icons"
              description="Upload custom icons in the Icons configuration page"
              size="small"
            />
          </a-tab-pane>
        </a-tabs>

        <div v-if="modelValue" class="icon-preview">
          <a-divider />
          <div class="preview-content">
            <span>Selected:</span>
            <a-tag>
              <component :is="selectedIconComponent" v-if="selectedIconComponent" />
              {{ modelValue }}
            </a-tag>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  AppstoreOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  FileOutlined,
  FolderOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  TableOutlined,
  FormOutlined,
  CalendarOutlined,
  MailOutlined,
  BellOutlined,
  HeartOutlined,
  StarOutlined,
  LockOutlined,
  UnlockOutlined,
  SafetyOutlined,
  CrownOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  FireOutlined,
  TrophyOutlined,
} from '@ant-design/icons-vue'
import EmptyState from './EmptyState.vue'

interface CustomIcon {
  id: string
  name: string
  url: string
}

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  customIcons?: CustomIcon[]
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Select an icon',
  disabled: false,
  customIcons: () => [],
})

const emit = defineEmits<Emits>()

// State
const visible = ref(false)
const searchQuery = ref('')
const activeTab = ref('antd')

// Ant Design icons list
const antdIcons = [
  { name: 'HomeOutlined', component: HomeOutlined },
  { name: 'UserOutlined', component: UserOutlined },
  { name: 'SettingOutlined', component: SettingOutlined },
  { name: 'DashboardOutlined', component: DashboardOutlined },
  { name: 'FileOutlined', component: FileOutlined },
  { name: 'FolderOutlined', component: FolderOutlined },
  { name: 'PieChartOutlined', component: PieChartOutlined },
  { name: 'BarChartOutlined', component: BarChartOutlined },
  { name: 'LineChartOutlined', component: LineChartOutlined },
  { name: 'TableOutlined', component: TableOutlined },
  { name: 'FormOutlined', component: FormOutlined },
  { name: 'CalendarOutlined', component: CalendarOutlined },
  { name: 'MailOutlined', component: MailOutlined },
  { name: 'BellOutlined', component: BellOutlined },
  { name: 'HeartOutlined', component: HeartOutlined },
  { name: 'StarOutlined', component: StarOutlined },
  { name: 'LockOutlined', component: LockOutlined },
  { name: 'UnlockOutlined', component: UnlockOutlined },
  { name: 'SafetyOutlined', component: SafetyOutlined },
  { name: 'CrownOutlined', component: CrownOutlined },
  { name: 'RocketOutlined', component: RocketOutlined },
  { name: 'ThunderboltOutlined', component: ThunderboltOutlined },
  { name: 'FireOutlined', component: FireOutlined },
  { name: 'TrophyOutlined', component: TrophyOutlined },
]

// Display value
const displayValue = computed(() => {
  return props.modelValue || ''
})

// Selected icon component
const selectedIconComponent = computed(() => {
  if (!props.modelValue) return null

  // Check if it's an Ant Design icon
  const antdIcon = antdIcons.find((icon) => icon.name === props.modelValue)
  if (antdIcon) return antdIcon.component

  // For custom icons, we'll show the image in the input prefix
  return null
})

// Filtered Ant Design icons
const filteredAntdIcons = computed(() => {
  if (!searchQuery.value) return antdIcons

  const query = searchQuery.value.toLowerCase()
  return antdIcons.filter((icon) => icon.name.toLowerCase().includes(query))
})

// Filtered custom icons
const filteredCustomIcons = computed(() => {
  if (!searchQuery.value) return props.customIcons

  const query = searchQuery.value.toLowerCase()
  return props.customIcons.filter(
    (icon) => icon.name.toLowerCase().includes(query) || icon.id.toLowerCase().includes(query)
  )
})

// Handle open modal
function handleOpen(): void {
  if (props.disabled) return
  visible.value = true
}

// Handle select icon
function handleSelect(iconName: string): void {
  emit('update:modelValue', iconName)
  emit('change', iconName)
  visible.value = false
}

// Handle clear
function handleClear(): void {
  emit('update:modelValue', '')
  emit('change', '')
}
</script>

<style scoped>
.icon-picker {
  width: 100%;
}

.icon-picker-modal {
  max-height: 600px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-item:hover {
  border-color: #1890ff;
  background: #f0f5ff;
}

.icon-item.selected {
  border-color: #1890ff;
  background: #e6f7ff;
}

.icon {
  font-size: 24px;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.65);
}

.icon-image {
  width: 24px;
  height: 24px;
  margin-bottom: 8px;
  object-fit: contain;
}

.icon-name {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
  word-break: break-word;
  line-height: 1.2;
}

.icon-preview {
  margin-top: 16px;
}

.preview-content {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
