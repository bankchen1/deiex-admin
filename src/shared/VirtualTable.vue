<template>
  <div ref="containerRef" class="virtual-table-container" @scroll="handleScroll">
    <div class="virtual-table-spacer" :style="{ height: `${totalHeight}px` }">
      <div class="virtual-table-content" :style="{ transform: `translateY(${offsetY}px)` }">
        <a-table
          :columns="columns"
          :data-source="visibleData"
          :pagination="false"
          :loading="loading"
          :row-key="rowKey"
          :scroll="scroll"
          v-bind="$attrs"
        >
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { TableProps } from 'ant-design-vue'

interface VirtualTableProps {
  columns: TableProps['columns']
  dataSource: any[]
  rowHeight?: number
  overscan?: number
  loading?: boolean
  rowKey?: string | ((record: any) => string)
  scroll?: TableProps['scroll']
}

const props = withDefaults(defineProps<VirtualTableProps>(), {
  rowHeight: 54, // Default row height in pixels
  overscan: 5, // Number of extra rows to render above and below viewport
  loading: false,
  rowKey: 'id',
})

const containerRef = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const containerHeight = ref(0)

// Calculate total height of all rows
const totalHeight = computed(() => {
  return props.dataSource.length * props.rowHeight
})

// Calculate visible range
const visibleRange = computed(() => {
  const start = Math.floor(scrollTop.value / props.rowHeight)
  const visibleCount = Math.ceil(containerHeight.value / props.rowHeight)

  // Add overscan
  const startIndex = Math.max(0, start - props.overscan)
  const endIndex = Math.min(props.dataSource.length, start + visibleCount + props.overscan)

  return { startIndex, endIndex }
})

// Get visible data slice
const visibleData = computed(() => {
  const { startIndex, endIndex } = visibleRange.value
  return props.dataSource.slice(startIndex, endIndex)
})

// Calculate offset for positioning
const offsetY = computed(() => {
  return visibleRange.value.startIndex * props.rowHeight
})

// Handle scroll event
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  scrollTop.value = target.scrollTop
}

// Update container height
const updateContainerHeight = () => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight
  }
}

// Handle window resize
const handleResize = () => {
  updateContainerHeight()
}

onMounted(() => {
  updateContainerHeight()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Watch for data changes
watch(
  () => props.dataSource,
  () => {
    scrollTop.value = 0
    if (containerRef.value) {
      containerRef.value.scrollTop = 0
    }
  }
)
</script>

<style scoped>
.virtual-table-container {
  height: 100%;
  overflow-y: auto;
  position: relative;
}

.virtual-table-spacer {
  position: relative;
  width: 100%;
}

.virtual-table-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  will-change: transform;
}
</style>
