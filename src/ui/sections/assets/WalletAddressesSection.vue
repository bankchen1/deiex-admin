<template>
  <a-card :bordered="false" class="mb-6">
    <template #title>
      <a-space>
        <span>Wallet Addresses</span>
        <a-tag v-if="addresses.length > 0" color="blue"> {{ addresses.length }} addresses </a-tag>
      </a-space>
    </template>
    <template #extra>
      <a-space>
        <a-select
          :value="addressFilter.chain"
          placeholder="All Chains"
          style="width: 150px"
          size="small"
          allow-clear
          @change="handleChainChange"
        >
          <a-select-option value="">All Chains</a-select-option>
          <a-select-option v-for="chain in availableChains" :key="chain" :value="chain">
            {{ chain }}
          </a-select-option>
        </a-select>
        <a-select
          :value="addressFilter.type"
          placeholder="All Types"
          style="width: 120px"
          size="small"
          allow-clear
          @change="handleTypeChange"
        >
          <a-select-option value="">All Types</a-select-option>
          <a-select-option value="hot">Hot</a-select-option>
          <a-select-option value="cold">Cold</a-select-option>
        </a-select>
        <a-button size="small" @click="handleRefresh">
          <template #icon>
            <ReloadOutlined />
          </template>
          Refresh
        </a-button>
      </a-space>
    </template>
    <AddressTable :addresses="addresses" :loading="loading" @sync="handleSync" />
  </a-card>
</template>

<script setup lang="ts">
import { ReloadOutlined } from '@ant-design/icons-vue'
import AddressTable from '@/ui/widgets/assets/AddressTable.vue'
import type { WalletAddress } from '@/contracts/assets'
import type { PropType } from 'vue'

interface AddressFilter {
  chain: string
  type: string
}

const props = defineProps({
  addresses: {
    type: Array as PropType<WalletAddress[]>,
    required: true,
  },
  availableChains: {
    type: Array as PropType<string[]>,
    required: true,
  },
  addressFilter: {
    type: Object as PropType<AddressFilter>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['filter-change', 'refresh', 'sync'])

const handleChainChange = (value: string) => {
  emit('filter-change', { ...props.addressFilter, chain: value })
}

const handleTypeChange = (value: string) => {
  emit('filter-change', { ...props.addressFilter, type: value })
}

const handleRefresh = () => {
  emit('refresh')
}

const handleSync = (address: WalletAddress) => {
  emit('sync', address)
}
</script>
