<template>
  <div class="rich-text-editor">
    <div ref="editorRef" class="editor-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

interface Props {
  value?: string
}

interface Emits {
  (e: 'update:value', value: string): void
  (e: 'change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
})

const emit = defineEmits<Emits>()

const editorRef = ref<HTMLElement>()
let quillInstance: Quill | null = null

onMounted(() => {
  if (editorRef.value) {
    quillInstance = new Quill(editorRef.value, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
      },
      placeholder: 'Write your content here...',
    })

    // Set initial value
    if (props.value) {
      quillInstance.root.innerHTML = props.value
    }

    // Add change listener
    quillInstance.on('text-change', () => {
      const content = quillInstance!.root.innerHTML
      emit('update:value', content)
      emit('change', content)
    })
  }
})

onUnmounted(() => {
  // Clean up quill instance if needed
})

// Watch for external value changes
watch(
  () => props.value,
  (newValue) => {
    if (quillInstance && newValue !== quillInstance.root.innerHTML) {
      quillInstance.root.innerHTML = newValue
    }
  }
)
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}

.editor-container {
  min-height: 200px;
}

:deep(.ql-toolbar.ql-snow) {
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-color: #d9d9d9;
}

:deep(.ql-container.ql-snow) {
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  border-color: #d9d9d9;
  min-height: 150px;
}
</style>
