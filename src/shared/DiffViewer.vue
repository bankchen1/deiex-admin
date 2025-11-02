<template>
  <div class="diff-viewer">
    <!-- Format selector -->
    <div class="diff-header">
      <a-radio-group v-model:value="viewFormat" button-style="solid">
        <a-radio-button value="json">JSON</a-radio-button>
        <a-radio-button value="text">Text</a-radio-button>
        <a-radio-button value="table">Table</a-radio-button>
      </a-radio-group>

      <a-space>
        <a-switch
          v-model:checked="highlightChanges"
          checked-children="Highlight"
          un-checked-children="Plain"
        />
        <a-button size="small" @click="handleCopyDiff">
          <template #icon><CopyOutlined /></template>
          Copy
        </a-button>
      </a-space>
    </div>

    <!-- JSON view -->
    <div v-if="viewFormat === 'json'" class="diff-content">
      <div class="diff-columns">
        <div class="diff-column">
          <div class="column-header">Old Version</div>
          <pre class="json-content" :class="{ highlighted: highlightChanges }">{{
            formattedOldValue
          }}</pre>
        </div>
        <div class="diff-column">
          <div class="column-header">New Version</div>
          <pre class="json-content" :class="{ highlighted: highlightChanges }">{{
            formattedNewValue
          }}</pre>
        </div>
      </div>
    </div>

    <!-- Text view -->
    <div v-else-if="viewFormat === 'text'" class="diff-content">
      <div class="diff-columns">
        <div class="diff-column">
          <div class="column-header">Old Version</div>
          <div class="text-content">
            <div
              v-for="(line, index) in oldLines"
              :key="`old-${index}`"
              class="text-line"
              :class="getLineClass(line, 'old')"
            >
              <span class="line-number">{{ index + 1 }}</span>
              <span class="line-content">{{ line }}</span>
            </div>
          </div>
        </div>
        <div class="diff-column">
          <div class="column-header">New Version</div>
          <div class="text-content">
            <div
              v-for="(line, index) in newLines"
              :key="`new-${index}`"
              class="text-line"
              :class="getLineClass(line, 'new')"
            >
              <span class="line-number">{{ index + 1 }}</span>
              <span class="line-content">{{ line }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table view -->
    <div v-else-if="viewFormat === 'table'" class="diff-content">
      <a-table
        :columns="tableColumns"
        :data-source="tableDiffData"
        :pagination="false"
        size="small"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'field'">
            <strong>{{ record.field }}</strong>
          </template>
          <template v-else-if="column.key === 'oldValue'">
            <span :class="{ 'diff-removed': record.changed }">
              {{ formatValue(record.oldValue) }}
            </span>
          </template>
          <template v-else-if="column.key === 'newValue'">
            <span :class="{ 'diff-added': record.changed }">
              {{ formatValue(record.newValue) }}
            </span>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag v-if="record.changed" color="orange">Changed</a-tag>
            <a-tag v-else color="green">Unchanged</a-tag>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CopyOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface Props {
  oldValue: any
  newValue: any
  format?: 'json' | 'text' | 'table'
  highlightChanges?: boolean
}

interface TableDiffRow {
  field: string
  oldValue: any
  newValue: any
  changed: boolean
}

const props = withDefaults(defineProps<Props>(), {
  format: 'json',
  highlightChanges: true,
})

// State
const viewFormat = ref(props.format)
const highlightChanges = ref(props.highlightChanges)

// Formatted JSON values
const formattedOldValue = computed(() => {
  return JSON.stringify(props.oldValue, null, 2)
})

const formattedNewValue = computed(() => {
  return JSON.stringify(props.newValue, null, 2)
})

// Text lines for text view
const oldLines = computed(() => {
  if (typeof props.oldValue === 'string') {
    return props.oldValue.split('\n')
  }
  return formattedOldValue.value.split('\n')
})

const newLines = computed(() => {
  if (typeof props.newValue === 'string') {
    return props.newValue.split('\n')
  }
  return formattedNewValue.value.split('\n')
})

// Table columns
const tableColumns = [
  {
    title: 'Field',
    key: 'field',
    dataIndex: 'field',
    width: 200,
  },
  {
    title: 'Old Value',
    key: 'oldValue',
    dataIndex: 'oldValue',
    width: 300,
  },
  {
    title: 'New Value',
    key: 'newValue',
    dataIndex: 'newValue',
    width: 300,
  },
  {
    title: 'Status',
    key: 'status',
    width: 100,
  },
]

// Table diff data
const tableDiffData = computed<TableDiffRow[]>(() => {
  const rows: TableDiffRow[] = []

  // Get all unique keys from both objects
  const oldObj = props.oldValue || {}
  const newObj = props.newValue || {}
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)])

  allKeys.forEach((key) => {
    const oldVal = oldObj[key]
    const newVal = newObj[key]
    const changed = JSON.stringify(oldVal) !== JSON.stringify(newVal)

    rows.push({
      field: key,
      oldValue: oldVal,
      newValue: newVal,
      changed,
    })
  })

  return rows
})

// Get line class for highlighting
function getLineClass(line: string, side: 'old' | 'new'): string {
  if (!highlightChanges.value) return ''

  // Simple diff logic - check if line exists in the other side
  const otherLines = side === 'old' ? newLines.value : oldLines.value
  const exists = otherLines.includes(line)

  if (!exists) {
    return side === 'old' ? 'diff-removed' : 'diff-added'
  }

  return ''
}

// Format value for display
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return '-'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

// Handle copy diff
async function handleCopyDiff(): Promise<void> {
  try {
    let content = ''

    if (viewFormat.value === 'json') {
      content = `Old:\n${formattedOldValue.value}\n\nNew:\n${formattedNewValue.value}`
    } else if (viewFormat.value === 'text') {
      content = `Old:\n${oldLines.value.join('\n')}\n\nNew:\n${newLines.value.join('\n')}`
    } else {
      content = tableDiffData.value
        .map((row) => `${row.field}: ${formatValue(row.oldValue)} → ${formatValue(row.newValue)}`)
        .join('\n')
    }

    await navigator.clipboard.writeText(content)
    message.success('Diff copied to clipboard')
  } catch (error) {
    message.error('Failed to copy diff')
  }
}
</script>

<style scoped>
.diff-viewer {
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
}

.diff-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #d9d9d9;
}

.diff-content {
  background: #fff;
}

.diff-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: #d9d9d9;
}

.diff-column {
  background: #fff;
  overflow: auto;
}

.column-header {
  padding: 8px 12px;
  background: #f5f5f5;
  font-weight: 600;
  border-bottom: 1px solid #d9d9d9;
  position: sticky;
  top: 0;
  z-index: 1;
}

.json-content {
  padding: 12px;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 600px;
  overflow: auto;
}

.json-content.highlighted {
  background: #f9f9f9;
}

.text-content {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.6;
  max-height: 600px;
  overflow: auto;
}

.text-line {
  display: flex;
  padding: 2px 0;
}

.text-line:hover {
  background: #f5f5f5;
}

.line-number {
  display: inline-block;
  width: 40px;
  padding: 0 8px;
  text-align: right;
  color: #999;
  user-select: none;
  flex-shrink: 0;
}

.line-content {
  padding: 0 12px;
  flex: 1;
  white-space: pre-wrap;
  word-break: break-word;
}

.diff-removed {
  background: #ffebee;
  color: #c62828;
}

.diff-added {
  background: #e8f5e9;
  color: #2e7d32;
}

:deep(.ant-table) {
  font-size: 12px;
}

:deep(.ant-table-cell) {
  padding: 8px 12px;
}
</style>
