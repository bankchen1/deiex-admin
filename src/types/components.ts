// Component Props Types

export interface TableColumn {
  key: string
  title: string
  dataIndex: string
  width?: number
  fixed?: 'left' | 'right'
  sortable?: boolean
  filterable?: boolean
  filterType?: 'input' | 'select' | 'date-range'
  filterOptions?: SelectOption[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (_value: any, _record: any, _index: number) => any
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface FormSchema {
  fields: FormField[]
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelWidth?: number
}

export interface FormField {
  name: string
  label: string
  type: 'input' | 'select' | 'number' | 'date' | 'switch' | 'textarea' | 'json' | 'icon-picker'
  placeholder?: string
  help?: string
  rules?: ValidationRule[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visible?: (_values: Record<string, any>) => boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disabled?: (_values: Record<string, any>) => boolean
  options?: SelectOption[] | (() => Promise<SelectOption[]>)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>
  // Support for async validation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asyncValidator?: (_value: any, _values: Record<string, any>) => Promise<void>
  // Fields that should trigger reloading of this field's options
  dependsOn?: string[]
}

export interface ValidationRule {
  required?: boolean
  message?: string
  pattern?: RegExp
  min?: number
  max?: number
  len?: number
  type?:
    | 'string'
    | 'number'
    | 'boolean'
    | 'method'
    | 'regexp'
    | 'integer'
    | 'float'
    | 'array'
    | 'object'
    | 'enum'
    | 'date'
    | 'url'
    | 'hex'
    | 'email'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validator?: (_rule: any, _value: any) => Promise<void>
  trigger?: 'change' | 'blur' | ['change', 'blur']
}

export interface PaginationConfig {
  current: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  pageSizeOptions?: string[]
}

// Version Control Types
export interface Version {
  id: string
  version: string
  createdAt: string
  createdBy: string
  notes: string
  tags: string[]
}

export interface VersionBarProps {
  currentVersion: string
  draftExists: boolean
  versions: Version[]
  impactEstimation?: string
}

export interface DiffViewerProps {
  oldValue: any
  newValue: any
  format?: 'json' | 'text' | 'table'
  highlightChanges?: boolean
}
