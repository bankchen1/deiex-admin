// src/shared/__tests__/ServerTable.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ServerTable from '../ServerTable.vue'

describe('ServerTable', () => {
  const mockColumns = [
    { key: 'id', title: 'ID', dataIndex: 'id' },
    { key: 'name', title: 'Name', dataIndex: 'name' },
  ]

  const mockData = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ]

  it('renders correctly with data', () => {
    const wrapper = mount(ServerTable, {
      props: {
        columns: mockColumns,
        dataSource: mockData,
        loading: false,
      },
    })

    // Check if table is rendered
    expect(wrapper.find('.server-table').exists()).toBe(true)

    // Check if data is rendered
    expect(wrapper.text()).toContain('Item 1')
    expect(wrapper.text()).toContain('Item 2')
  })

  it('shows loading state when loading is true', () => {
    const wrapper = mount(ServerTable, {
      props: {
        columns: mockColumns,
        dataSource: mockData,
        loading: true,
      },
    })

    // Check if ant-spin is present when loading
    expect(wrapper.find('.ant-spin').exists()).toBe(true)
  })

  it('handles column configuration when enabled', async () => {
    const wrapper = mount(ServerTable, {
      props: {
        columns: mockColumns,
        dataSource: mockData,
        enableColumnConfig: true,
      },
    })

    // Check if column config button exists
    const columnConfigButton = wrapper.find('.table-toolbar .ant-btn').text()
    expect(columnConfigButton).toContain('Columns')
  })

  it('handles export functionality when enabled', async () => {
    const wrapper = mount(ServerTable, {
      props: {
        columns: mockColumns,
        dataSource: mockData,
        enableExport: true,
      },
    })

    // Check if export button exists
    const exportButton = wrapper.find('.table-toolbar .ant-btn:last-child').text()
    expect(exportButton).toContain('Export')
  })
})
