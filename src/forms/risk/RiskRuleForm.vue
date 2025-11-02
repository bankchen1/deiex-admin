<template>
  <a-form
    :model="formState"
    :rules="rules"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    @finish="handleSubmit"
  >
    <a-form-item label="Rule Name" name="name">
      <a-input v-model:value="formState.name" placeholder="Enter rule name" />
    </a-form-item>

    <a-form-item label="Description" name="description">
      <a-textarea
        v-model:value="formState.description"
        placeholder="Enter rule description"
        :rows="3"
      />
    </a-form-item>

    <a-form-item label="Priority" name="priority">
      <a-input-number
        v-model:value="formState.priority"
        :min="1"
        :max="100"
        placeholder="1-100 (higher = more important)"
        style="width: 100%"
      />
    </a-form-item>

    <a-form-item label="Enabled" name="enabled">
      <a-switch v-model:checked="formState.enabled" />
    </a-form-item>

    <a-divider>Trigger Conditions</a-divider>

    <div v-for="(condition, index) in formState.conditions" :key="index" class="condition-item">
      <a-row :gutter="16">
        <a-col :span="7">
          <a-form-item
            :name="['conditions', index, 'field']"
            :rules="[{ required: true, message: 'Field is required' }]"
          >
            <a-select
              v-model:value="condition.field"
              placeholder="Select field"
              :options="fieldOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item
            :name="['conditions', index, 'operator']"
            :rules="[{ required: true, message: 'Operator is required' }]"
          >
            <a-select
              v-model:value="condition.operator"
              placeholder="Operator"
              :options="operatorOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="9">
          <a-form-item
            :name="['conditions', index, 'value']"
            :rules="[{ required: true, message: 'Value is required' }]"
          >
            <a-input
              v-if="!['in', 'contains'].includes(condition.operator)"
              v-model:value="condition.value"
              placeholder="Value"
            />
            <a-select
              v-else
              v-model:value="condition.value"
              mode="tags"
              placeholder="Enter values"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="2">
          <a-button type="text" danger @click="removeCondition(index)">
            <template #icon><DeleteOutlined /></template>
          </a-button>
        </a-col>
      </a-row>
    </div>

    <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
      <a-button type="dashed" block @click="addCondition">
        <template #icon><PlusOutlined /></template>
        Add Condition
      </a-button>
    </a-form-item>

    <a-divider>Actions</a-divider>

    <div v-for="(action, index) in formState.actions" :key="index" class="action-item">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item
            :name="['actions', index, 'type']"
            :rules="[{ required: true, message: 'Action type is required' }]"
          >
            <a-select
              v-model:value="action.type"
              placeholder="Select action"
              :options="actionOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="14">
          <a-form-item :name="['actions', index, 'params']">
            <JsonEditor
              v-model:value="action.params"
              placeholder="Action parameters (JSON)"
              :height="80"
            />
          </a-form-item>
        </a-col>
        <a-col :span="2">
          <a-button type="text" danger @click="removeAction(index)">
            <template #icon><DeleteOutlined /></template>
          </a-button>
        </a-col>
      </a-row>
    </div>

    <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
      <a-button type="dashed" block @click="addAction">
        <template #icon><PlusOutlined /></template>
        Add Action
      </a-button>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
      <a-space>
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ mode === 'create' ? 'Create' : 'Update' }}
        </a-button>
        <a-button @click="handleCancel">Cancel</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import JsonEditor from '@/shared/JsonEditor.vue'
import type { RiskRule, RiskCondition, RiskAction } from '@/types/models'

interface Props {
  initialData?: RiskRule
  mode?: 'create' | 'edit'
  loading?: boolean
}

interface Emits {
  (e: 'submit', data: Partial<RiskRule>): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formState = reactive<Partial<RiskRule>>({
  name: '',
  description: '',
  priority: 50,
  enabled: true,
  conditions: [],
  actions: [],
})

const rules = {
  name: [{ required: true, message: 'Please enter rule name' }],
  priority: [{ required: true, message: 'Please enter priority' }],
  conditions: [{ required: true, message: 'At least one condition is required' }],
  actions: [{ required: true, message: 'At least one action is required' }],
}

const fieldOptions = [
  { label: 'User ID', value: 'userId' },
  { label: 'Country', value: 'country' },
  { label: 'IP Address', value: 'ip' },
  { label: 'Device ID', value: 'deviceId' },
  { label: 'Transaction Amount', value: 'amount' },
  { label: 'Transaction Count', value: 'txCount' },
  { label: 'Risk Score', value: 'riskScore' },
  { label: 'VIP Level', value: 'vipLevel' },
  { label: 'Account Age (days)', value: 'accountAge' },
  { label: 'KYC Status', value: 'kycStatus' },
  { label: 'Currency', value: 'currency' },
  { label: 'Chain', value: 'chain' },
]

const operatorOptions = [
  { label: 'Equals (=)', value: 'eq' },
  { label: 'Not Equals (≠)', value: 'ne' },
  { label: 'Greater Than (>)', value: 'gt' },
  { label: 'Greater or Equal (≥)', value: 'gte' },
  { label: 'Less Than (<)', value: 'lt' },
  { label: 'Less or Equal (≤)', value: 'lte' },
  { label: 'In List', value: 'in' },
  { label: 'Contains', value: 'contains' },
]

const actionOptions = [
  { label: 'Block Transaction', value: 'block' },
  { label: 'Require Review', value: 'review' },
  { label: 'Send Alert', value: 'alert' },
  { label: 'Add Tag', value: 'tag' },
]

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      Object.assign(formState, {
        name: newData.name,
        description: newData.description,
        priority: newData.priority,
        enabled: newData.enabled,
        conditions: JSON.parse(JSON.stringify(newData.conditions || [])),
        actions: JSON.parse(JSON.stringify(newData.actions || [])),
      })
    }
  },
  { immediate: true }
)

function addCondition() {
  if (!formState.conditions) {
    formState.conditions = []
  }
  formState.conditions.push({
    field: '',
    operator: 'eq',
    value: '',
  } as RiskCondition)
}

function removeCondition(index: number) {
  formState.conditions?.splice(index, 1)
}

function addAction() {
  if (!formState.actions) {
    formState.actions = []
  }
  formState.actions.push({
    type: 'alert',
    params: {},
  } as RiskAction)
}

function removeAction(index: number) {
  formState.actions?.splice(index, 1)
}

function handleSubmit() {
  emit('submit', formState)
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped>
.condition-item,
.action-item {
  margin-bottom: 16px;
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
}
</style>
