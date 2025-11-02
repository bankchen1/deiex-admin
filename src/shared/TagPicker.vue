<template>
  <div class="tag-picker">
    <a-select
      v-model:value="selectedTags"
      mode="tags"
      :placeholder="placeholder"
      :disabled="disabled"
      :max-tag-count="maxTagCount"
      :options="tagOptions"
      :filter-option="filterOption"
      :allow-clear="allowClear"
      style="width: 100%"
      @change="handleChange"
    >
      <template #tagRender="{ label, value, closable, onClose }">
        <a-tag
          :color="getTagColor(value)"
          :closable="closable"
          style="margin-right: 4px"
          @close="onClose"
        >
          {{ label }}
        </a-tag>
      </template>
    </a-select>

    <div v-if="showSuggestions && suggestions.length > 0" class="tag-suggestions">
      <span class="suggestions-label">Suggestions:</span>
      <a-space wrap>
        <a-tag
          v-for="tag in suggestions"
          :key="tag"
          :color="getTagColor(tag)"
          style="cursor: pointer"
          @click="handleAddSuggestion(tag)"
        >
          <template #icon><PlusOutlined /></template>
          {{ tag }}
        </a-tag>
      </a-space>
    </div>

    <div v-if="showPresets && presets.length > 0" class="tag-presets">
      <span class="presets-label">Presets:</span>
      <a-space wrap>
        <a-button
          v-for="preset in presets"
          :key="preset.name"
          size="small"
          @click="handleApplyPreset(preset)"
        >
          {{ preset.name }}
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'

interface TagOption {
  label: string
  value: string
  color?: string
}

interface TagPreset {
  name: string
  tags: string[]
}

interface Props {
  modelValue?: string[]
  placeholder?: string
  disabled?: boolean
  maxTagCount?: number | 'responsive'
  allowClear?: boolean
  options?: TagOption[]
  suggestions?: string[]
  presets?: TagPreset[]
  showSuggestions?: boolean
  showPresets?: boolean
  colorMap?: Record<string, string>
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
  (e: 'change', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  placeholder: 'Select or create tags',
  disabled: false,
  maxTagCount: 'responsive',
  allowClear: true,
  options: () => [],
  suggestions: () => [],
  presets: () => [],
  showSuggestions: true,
  showPresets: false,
  colorMap: () => ({}),
})

const emit = defineEmits<Emits>()

// State
const selectedTags = ref<string[]>([...props.modelValue])

// Tag options
const tagOptions = computed(() => {
  return props.options.map((option) => ({
    label: option.label,
    value: option.value,
  }))
})

// Watch for external changes
watch(
  () => props.modelValue,
  (value) => {
    selectedTags.value = [...value]
  }
)

// Get tag color
function getTagColor(tag: string): string {
  // Check if color is defined in options
  const option = props.options.find((opt) => opt.value === tag)
  if (option?.color) return option.color

  // Check if color is defined in colorMap
  if (props.colorMap[tag]) return props.colorMap[tag]

  // Default color based on tag content
  const colors = ['blue', 'green', 'orange', 'red', 'purple', 'cyan', 'magenta']
  const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

// Filter option
function filterOption(input: string, option: any): boolean {
  return option.label.toLowerCase().includes(input.toLowerCase())
}

// Handle change
function handleChange(value: string[]): void {
  selectedTags.value = value
  emit('update:modelValue', value)
  emit('change', value)
}

// Handle add suggestion
function handleAddSuggestion(tag: string): void {
  if (!selectedTags.value.includes(tag)) {
    const newTags = [...selectedTags.value, tag]
    handleChange(newTags)
  }
}

// Handle apply preset
function handleApplyPreset(preset: TagPreset): void {
  handleChange(preset.tags)
}
</script>

<style scoped>
.tag-picker {
  width: 100%;
}

.tag-suggestions {
  margin-top: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.suggestions-label {
  display: inline-block;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
}

.tag-presets {
  margin-top: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.presets-label {
  display: inline-block;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
}
</style>
