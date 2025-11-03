<template>
  <a-card title="Feature Flags" :loading="loading">
    <a-space direction="vertical" style="width: 100%" :size="16">
      <a-input-search
        v-model:value="searchText"
        placeholder="Search features..."
        style="width: 100%"
      />

      <a-list :data-source="filteredFeatures" :loading="loading">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <a-space>
                  <span>{{ item.name }}</span>
                  <a-tag :color="item.enabled ? 'green' : 'default'">
                    {{ item.enabled ? 'Enabled' : 'Disabled' }}
                  </a-tag>
                  <a-tag color="blue">{{ item.module }}</a-tag>
                </a-space>
              </template>
              <template #description>
                <a-typography-text type="secondary">
                  {{ item.description }}
                </a-typography-text>
              </template>
            </a-list-item-meta>
            <template #actions>
              <a-switch
                :checked="item.enabled"
                :loading="updatingKey === item.key"
                @change="(checked) => handleToggle(item.key, checked)"
              />
            </template>
          </a-list-item>
        </template>
      </a-list>

      <a-empty v-if="filteredFeatures.length === 0" description="No features found" />
    </a-space>
  </a-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FeatureFlag } from '@/services/api/settings'

interface Props {
  features: FeatureFlag[]
  loading?: boolean
}

interface Emits {
  (e: 'toggle', key: string, enabled: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const searchText = ref('')
const updatingKey = ref<string | null>(null)

const filteredFeatures = computed(() => {
  if (!searchText.value) {
    return props.features
  }

  const search = searchText.value.toLowerCase()
  return props.features.filter(
    (feature) =>
      feature.name.toLowerCase().includes(search) ||
      feature.description.toLowerCase().includes(search) ||
      feature.key.toLowerCase().includes(search) ||
      feature.module.toLowerCase().includes(search)
  )
})

async function handleToggle(key: string, enabled: boolean) {
  updatingKey.value = key
  try {
    emit('toggle', key, enabled)
  } finally {
    updatingKey.value = null
  }
}
</script>
