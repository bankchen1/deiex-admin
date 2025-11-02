<template>
  <a-tooltip :title="tooltipText">
    <a-button
      v-if="canReveal"
      :icon="isRevealed ? 'EyeInvisibleOutlined' : 'EyeOutlined'"
      size="small"
      @click="toggleReveal"
    >
      {{ isRevealed ? 'Hide' : 'Show' }} Sensitive Data
    </a-button>
  </a-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isRevealed: boolean
  canReveal: boolean
}

interface Emits {
  (e: 'toggle'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tooltipText = computed(() => {
  if (!props.canReveal) {
    return 'You do not have permission to view sensitive data'
  }
  return props.isRevealed
    ? 'Click to hide sensitive data (emails, phone numbers)'
    : 'Click to reveal sensitive data (emails, phone numbers)'
})

function toggleReveal() {
  if (props.canReveal) {
    emit('toggle')
  }
}
</script>

<style scoped>
/* Add any specific styles if needed */
</style>
