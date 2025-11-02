<template>
  <a-modal :open="open" title="View Changes" :footer="null" :width="900" @cancel="handleClose">
    <a-spin :spinning="loading">
      <a-space direction="vertical" style="width: 100%" :size="16">
        <!-- Changes Summary -->
        <a-card title="Changes Summary" size="small">
          <a-descriptions :column="2" size="small" bordered>
            <a-descriptions-item label="Funding Rules">
              <a-tag color="green">+{{ diffData?.funding?.added || 0 }}</a-tag>
              <a-tag color="orange">~{{ diffData?.funding?.modified || 0 }}</a-tag>
              <a-tag color="red">-{{ diffData?.funding?.deleted || 0 }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Maintenance">
              <a-tag color="green">+{{ diffData?.maintenance?.added || 0 }}</a-tag>
              <a-tag color="orange">~{{ diffData?.maintenance?.modified || 0 }}</a-tag>
              <a-tag color="red">-{{ diffData?.maintenance?.deleted || 0 }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Announcements">
              <a-tag color="green">+{{ diffData?.announcements?.added || 0 }}</a-tag>
              <a-tag color="orange">~{{ diffData?.announcements?.modified || 0 }}</a-tag>
              <a-tag color="red">-{{ diffData?.announcements?.deleted || 0 }}</a-tag>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- Detailed Changes -->
        <a-tabs v-if="diffData" default-active-key="funding">
          <a-tab-pane key="funding" tab="Funding Rules">
            <DiffViewer
              v-if="diffData.funding"
              :old-value="diffData.funding.old"
              :new-value="diffData.funding.new"
              format="json"
              :highlight-changes="true"
            />
            <a-empty v-else description="No changes" />
          </a-tab-pane>

          <a-tab-pane key="maintenance" tab="Maintenance">
            <DiffViewer
              v-if="diffData.maintenance"
              :old-value="diffData.maintenance.old"
              :new-value="diffData.maintenance.new"
              format="json"
              :highlight-changes="true"
            />
            <a-empty v-else description="No changes" />
          </a-tab-pane>

          <a-tab-pane key="announcements" tab="Announcements">
            <DiffViewer
              v-if="diffData.announcements"
              :old-value="diffData.announcements.old"
              :new-value="diffData.announcements.new"
              format="json"
              :highlight-changes="true"
            />
            <a-empty v-else description="No changes" />
          </a-tab-pane>
        </a-tabs>

        <a-empty v-if="!diffData" description="No changes to display" />
      </a-space>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import DiffViewer from '@/shared/DiffViewer.vue'

interface Props {
  open: boolean
  diffData?: any
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  diffData: null,
  loading: false,
})

const emit = defineEmits<Emits>()

function handleClose() {
  emit('update:open', false)
  emit('close')
}
</script>
