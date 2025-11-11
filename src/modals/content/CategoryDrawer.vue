<template>
  <a-drawer
    v-model:open="visible"
    :title="drawerTitle"
    width="520"
    :body-style="{ paddingBottom: '80px' }"
    @close="handleClose"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      layout="vertical"
      @finish="handleSubmit"
    >
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Name" name="name">
            <a-input v-model:value="formData.name" placeholder="Enter category name" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Slug" name="slug">
            <a-input v-model:value="formData.slug" placeholder="Enter URL slug" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Description" name="description">
            <a-textarea
              v-model:value="formData.description"
              placeholder="Enter category description"
              :rows="3"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Status" name="status">
            <a-select
              v-model:value="formData.status"
              placeholder="Select status"
              :options="statusOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Parent Category" name="parentId">
            <a-select
              v-model:value="formData.parentId"
              placeholder="Select parent category"
              :options="parentCategoryOptions"
              allow-clear
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Sort Order" name="sortOrder">
            <a-input-number
              v-model:value="formData.sortOrder"
              placeholder="Enter sort order"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="handleClose">Cancel</a-button>
        <a-button v-if="mode !== 'view'" type="primary" @click="handleSubmitForm">
          {{ mode === 'create' ? 'Create' : 'Update' }}
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { Category } from '@/contracts/content'

interface Props {
  open?: boolean
  category?: Category | null
  mode?: 'create' | 'edit' | 'view'
  categories?: Category[]
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', payload: Partial<Category>): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  category: null,
  mode: 'create',
  categories: () => [],
})

const emit = defineEmits<Emits>()

// Form data
const formData = ref({
  name: '',
  slug: '',
  description: '',
  parentId: undefined as string | undefined,
  status: 'active' as 'active' | 'inactive',
  sortOrder: 0,
})

const formRef = ref()
const visible = ref(false)

// Options
const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

// Computed
const drawerTitle = computed(() => {
  if (props.mode === 'create') return 'Create Category'
  if (props.mode === 'edit') return 'Edit Category'
  return 'View Category'
})

const parentCategoryOptions = computed(() => {
  return props.categories
    .filter((cat) => !props.category || cat.id !== props.category.id)
    .map((cat) => ({
      label: cat.name.en,
      value: cat.id,
    }))
})

// Form rules
const formRules = {
  name: [{ required: true, message: 'Please enter category name' }],
  slug: [{ required: true, message: 'Please enter URL slug' }],
  status: [{ required: true, message: 'Please select a status' }],
}

// Watchers
watch(
  () => props.open,
  (newVal) => {
    visible.value = newVal
    if (newVal && props.category) {
      // Populate form with category data
      formData.value = {
        name: props.category.name.en || '',
        slug: props.category.slug || '',
        description: props.category.description || '',
        parentId: props.category.parentId,
        status: props.category.status,
        sortOrder: props.category.sortOrder || 0,
      }
    } else if (newVal && props.mode === 'create') {
      // Reset form for create mode
      formData.value = {
        name: '',
        slug: '',
        description: '',
        parentId: undefined,
        status: 'active',
        sortOrder: props.categories.length + 1,
      }
    }
  }
)

// Methods
function handleClose() {
  visible.value = false
  emit('update:open', false)
  emit('close')
}

async function handleSubmitForm() {
  try {
    await formRef.value?.validate()
    const payload: Partial<Category> = {
      name: { en: formData.value.name },
      slug: formData.value.slug,
      description: formData.value.description,
      parentId: formData.value.parentId,
      status: formData.value.status,
      sortOrder: formData.value.sortOrder,
    }
    emit('submit', payload)
  } catch (error) {
    message.error('Please check the form for errors')
  }
}

function handleSubmit() {
  handleSubmitForm()
}
</script>

<style scoped>
/* Add any specific styles if needed */
</style>
