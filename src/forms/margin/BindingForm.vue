<template>
  <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical" @finish="handleSubmit">
    <a-form-item label="Margin Template" name="templateId">
      <a-select
        v-model:value="formState.templateId"
        placeholder="Select margin template"
        :loading="loading"
        show-search
        :filter-option="filterOption"
        :disabled="mode === 'view'"
      >
        <a-select-option v-for="template in templates" :key="template.id" :value="template.id">
          {{ template.name }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Symbols" name="symbols">
      <a-select
        v-model:value="formState.symbols"
        mode="multiple"
        placeholder="Select symbols to bind"
        :loading="loadingSymbols"
        show-search
        :filter-option="filterOption"
        :disabled="mode === 'view'"
        :max-tag-count="10"
      >
        <a-select-option v-for="symbol in availableSymbols" :key="symbol" :value="symbol">
          {{ symbol }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-alert
      v-if="formState.symbols.length > 0"
      type="info"
      :message="`${formState.symbols.length} symbol(s) selected`"
      style="margin-bottom: 16px"
    />

    <div v-if="mode !== 'view'" style="text-align: right">
      <a-space>
        <a-button @click="handleCancel">Cancel</a-button>
        <a-button type="primary" html-type="submit" :loading="loading"> Bind Symbols </a-button>
      </a-space>
    </div>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { MarginTemplate } from '@/contracts/config'
import type { FormInstance } from 'ant-design-vue'
import { useInstrumentsStore } from '@/stores/instruments'

interface Props {
  templates: MarginTemplate[]
  mode?: 'create' | 'edit' | 'view'
  loading?: boolean
}

interface Emits {
  (e: 'submit', value: { templateId: string; symbols: string[] }): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const instrumentsStore = useInstrumentsStore()

const formState = reactive<{
  templateId: string
  symbols: string[]
}>({
  templateId: '',
  symbols: [],
})

const loadingSymbols = ref(false)
const availableSymbols = ref<string[]>([])

const rules = {
  templateId: [{ required: true, message: 'Please select a template', trigger: 'change' }],
  symbols: [
    { required: true, message: 'Please select at least one symbol', trigger: 'change' },
    { type: 'array', min: 1, message: 'Please select at least one symbol', trigger: 'change' },
  ],
}

onMounted(async () => {
  await loadAvailableSymbols()
})

async function loadAvailableSymbols() {
  loadingSymbols.value = true
  try {
    await instrumentsStore.fetchPublished({ type: 'futures' })
    availableSymbols.value = instrumentsStore.published
      .filter((inst) => inst.type === 'futures')
      .map((inst) => inst.symbol)
  } catch (error) {
    console.error('Failed to load symbols:', error)
  } finally {
    loadingSymbols.value = false
  }
}

function filterOption(input: string, option: any) {
  const text = option.children?.[0]?.children || option.value
  return text.toLowerCase().includes(input.toLowerCase())
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    emit('submit', {
      templateId: formState.templateId,
      symbols: formState.symbols,
    })
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

function handleCancel() {
  emit('cancel')
}
</script>
