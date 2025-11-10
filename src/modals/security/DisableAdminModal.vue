<template>
  <a-modal
    :open="open"
    title="Disable Admin User"
    :width="520"
    :confirm-loading="loading"
    ok-text="Disable"
    ok-type="danger"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div class="disable-admin-modal">
      <a-alert
        message="Warning"
        description="Disabling this admin user will immediately revoke their access to the system. This action can be reversed later."
        type="warning"
        show-icon
        style="margin-bottom: 16px"
      />

      <a-descriptions bordered :column="1" size="small" style="margin-bottom: 16px">
        <a-descriptions-item label="Username">
          {{ adminUser?.username }}
        </a-descriptions-item>
        <a-descriptions-item label="Email">
          {{ adminUser?.email }}
        </a-descriptions-item>
        <a-descriptions-item label="Roles">
          <a-tag v-for="role in adminUser?.roles" :key="role" color="blue">
            {{ role }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Last Login">
          {{ adminUser?.lastLoginAt }}
        </a-descriptions-item>
      </a-descriptions>

      <a-form layout="vertical">
        <a-form-item
          label="Reason for Disabling"
          required
          :validate-status="reasonError ? 'error' : ''"
          :help="reasonError"
        >
          <a-textarea
            v-model:value="reason"
            placeholder="Please provide a reason for disabling this admin user"
            :rows="4"
            :maxlength="500"
            show-count
          />
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="confirmed">
            I understand that this will immediately revoke access for this admin user
          </a-checkbox>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { AdminUser } from '@/services/api/facade'

interface Props {
  open: boolean
  adminUser?: AdminUser | null
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'confirm', reason: string): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const reason = ref('')
const confirmed = ref(false)
const reasonError = ref('')

watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      reason.value = ''
      confirmed.value = false
      reasonError.value = ''
    }
  }
)

function handleOk() {
  // Validate
  if (!reason.value.trim()) {
    reasonError.value = 'Please provide a reason'
    return
  }

  if (!confirmed.value) {
    reasonError.value = 'Please confirm by checking the checkbox'
    return
  }

  emit('confirm', reason.value)
}

function handleCancel() {
  emit('update:open', false)
  emit('cancel')
}
</script>

<style scoped>
.disable-admin-modal {
  padding: 8px 0;
}
</style>
