<template>
  <a-form
    :model="formState"
    :rules="rules"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    @finish="handleSubmit"
  >
    <a-form-item label="Type" name="type">
      <a-select v-model:value="formState.type" placeholder="Select blacklist type">
        <a-select-option value="address">Wallet Address</a-select-option>
        <a-select-option value="device">Device ID</a-select-option>
        <a-select-option value="ip">IP Address</a-select-option>
        <a-select-option value="country">Country</a-select-option>
        <a-select-option value="email">Email</a-select-option>
        <a-select-option value="phone">Phone Number</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Value" name="value">
      <a-input v-model:value="formState.value" :placeholder="getValuePlaceholder()" />
    </a-form-item>

    <a-form-item label="Reason" name="reason">
      <a-textarea
        v-model:value="formState.reason"
        placeholder="Enter reason for blacklisting"
        :rows="3"
      />
    </a-form-item>

    <a-form-item label="Source" name="source">
      <a-select v-model:value="formState.source" placeholder="Select source">
        <a-select-option value="manual">Manual</a-select-option>
        <a-select-option value="auto">Automatic</a-select-option>
        <a-select-option value="import">Import</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Status" name="status">
      <a-select v-model:value="formState.status" placeholder="Select status">
        <a-select-option value="active">Active</a-select-option>
        <a-select-option value="expired">Expired</a-select-option>
        <a-select-option value="removed">Removed</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Expires At" name="expiresAt">
      <a-date-picker
        v-model:value="formState.expiresAt"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
        placeholder="Leave empty for permanent"
        style="width: 100%"
      />
    </a-form-item>

    <a-form-item label="Notes" name="notes">
      <a-textarea
        v-model:value="formState.notes"
        placeholder="Additional notes (optional)"
        :rows="3"
      />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
      <a-space>
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ mode === 'create' ? 'Add to Blacklist' : 'Update' }}
        </a-button>
        <a-button @click="handleCancel">Cancel</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { BlacklistEntry } from '@/contracts/risk'
import dayjs, { Dayjs } from 'dayjs'

interface Props {
  initialData?: BlacklistEntry
  mode?: 'create' | 'edit'
  loading?: boolean
}

interface Emits {
  (e: 'submit', data: Partial<BlacklistEntry>): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formState = reactive<Partial<BlacklistEntry> & { expiresAt?: Dayjs }>({
  type: 'address',
  value: '',
  reason: '',
  source: 'manual',
  status: 'active',
  notes: '',
  expiresAt: undefined,
})

const rules = {
  type: [{ required: true, message: 'Please select type' }],
  value: [{ required: true, message: 'Please enter value' }],
  reason: [{ required: true, message: 'Please enter reason' }],
  source: [{ required: true, message: 'Please select source' }],
  status: [{ required: true, message: 'Please select status' }],
}

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      Object.assign(formState, {
        type: newData.type,
        value: newData.value,
        reason: newData.reason,
        source: newData.source,
        status: newData.status,
        notes: newData.notes,
        expiresAt: newData.expiresAt ? dayjs(newData.expiresAt) : undefined,
      })
    }
  },
  { immediate: true }
)

function getValuePlaceholder(): string {
  switch (formState.type) {
    case 'address':
      return 'Enter wallet address (e.g., 0x1234...)'
    case 'device':
      return 'Enter device ID'
    case 'ip':
      return 'Enter IP address (e.g., 192.168.1.1)'
    case 'country':
      return 'Enter country code (e.g., US, CN)'
    case 'email':
      return 'Enter email address'
    case 'phone':
      return 'Enter phone number'
    default:
      return 'Enter value'
  }
}

function handleSubmit() {
  const submitData: Partial<BlacklistEntry> = {
    ...formState,
    expiresAt: formState.expiresAt?.toISOString(),
  }
  emit('submit', submitData)
}

function handleCancel() {
  emit('cancel')
}
</script>
