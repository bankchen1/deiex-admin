<template>
  <div class="user-forms-demo">
    <a-page-header
      title="User Management Forms Demo"
      sub-title="Demonstration of VipUpdateForm, TagForm, AdjustVipModal, and Reset2FAModal"
    />

    <div class="demo-content">
      <a-row :gutter="[16, 16]">
        <!-- VipUpdateForm Demo -->
        <a-col :span="24">
          <a-card title="VipUpdateForm Component">
            <a-alert
              message="Standalone Form Component"
              description="This form can be used independently or embedded in modals/drawers. It includes dual approval warning for VIP level >= 3."
              type="info"
              show-icon
              style="margin-bottom: 16px"
            />

            <VipUpdateForm
              ref="vipFormRef"
              :user-id="mockUser.id"
              :current-vip-level="mockUser.vipLevel"
              @update:model-value="handleVipFormChange"
            />

            <a-divider />

            <a-space>
              <a-button type="primary" @click="handleVipFormSubmit"> Submit VIP Update </a-button>
              <a-button @click="handleVipFormReset"> Reset Form </a-button>
            </a-space>

            <a-divider />

            <div class="form-data-preview">
              <h4>Form Data:</h4>
              <pre>{{ JSON.stringify(vipFormData, null, 2) }}</pre>
            </div>
          </a-card>
        </a-col>

        <!-- TagForm Demo -->
        <a-col :span="24">
          <a-card title="TagForm Component">
            <a-alert
              message="Risk Tag Management Form"
              description="This form allows managing user risk tags with validation and reason tracking."
              type="info"
              show-icon
              style="margin-bottom: 16px"
            />

            <TagForm
              ref="tagFormRef"
              :user-id="mockUser.id"
              :current-tags="mockUser.riskTags"
              @update:model-value="handleTagFormChange"
            />

            <a-divider />

            <a-space>
              <a-button type="primary" @click="handleTagFormSubmit"> Submit Tag Update </a-button>
              <a-button @click="handleTagFormReset"> Reset Form </a-button>
            </a-space>

            <a-divider />

            <div class="form-data-preview">
              <h4>Form Data:</h4>
              <pre>{{ JSON.stringify(tagFormData, null, 2) }}</pre>
            </div>
          </a-card>
        </a-col>

        <!-- Modal Demos -->
        <a-col :span="24">
          <a-card title="Modal Components">
            <a-alert
              message="Modal Demonstrations"
              description="Click the buttons below to open the respective modals."
              type="info"
              show-icon
              style="margin-bottom: 16px"
            />

            <a-space>
              <a-button type="primary" @click="adjustVipModalOpen = true">
                Open AdjustVipModal
              </a-button>
              <a-button danger @click="reset2FAModalOpen = true"> Open Reset2FAModal </a-button>
            </a-space>

            <a-divider />

            <div class="submission-log">
              <h4>Submission Log:</h4>
              <a-list
                v-if="submissionLog.length > 0"
                :data-source="submissionLog"
                size="small"
                bordered
              >
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>
                        <a-tag
                          :color="
                            item.type === 'vip' ? 'blue' : item.type === 'tag' ? 'orange' : 'red'
                          "
                        >
                          {{ item.type.toUpperCase() }}
                        </a-tag>
                        {{ item.timestamp }}
                      </template>
                      <template #description>
                        <pre style="margin: 0">{{ JSON.stringify(item.data, null, 2) }}</pre>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>
              <a-empty v-else description="No submissions yet" />
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- Modals -->
    <AdjustVipModal
      v-model:open="adjustVipModalOpen"
      :user-id="mockUser.id"
      :current-vip-level="mockUser.vipLevel"
      @submit="handleAdjustVipSubmit"
    />

    <Reset2FAModal
      v-model:open="reset2FAModalOpen"
      :user-id="mockUser.id"
      @submit="handleReset2FASubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import VipUpdateForm from '@/forms/users/VipUpdateForm.vue'
import TagForm from '@/forms/users/TagForm.vue'
import AdjustVipModal from '@/modals/users/AdjustVipModal.vue'
import Reset2FAModal from '@/modals/users/Reset2FAModal.vue'

// Mock user data
const mockUser = ref({
  id: 'USR-12345',
  nickname: 'demo_user',
  email: 'demo@example.com',
  vipLevel: 2,
  riskTags: ['high_risk', 'suspicious_activity'],
})

// Form refs
const vipFormRef = ref()
const tagFormRef = ref()

// Form data
const vipFormData = ref<any>({})
const tagFormData = ref<any>({})

// Modal states
const adjustVipModalOpen = ref(false)
const reset2FAModalOpen = ref(false)

// Submission log
const submissionLog = ref<any[]>([])

// VipUpdateForm handlers
function handleVipFormChange(data: any) {
  vipFormData.value = data
}

async function handleVipFormSubmit() {
  if (!vipFormRef.value) return

  const isValid = await vipFormRef.value.validate()
  if (!isValid) {
    message.warning('Please fix validation errors')
    return
  }

  submissionLog.value.unshift({
    type: 'vip',
    timestamp: new Date().toLocaleString(),
    data: { ...vipFormData.value },
  })

  message.success('VIP update form submitted successfully')
}

function handleVipFormReset() {
  vipFormRef.value?.resetFields()
  message.info('VIP form reset')
}

// TagForm handlers
function handleTagFormChange(data: any) {
  tagFormData.value = data
}

async function handleTagFormSubmit() {
  if (!tagFormRef.value) return

  const isValid = await tagFormRef.value.validate()
  if (!isValid) {
    message.warning('Please fix validation errors')
    return
  }

  submissionLog.value.unshift({
    type: 'tag',
    timestamp: new Date().toLocaleString(),
    data: { ...tagFormData.value },
  })

  message.success('Tag update form submitted successfully')
}

function handleTagFormReset() {
  tagFormRef.value?.resetFields()
  message.info('Tag form reset')
}

// Modal handlers
function handleAdjustVipSubmit(data: any) {
  submissionLog.value.unshift({
    type: 'vip',
    timestamp: new Date().toLocaleString(),
    data: { ...data, source: 'AdjustVipModal' },
  })

  message.success('VIP adjustment submitted from modal')
  adjustVipModalOpen.value = false
}

function handleReset2FASubmit(data: any) {
  submissionLog.value.unshift({
    type: '2fa',
    timestamp: new Date().toLocaleString(),
    data: { ...data, source: 'Reset2FAModal' },
  })

  message.success('2FA reset submitted from modal')
  reset2FAModalOpen.value = false
}
</script>

<style scoped>
.user-forms-demo {
  padding: 24px;
}

.demo-content {
  margin-top: 16px;
}

.form-data-preview {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
}

.form-data-preview h4 {
  margin-top: 0;
  margin-bottom: 8px;
}

.form-data-preview pre {
  margin: 0;
  font-size: 12px;
  overflow-x: auto;
}

.submission-log {
  margin-top: 16px;
}

.submission-log h4 {
  margin-bottom: 12px;
}
</style>
