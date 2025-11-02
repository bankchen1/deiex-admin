<template>
  <a-modal :open="open" title="View Changes" :width="1000" :footer="null" @cancel="handleClose">
    <a-spin :spinning="loading">
      <a-tabs v-model:active-key="activeTab">
        <!-- Trading Fees Changes -->
        <a-tab-pane key="trading" tab="Trading Fees">
          <a-collapse v-if="diffData?.tradingFees" :bordered="false">
            <a-collapse-panel
              v-if="diffData.tradingFees.added?.length > 0"
              key="added"
              header="Added"
            >
              <template #extra>
                <a-tag color="green">{{ diffData.tradingFees.added.length }}</a-tag>
              </template>
              <a-list :data-source="diffData.tradingFees.added" size="small">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta
                      :title="`VIP ${item.vipLevel}`"
                      :description="`Maker: ${formatRate(item.makerRate)}, Taker: ${formatRate(item.takerRate)}`"
                    />
                  </a-list-item>
                </template>
              </a-list>
            </a-collapse-panel>

            <a-collapse-panel
              v-if="diffData.tradingFees.modified?.length > 0"
              key="modified"
              header="Modified"
            >
              <template #extra>
                <a-tag color="orange">{{ diffData.tradingFees.modified.length }}</a-tag>
              </template>
              <a-list :data-source="diffData.tradingFees.modified" size="small">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta
                      :title="`VIP ${item.vipLevel}`"
                      :description="`Maker: ${formatRate(item.makerRate)}, Taker: ${formatRate(item.takerRate)}`"
                    />
                  </a-list-item>
                </template>
              </a-list>
            </a-collapse-panel>

            <a-collapse-panel
              v-if="diffData.tradingFees.deleted?.length > 0"
              key="deleted"
              header="Deleted"
            >
              <template #extra>
                <a-tag color="red">{{ diffData.tradingFees.deleted.length }}</a-tag>
              </template>
              <a-list :data-source="diffData.tradingFees.deleted" size="small">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta
                      :title="`VIP ${item.vipLevel}`"
                      :description="`Maker: ${formatRate(item.makerRate)}, Taker: ${formatRate(item.takerRate)}`"
                    />
                  </a-list-item>
                </template>
              </a-list>
            </a-collapse-panel>
          </a-collapse>
          <a-empty v-else description="No changes" />
        </a-tab-pane>

        <!-- Withdrawal Fees Changes -->
        <a-tab-pane key="withdrawal" tab="Withdrawal Fees">
          <a-collapse v-if="diffData?.withdrawalFees" :bordered="false">
            <a-collapse-panel
              v-if="diffData.withdrawalFees.added?.length > 0"
              key="added"
              header="Added"
            >
              <template #extra>
                <a-tag color="green">{{ diffData.withdrawalFees.added.length }}</a-tag>
              </template>
              <a-list :data-source="diffData.withdrawalFees.added" size="small">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta
                      :title="`${item.currency} (${item.chain})`"
                      :description="`Fixed: ${item.fixedFee}, Percentage: ${formatRate(item.percentageFee)}`"
                    />
                  </a-list-item>
                </template>
              </a-list>
            </a-collapse-panel>

            <a-collapse-panel
              v-if="diffData.withdrawalFees.modified?.length > 0"
              key="modified"
              header="Modified"
            >
              <template #extra>
                <a-tag color="orange">{{ diffData.withdrawalFees.modified.length }}</a-tag>
              </template>
              <a-list :data-source="diffData.withdrawalFees.modified" size="small">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta
                      :title="`${item.currency} (${item.chain})`"
                      :description="`Fixed: ${item.fixedFee}, Percentage: ${formatRate(item.percentageFee)}`"
                    />
                  </a-list-item>
                </template>
              </a-list>
            </a-collapse-panel>

            <a-collapse-panel
              v-if="diffData.withdrawalFees.deleted?.length > 0"
              key="deleted"
              header="Deleted"
            >
              <template #extra>
                <a-tag color="red">{{ diffData.withdrawalFees.deleted.length }}</a-tag>
              </template>
              <a-list :data-source="diffData.withdrawalFees.deleted" size="small">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta
                      :title="`${item.currency} (${item.chain})`"
                      :description="`Fixed: ${item.fixedFee}, Percentage: ${formatRate(item.percentageFee)}`"
                    />
                  </a-list-item>
                </template>
              </a-list>
            </a-collapse-panel>
          </a-collapse>
          <a-empty v-else description="No changes" />
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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

const activeTab = ref('trading')

function handleClose() {
  emit('update:open', false)
  emit('close')
}

function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(4)}%`
}
</script>
