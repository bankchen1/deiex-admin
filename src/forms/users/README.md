# User Management Forms

This directory contains form components for managing user-related operations in the DEIEX Admin system.

## Components

### VipUpdateForm.vue

A form component for updating user VIP levels with dual approval support.

#### Features

- VIP level selection (0-5)
- Current VIP level display with color coding
- Dual approval warning for VIP level >= 3
- Reason and notes fields with validation
- Form validation and exposure of validation methods

#### Props

```typescript
interface Props {
  userId?: string           // User ID to display
  currentVipLevel?: number  // Current VIP level (default: 0)
}
```

#### Emits

```typescript
interface Emits {
  (e: 'update:modelValue', value: FormData): void  // Emits form data changes
}
```

#### Exposed Methods

```typescript
{
  validate: () => Promise<boolean>      // Validate the form
  resetFields: () => void               // Reset form to initial state
  formData: Ref<FormData>               // Access to form data
  requiresDualApproval: ComputedRef<boolean>  // Whether dual approval is required
}
```

#### Usage

```vue
<template>
  <VipUpdateForm
    ref="vipFormRef"
    :user-id="userId"
    :current-vip-level="currentVipLevel"
    @update:model-value="handleFormChange"
  />
  
  <a-button @click="handleSubmit">Submit</a-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VipUpdateForm from '@/forms/users/VipUpdateForm.vue'

const vipFormRef = ref()

async function handleSubmit() {
  const isValid = await vipFormRef.value.validate()
  if (isValid) {
    const data = vipFormRef.value.formData
    // Submit data...
  }
}
</script>
```

#### Validation Rules

- **vipLevel**: Required, must be different from current level
- **reason**: Required, minimum 10 characters, maximum 500 characters
- **notes**: Optional, maximum 500 characters

#### Dual Approval

VIP levels 3 and above require dual approval from another administrator. The form displays a warning alert when a VIP level >= 3 is selected.

---

### TagForm.vue

A form component for managing user risk tags.

#### Features

- Display current risk tags
- Tag picker with predefined options
- Support for custom tags
- Maximum 10 tags limit
- Reason field with validation

#### Props

```typescript
interface Props {
  userId?: string      // User ID to display
  currentTags?: string[]  // Current risk tags (default: [])
}
```

#### Emits

```typescript
interface Emits {
  (e: 'update:modelValue', value: FormData): void  // Emits form data changes
}
```

#### Exposed Methods

```typescript
{
  validate: () => Promise<boolean>  // Validate the form
  resetFields: () => void           // Reset form to initial state
  formData: Ref<FormData>           // Access to form data
}
```

#### Usage

```vue
<template>
  <TagForm
    ref="tagFormRef"
    :user-id="userId"
    :current-tags="currentTags"
    @update:model-value="handleFormChange"
  />
  
  <a-button @click="handleSubmit">Submit</a-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TagForm from '@/forms/users/TagForm.vue'

const tagFormRef = ref()

async function handleSubmit() {
  const isValid = await tagFormRef.value.validate()
  if (isValid) {
    const data = tagFormRef.value.formData
    // Submit data...
  }
}
</script>
```

#### Validation Rules

- **tags**: Optional array, maximum 10 items
- **reason**: Required, minimum 10 characters, maximum 500 characters

#### Predefined Risk Tags

The form includes the following predefined risk tags:

- `high_risk`
- `suspicious_activity`
- `multiple_accounts`
- `chargeback`
- `fraud_attempt`
- `money_laundering`
- `sanctioned`
- `pep` (Politically Exposed Person)
- `adverse_media`
- `unusual_pattern`
- `large_transactions`
- `rapid_trading`
- `wash_trading`
- `market_manipulation`

Users can also create custom tags by typing in the TagPicker component.

---

## Related Components

### Modals

- **AdjustVipModal** (`@/modals/users/AdjustVipModal.vue`): Modal wrapper for VIP level adjustment
- **Reset2FAModal** (`@/modals/users/Reset2FAModal.vue`): Modal for resetting user 2FA

### Sections

- **UserSecuritySection** (`@/sections/users/UserSecuritySection.vue`): Section component that uses these forms

### Pages

- **User Detail** (`@/pages/users/Detail.vue`): Main page that integrates all user management forms and modals

---

## Integration Example

Here's a complete example of integrating all user management forms in a page:

```vue
<template>
  <div>
    <!-- VIP Adjustment -->
    <a-button @click="adjustVipModalOpen = true">
      Adjust VIP Level
    </a-button>

    <!-- Tag Management -->
    <a-button @click="tagDrawerOpen = true">
      Manage Risk Tags
    </a-button>

    <!-- 2FA Reset -->
    <a-button @click="reset2FAModalOpen = true">
      Reset 2FA
    </a-button>

    <!-- VIP Modal -->
    <AdjustVipModal
      v-model:open="adjustVipModalOpen"
      :user-id="userId"
      :current-vip-level="currentVipLevel"
      @submit="handleVipSubmit"
    />

    <!-- Tag Drawer -->
    <a-drawer
      v-model:open="tagDrawerOpen"
      title="Manage Risk Tags"
      :width="500"
    >
      <TagForm
        ref="tagFormRef"
        :user-id="userId"
        :current-tags="currentTags"
      />
      
      <template #footer>
        <a-space>
          <a-button @click="tagDrawerOpen = false">Cancel</a-button>
          <a-button type="primary" @click="handleTagSubmit">
            Save Changes
          </a-button>
        </a-space>
      </template>
    </a-drawer>

    <!-- 2FA Modal -->
    <Reset2FAModal
      v-model:open="reset2FAModalOpen"
      :user-id="userId"
      @submit="handleReset2FASubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import AdjustVipModal from '@/modals/users/AdjustVipModal.vue'
import Reset2FAModal from '@/modals/users/Reset2FAModal.vue'
import TagForm from '@/forms/users/TagForm.vue'
import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()

const userId = ref('USR-12345')
const currentVipLevel = ref(2)
const currentTags = ref(['high_risk'])

const adjustVipModalOpen = ref(false)
const tagDrawerOpen = ref(false)
const reset2FAModalOpen = ref(false)

const tagFormRef = ref()

async function handleVipSubmit(data: any) {
  try {
    await usersStore.updateVip(userId.value, data)
    message.success('VIP level updated successfully')
  } catch (e: any) {
    message.error(e.message)
  }
}

async function handleTagSubmit() {
  const isValid = await tagFormRef.value.validate()
  if (!isValid) return

  try {
    const formData = tagFormRef.value.formData
    await usersStore.updateTags(userId.value, {
      tags: formData.tags,
      reason: formData.reason,
    })
    message.success('Tags updated successfully')
    tagDrawerOpen.value = false
  } catch (e: any) {
    message.error(e.message)
  }
}

async function handleReset2FASubmit(data: any) {
  try {
    await usersStore.reset2FA(userId.value, data)
    message.success('2FA reset successfully')
  } catch (e: any) {
    message.error(e.message)
  }
}
</script>
```

---

## API Integration

These forms integrate with the following API endpoints:

### VIP Update
```typescript
POST /admin/users/:id/vip
{
  vipLevel: number
  reason: string
  notes?: string
}
```

### Tag Update
```typescript
POST /admin/users/:id/tags
{
  tags: string[]
  reason: string
}
```

### 2FA Reset
```typescript
POST /admin/users/:id/reset-2fa
{
  reason: string
  notes?: string
}
```

---

## Requirements

These forms implement the following requirements from the specification:

- **Requirement 5.6**: User management with VIP adjustment and security settings
- **Requirement 21.6**: Dual approval for sensitive operations (VIP level >= 3)
- **Requirement 21.3**: Audit trail recording for all operations
- **Requirement 23.1-23.5**: Form validation and user-friendly error messages

---

## Demo

See `@/pages/examples/UserFormsDemo.vue` for a comprehensive demonstration of all user management forms and modals.
