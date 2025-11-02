<template>
  <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical" @finish="handleSubmit">
    <a-card title="Basic Information" :bordered="false" style="margin-bottom: 16px">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Template Name" name="name">
            <a-input
              v-model:value="formState.name"
              placeholder="Enter template name"
              :disabled="mode === 'view'"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Description" name="description">
            <a-input
              v-model:value="formState.description"
              placeholder="Enter description (optional)"
              :disabled="mode === 'view'"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>

    <a-card title="Margin Tiers" :bordered="false">
      <template #extra>
        <a-button v-if="mode !== 'view'" type="dashed" size="small" @click="addTier">
          <template #icon><PlusOutlined /></template>
          Add Tier
        </a-button>
      </template>

      <a-table
        :columns="tierColumns"
        :data-source="formState.tiers"
        :pagination="false"
        :scroll="{ x: 800 }"
        size="small"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'notionalFrom'">
            <a-form-item
              :name="['tiers', index, 'notionalFrom']"
              :rules="[{ required: true, message: 'Required' }]"
              style="margin-bottom: 0"
            >
              <a-input-number
                v-model:value="record.notionalFrom"
                :min="0"
                :precision="2"
                :step="1000"
                style="width: 100%"
                placeholder="From"
                :disabled="mode === 'view'"
              />
            </a-form-item>
          </template>

          <template v-else-if="column.key === 'notionalTo'">
            <a-form-item
              :name="['tiers', index, 'notionalTo']"
              :rules="[{ required: true, message: 'Required' }]"
              style="margin-bottom: 0"
            >
              <a-input-number
                v-model:value="record.notionalTo"
                :min="0"
                :precision="2"
                :step="1000"
                style="width: 100%"
                placeholder="To"
                :disabled="mode === 'view'"
              />
            </a-form-item>
          </template>

          <template v-else-if="column.key === 'initialMarginRate'">
            <a-form-item
              :name="['tiers', index, 'initialMarginRate']"
              :rules="[
                { required: true, message: 'Required' },
                { type: 'number', min: 0, max: 1, message: 'Must be between 0 and 1' },
              ]"
              style="margin-bottom: 0"
            >
              <a-input-number
                v-model:value="record.initialMarginRate"
                :min="0"
                :max="1"
                :precision="4"
                :step="0.01"
                style="width: 100%"
                placeholder="0.10"
                :disabled="mode === 'view'"
              />
            </a-form-item>
          </template>

          <template v-else-if="column.key === 'maintenanceMarginRate'">
            <a-form-item
              :name="['tiers', index, 'maintenanceMarginRate']"
              :rules="[
                { required: true, message: 'Required' },
                { type: 'number', min: 0, max: 1, message: 'Must be between 0 and 1' },
              ]"
              style="margin-bottom: 0"
            >
              <a-input-number
                v-model:value="record.maintenanceMarginRate"
                :min="0"
                :max="1"
                :precision="4"
                :step="0.01"
                style="width: 100%"
                placeholder="0.05"
                :disabled="mode === 'view'"
              />
            </a-form-item>
          </template>

          <template v-else-if="column.key === 'maxLeverage'">
            <a-form-item
              :name="['tiers', index, 'maxLeverage']"
              :rules="[
                { required: true, message: 'Required' },
                { type: 'number', min: 1, max: 125, message: 'Must be between 1 and 125' },
              ]"
              style="margin-bottom: 0"
            >
              <a-input-number
                v-model:value="record.maxLeverage"
                :min="1"
                :max="125"
                :precision="0"
                style="width: 100%"
                placeholder="10"
                :disabled="mode === 'view'"
              />
            </a-form-item>
          </template>

          <template v-else-if="column.key === 'actions'">
            <a-button
              v-if="mode !== 'view' && formState.tiers.length > 1"
              type="link"
              danger
              size="small"
              @click="removeTier(index)"
            >
              <template #icon><DeleteOutlined /></template>
            </a-button>
          </template>
        </template>
      </a-table>

      <a-alert type="info" message="Tier Configuration Tips" style="margin-top: 16px">
        <template #description>
          <ul style="margin: 0; padding-left: 20px">
            <li>Tiers should cover continuous notional value ranges</li>
            <li>Initial margin rate must be higher than maintenance margin rate</li>
            <li>Higher notional values typically have lower leverage limits</li>
            <li>Rates are expressed as decimals (e.g., 0.10 = 10%)</li>
          </ul>
        </template>
      </a-alert>
    </a-card>

    <div v-if="mode !== 'view'" style="margin-top: 24px; text-align: right">
      <a-space>
        <a-button @click="handleCancel">Cancel</a-button>
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ mode === 'create' ? 'Create' : 'Update' }}
        </a-button>
      </a-space>
    </div>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import type { MarginTemplate, MarginTier } from '@/types/models'
import type { FormInstance } from 'ant-design-vue'

interface Props {
  modelValue?: MarginTemplate | null
  mode?: 'create' | 'edit' | 'view'
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: MarginTemplate): void
  (e: 'submit', value: any): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()

const formState = reactive<{
  name: string
  description: string
  tiers: MarginTier[]
}>({
  name: '',
  description: '',
  tiers: [
    {
      notionalFrom: '0',
      notionalTo: '50000',
      initialMarginRate: 0.1,
      maintenanceMarginRate: 0.05,
      maxLeverage: 20,
    },
  ],
})

const rules = {
  name: [
    { required: true, message: 'Please enter template name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Name must be between 2 and 50 characters', trigger: 'blur' },
  ],
}

const tierColumns = [
  {
    title: 'Notional From (USD)',
    key: 'notionalFrom',
    width: 150,
  },
  {
    title: 'Notional To (USD)',
    key: 'notionalTo',
    width: 150,
  },
  {
    title: 'Initial Margin Rate',
    key: 'initialMarginRate',
    width: 150,
  },
  {
    title: 'Maintenance Margin Rate',
    key: 'maintenanceMarginRate',
    width: 180,
  },
  {
    title: 'Max Leverage',
    key: 'maxLeverage',
    width: 120,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 80,
    fixed: 'right' as const,
  },
]

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      formState.name = newValue.name
      formState.description = newValue.description || ''
      formState.tiers = JSON.parse(JSON.stringify(newValue.tiers))
    }
  },
  { immediate: true }
)

function addTier() {
  const lastTier = formState.tiers[formState.tiers.length - 1]
  formState.tiers.push({
    notionalFrom: lastTier?.notionalTo || '0',
    notionalTo: '100000',
    initialMarginRate: 0.1,
    maintenanceMarginRate: 0.05,
    maxLeverage: 10,
  })
}

function removeTier(index: number) {
  formState.tiers.splice(index, 1)
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    emit('submit', {
      name: formState.name,
      description: formState.description,
      tiers: formState.tiers,
    })
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped>
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-table-small) {
  font-size: 13px;
}
</style>
