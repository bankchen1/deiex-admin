<template>
  <div class="multi-language-input">
    <a-tabs v-model:active-key="activeTab" size="small">
      <a-tab-pane v-for="lang in supportedLanguages" :key="lang.code" :tab="lang.name">
        <a-textarea
          v-model:value="localValue[lang.code]"
          :placeholder="`${placeholder} (${lang.code})`"
          :rows="rows"
          @change="handleChange"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  value?: Record<string, string>
  placeholder?: string
  rows?: number
}

interface Emits {
  (e: 'update:value', value: Record<string, string>): void
}

const props = withDefaults(defineProps<Props>(), {
  value: () => ({}),
  placeholder: '',
  rows: 3,
})

const emit = defineEmits<Emits>()

// Supported languages
const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
]

// Local state
const localValue = ref<Record<string, string>>({})
const activeTab = ref('en')

// Initialize local value
watch(
  () => props.value,
  (newValue) => {
    localValue.value = { ...newValue }
  },
  { immediate: true }
)

// When local value changes, emit update
function handleChange() {
  emit('update:value', { ...localValue.value })
}

// Set default values for new languages
watch(activeTab, (newTab) => {
  if (!localValue.value[newTab]) {
    localValue.value[newTab] = ''
  }
})
</script>

<style scoped>
.multi-language-input {
  width: 100%;
}
</style>
