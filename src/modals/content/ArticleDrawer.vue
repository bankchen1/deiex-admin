<template>
  <a-drawer
    v-model:open="visible"
    :title="drawerTitle"
    width="720"
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
          <a-form-item label="Title" name="title">
            <MultiLanguageInput v-model:value="formData.title" placeholder="Enter article title" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Category" name="categoryId">
            <a-select
              v-model:value="formData.categoryId"
              placeholder="Select category"
              :options="categoryOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Status" name="status">
            <a-select
              v-model:value="formData.status"
              placeholder="Select status"
              :options="statusOptions"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Summary" name="summary">
            <MultiLanguageInput
              v-model:value="formData.summary"
              placeholder="Enter article summary"
              :rows="3"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Content" name="content">
            <MultiLanguageInput
              v-model:value="formData.content"
              placeholder="Enter article content"
              :rows="6"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Tags" name="tags">
            <a-select
              v-model:value="formData.tags"
              mode="tags"
              placeholder="Add tags"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Cover Image" name="coverImage">
            <ImageUploader v-model:value="formData.coverImage" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Featured" name="featured">
            <a-switch v-model:checked="formData.featured" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Slug" name="slug">
            <a-input v-model:value="formData.slug" placeholder="Enter URL slug" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="SEO Title" name="seoTitle">
            <MultiLanguageInput v-model:value="formData.seoTitle" placeholder="Enter SEO title" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="SEO Description" name="seoDescription">
            <MultiLanguageInput
              v-model:value="formData.seoDescription"
              placeholder="Enter SEO description"
              :rows="2"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="SEO Keywords" name="seoKeywords">
            <a-select
              v-model:value="formData.seoKeywords"
              mode="tags"
              placeholder="Add SEO keywords"
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
import MultiLanguageInput from '@/shared/MultiLanguageInput.vue'
import ImageUploader from '@/shared/ImageUploader.vue'
import type { Article } from '@/types/models'

interface Props {
  open?: boolean
  article?: Article | null
  mode?: 'create' | 'edit' | 'view'
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', payload: Partial<Article>): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  article: null,
  mode: 'create',
})

const emit = defineEmits<Emits>()

// Form data
const formData = ref({
  title: {} as Record<string, string>,
  categoryId: undefined as string | undefined,
  status: 'draft' as 'draft' | 'published' | 'archived',
  summary: {} as Record<string, string>,
  content: {} as Record<string, string>,
  tags: [] as string[],
  coverImage: '',
  featured: false,
  slug: '',
  seoTitle: {} as Record<string, string>,
  seoDescription: {} as Record<string, string>,
  seoKeywords: [] as string[],
})

const formRef = ref()
const visible = ref(false)

// Options
const categoryOptions = [
  { label: 'Technology', value: '1' },
  { label: 'Market Insights', value: '2' },
]

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
]

// Form rules
const formRules = {
  title: [{ required: true, message: 'Please enter article title' }],
  categoryId: [{ required: true, message: 'Please select a category' }],
  status: [{ required: true, message: 'Please select a status' }],
  content: [{ required: true, message: 'Please enter article content' }],
}

// Computed
const drawerTitle = computed(() => {
  if (props.mode === 'create') return 'Create Article'
  if (props.mode === 'edit') return 'Edit Article'
  return 'View Article'
})

// Watchers
watch(
  () => props.open,
  (newVal) => {
    visible.value = newVal
    if (newVal && props.article) {
      // Populate form with article data
      formData.value = {
        title: props.article.title || {},
        categoryId: props.article.categoryId,
        status: props.article.status,
        summary: props.article.summary || {},
        content: props.article.content || {},
        tags: props.article.tags || [],
        coverImage: props.article.coverImage || '',
        featured: props.article.featured || false,
        slug: props.article.slug || '',
        seoTitle: props.article.seoTitle || {},
        seoDescription: props.article.seoDescription || {},
        seoKeywords: props.article.seoKeywords || [],
      }
    } else if (newVal && props.mode === 'create') {
      // Reset form for create mode
      formData.value = {
        title: {},
        categoryId: undefined,
        status: 'draft',
        summary: {},
        content: {},
        tags: [],
        coverImage: '',
        featured: false,
        slug: '',
        seoTitle: {},
        seoDescription: {},
        seoKeywords: [],
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
    const payload: Partial<Article> = {
      title: formData.value.title,
      categoryId: formData.value.categoryId,
      status: formData.value.status,
      summary: formData.value.summary,
      content: formData.value.content,
      tags: formData.value.tags,
      coverImage: formData.value.coverImage,
      featured: formData.value.featured,
      slug: formData.value.slug,
      seoTitle: formData.value.seoTitle,
      seoDescription: formData.value.seoDescription,
      seoKeywords: formData.value.seoKeywords,
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
