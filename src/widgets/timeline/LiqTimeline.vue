<template>
  <a-card title="Liquidation Path Reconstruction" :bordered="false">
    <a-timeline mode="left">
      <a-timeline-item
        v-for="(event, index) in timeline"
        :key="index"
        :color="getEventColor(event, index)"
      >
        <template #dot>
          <component :is="getEventIcon(event, index)" />
        </template>
        <div class="timeline-item">
          <div class="timeline-header">
            <strong>{{ event.event }}</strong>
            <span class="timeline-time">{{ formatDate(event.timestamp) }}</span>
          </div>
          <div class="timeline-content">
            <a-descriptions :column="1" size="small" bordered>
              <a-descriptions-item label="Mark Price">
                {{ formatNumber(event.markPrice, 8) }}
              </a-descriptions-item>
              <a-descriptions-item label="Risk Ratio">
                <a-progress
                  :percent="event.riskRatio * 100"
                  :status="event.riskRatio >= 0.8 ? 'exception' : 'normal'"
                  :stroke-color="
                    event.riskRatio >= 0.8
                      ? '#ff4d4f'
                      : event.riskRatio >= 0.6
                        ? '#faad14'
                        : '#52c41a'
                  "
                  size="small"
                />
              </a-descriptions-item>
            </a-descriptions>
            <div class="timeline-description">{{ event.description }}</div>
          </div>
        </div>
      </a-timeline-item>
    </a-timeline>
  </a-card>
</template>

<script setup lang="ts">
import { h } from 'vue'
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons-vue'
import type { LiquidationEvent } from '@/services/api/orders'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/format'

interface Props {
  timeline: LiquidationEvent[]
}

defineProps<Props>()

function getEventColor(event: LiquidationEvent, index: number): string {
  // Last event (liquidation) is always red
  if (index === 0) {
    return 'red'
  }

  // Color based on risk ratio
  if (event.riskRatio >= 0.8) {
    return 'red'
  } else if (event.riskRatio >= 0.6) {
    return 'orange'
  } else if (event.riskRatio >= 0.4) {
    return 'yellow'
  } else {
    return 'green'
  }
}

function getEventIcon(event: LiquidationEvent, index: number) {
  // Last event (liquidation) gets close icon
  if (index === 0) {
    return h(CloseCircleOutlined, { style: { fontSize: '16px' } })
  }

  // Icon based on risk ratio
  if (event.riskRatio >= 0.8) {
    return h(WarningOutlined, { style: { fontSize: '16px' } })
  } else if (event.riskRatio >= 0.6) {
    return h(InfoCircleOutlined, { style: { fontSize: '16px' } })
  } else {
    return h(CheckCircleOutlined, { style: { fontSize: '16px' } })
  }
}
</script>

<style scoped>
.timeline-item {
  padding-bottom: 16px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.timeline-time {
  color: #999;
  font-size: 12px;
}

.timeline-content {
  margin-top: 8px;
}

.timeline-description {
  margin-top: 8px;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
}
</style>
