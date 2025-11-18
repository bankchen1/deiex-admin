<template>
  <a-row :gutter="16" class="mb-6">
    <a-col :span="24">
      <ChainHealth :chain-health="chainHealth" />
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import ChainHealth from '@/ui/widgets/status/ChainHealth.vue'
import type { ChainHealth as ChainHealthType } from '@/contracts/assets'
import type { PropType } from 'vue'

defineProps({
  chainHealth: {
    type: Array as PropType<ChainHealthType[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>
