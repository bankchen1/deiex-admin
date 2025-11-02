# Implementation Plan

- [x] 1. Initialize project and setup development environment
  - Create Vue 3 + TypeScript + Vite project with strict mode enabled
  - Install and configure dependencies: Pinia, Vue Router, Ant Design Vue, Axios, ECharts, Day.js
  - Setup ESLint, Prettier, and Husky for code quality
  - Configure environment files (.env.development, .env.staging, .env.production)
  - Setup directory structure according to design (layouts, router, pages, sections, widgets, forms, tables, modals, shared, stores, services, utils, types)
  - Configure Vite with code splitting and bundle optimization
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Implement core infrastructure and shared utilities
  - [x] 2.1 Create AdminApiClient with interceptors
    - Implement request interceptor for auth token, request ID, and timestamp
    - Implement response interceptor for token refresh and error handling
    - Create error code mapping utility
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6_
  
  - [x] 2.2 Setup authentication store and guards
    - Create auth store with login, logout, refreshToken, and permission check methods
    - Implement RBAC route guard
    - Create permission utility functions (hasPermission, hasAnyPermission, hasAllPermissions)
    - _Requirements: 21.1, 21.2, 21.6_
  
  - [x] 2.3 Create app store for global state
    - Implement sidebar collapse, theme, locale, and cached views management
    - Create page tabs management (add, remove, clear)
    - _Requirements: 2.4_
  
  - [x] 2.4 Implement utility functions
    - Create validation utilities (email, phone, number range, etc.)
    - Create formatting utilities (currency, date, number, etc.)
    - Create download/upload utilities for CSV/JSON export/import
    - _Requirements: 20.6_

- [x] 3. Build shared component library
  - [x] 3.1 Create RBACGuard component
    - Implement permission-based rendering with all/any mode
    - Support fallback content for unauthorized access
    - _Requirements: 21.1, 21.2_
  
  - [x] 3.2 Create SchemaForm component
    - Implement dynamic form generation from JSON schema
    - Support field types: input, select, number, date, switch, textarea, json, icon-picker
    - Implement field visibility and disabled logic based on other field values
    - Support synchronous and asynchronous validation
    - Implement draft auto-save functionality
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_
  
  - [x] 3.3 Create ServerTable component
    - Implement server-side pagination, sorting, and filtering
    - Support column configuration with persistence to localStorage
    - Implement row selection (single and batch)
    - Add export functionality (CSV/JSON)
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.7_
  
  - [x] 3.4 Create version control components
    - Implement VersionBar component with publish, rollback, and view diff actions
    - Create DiffViewer component for side-by-side comparison (JSON, text, table formats)
    - _Requirements: 19.3, 19.4, 23.6_
  
  - [x] 3.5 Create UI utility components
    - Implement ConfirmButton with secondary confirmation for dangerous operations
    - Create EmptyState component for no-data scenarios
    - Create Skeleton component for loading states
    - Implement ErrorBoundary component for error catching
    - Create AuditTrail component for displaying history
    - _Requirements: 21.5, 24.2, 24.3, 24.4_
  
  - [x] 3.6 Create specialized input components
    - Implement IconPicker component with search and preview
    - Create ImageUploader component with validation
    - Create JsonEditor component with syntax highlighting
    - Implement TagPicker component for multi-select tags
    - Create SearchBar component for unified filtering
    - _Requirements: 1.5, 12.5_


- [x] 4. Implement layout and navigation system
  - [x] 4.1 Create AdminShell layout
    - Implement collapsible sidebar with menu tree
    - Create TopBar with environment badge, global search, language/theme switcher, and admin profile menu
    - Implement breadcrumb navigation
    - Add optional page tabs with keep-alive support
    - Integrate RBAC guard for menu filtering
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 4.2 Setup router configuration
    - Create router instance with history mode
    - Implement modular route files for each functional area
    - Setup route guards for authentication and permission checks
    - Configure route meta for titles, permissions, and keep-alive
    - _Requirements: 1.2, 21.1, 21.2_
  
  - [x] 4.3 Implement global notification system
    - Create toast notification service for success/error/warning messages
    - Integrate with API client for automatic error notifications
    - _Requirements: 24.7_

- [x] 5. Build Dashboard module
  - [x] 5.1 Create dashboard page and sections
    - Implement Stats section with KPI cards (registrations, active users, pending KYC, deposits/withdrawals, trading volume)
    - Create Charts section with time-series visualizations using ECharts
    - Build OpsQueue section showing pending tasks and alerts
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 5.2 Create dashboard widgets
    - Implement StatCard widget for displaying metrics
    - Create TimeSeries chart widget
    - Build TodoList widget for operations queue
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 5.3 Implement dashboard store and API
    - Create dashboard store with fetchStats, fetchCharts, fetchAlerts actions
    - Implement dashboard API service
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [x] 5.4 Create alert detail drawer
    - Implement AlertDetailDrawer modal for viewing alert details
    - _Requirements: 3.5_

- [x] 6. Build KYC module
  - [x] 6.1 Create KYC list page
    - Implement KYC list page with tabs (All, Pending, Approved, Rejected)
    - Create filter section with status, country, and time range filters
    - Build KPI cards section
    - Integrate KycTable component
    - _Requirements: 4.1, 4.2, 4.3, 4.7_
  
  - [x] 6.2 Create KycTable component
    - Implement table with columns: user ID, country, submission time, status, score, matched rules, actions
    - Add batch selection and batch operations
    - Integrate export functionality
    - _Requirements: 4.2, 4.4_
  
  - [x] 6.3 Create KYC review drawer
    - Implement ReviewDrawer with approve/reject actions
    - Add notes field and evidence upload
    - Create reason modal with templates
    - _Requirements: 4.5_
  
  - [x] 6.4 Create KYC detail page
    - Implement detail page with tabs (Overview, Documents, Risk, History)
    - Create sections for basic info, documents/OCR, risk hits, and audit history
    - Build ScoreGauge widget and AuditHistory timeline widget
    - _Requirements: 4.6_
  
  - [x] 6.5 Implement KYC store and API
    - Create KYC store with fetchList, fetchById, review, batchReview actions
    - Implement KYC API service with all endpoints
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_


- [x] 7. Build Users module
  - [x] 7.1 Create users list page
    - Implement users list page with filter section (status, VIP, tags)
    - Create KPI cards section
    - Integrate UserTable component
    - _Requirements: 5.1, 5.2_
  
  - [x] 7.2 Create UserTable component
    - Implement table with columns: ID, nickname, email/phone, KYC status, VIP level, risk tags, asset snapshot, actions
    - Add quick view action to open drawer
    - _Requirements: 5.2_
  
  - [x] 7.3 Create user quick view drawer
    - Implement QuickViewDrawer showing assets, recent logins, and devices
    - _Requirements: 5.3_
  
  - [x] 7.4 Create user detail page
    - Implement detail page with tabs (Overview, Assets, Orders, Security, Logs)
    - Create Overview section with basic info, login tracking map, and session info
    - Build Assets section with read-only asset view and chain addresses
    - Create Orders section with recent orders/positions table
    - Implement Security section with 2FA, risk tags, and VIP adjustment (with dual approval)
    - Build Logs section with audit trail
    - _Requirements: 5.4, 5.5, 5.6_
  
  - [x] 7.5 Create user management forms and modals
    - Implement VipUpdateForm with dual approval requirement
    - Create TagForm for managing risk tags
    - Build AdjustVipModal and Reset2FAModal
    - _Requirements: 5.6_
  
  - [x] 7.6 Implement users store and API
    - Create users store with fetchList, fetchById, updateVip, updateTags, reset2FA actions
    - Implement users API service
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 8. Build Assets module
  - [x] 8.1 Create deposits page
    - Implement deposits list page with DepositTable
    - Create filter section (time, currency, chain, status)
    - Build TxDetailDrawer for transaction details
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [x] 8.2 Create withdrawals page
    - Implement withdrawals list page with WithdrawalTable (including risk score and rule matches)
    - Create filter section
    - Build approval forms with multi-role signature support
    - Implement ApproveModal and RejectModal with reason templates
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [x] 8.3 Create wallets page (optional)
    - Implement wallets page with chain/hot/cold wallet address management
    - Create AddressTable and BalanceTable
    - Build ChainHealth status widget
    - Display balance monitoring and failed retry queue
    - _Requirements: 6.7_
  
  - [x] 8.4 Implement assets stores and API
    - Create deposits store with fetchList, fetchById actions
    - Create withdrawals store with fetchList, fetchById, approve, reject actions
    - Implement assets API services
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_


- [x] 9. Build Orders module
  - [x] 9.1 Create spot orders page
    - Implement spot orders page with SpotOrderTable
    - Create filter section (trading pair, time, status, direction)
    - Build OrderDetailDrawer
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [x] 9.2 Create futures orders page
    - Implement futures orders page with FuturesOrderTable (including leverage, margin mode, liquidation flag, funding rate impact)
    - Create filter section
    - Integrate OrderDetailDrawer
    - _Requirements: 7.2, 7.3_
  
  - [x] 9.3 Create positions page
    - Implement positions page with PositionTable (unrealized PnL, entry price, leverage, risk ratio, liquidation price)
    - Build LiquidationRadar widget for risk visualization
    - _Requirements: 7.4_
  
  - [x] 9.4 Create liquidations page
    - Implement liquidations page with liquidation records table
    - Create LiqTimeline widget for path reconstruction
    - _Requirements: 7.5_
  
  - [x] 9.5 Create copy-trading page (optional)
    - Implement copy-trading page with follow relationships table
    - Create forms for risk thresholds and profit sharing configuration
    - _Requirements: 7.6_
  
  - [x] 9.6 Implement orders store and API
    - Create orders store with fetchSpotOrders, fetchFuturesOrders, fetchPositions, fetchLiquidations actions
    - Implement orders API service
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 10. Build Config - Instruments module
  - [x] 10.1 Create instruments page
    - Implement instruments page with tabs (All, Spot, Futures, Hidden, Drafts)
    - Create filter and stats section
    - Integrate InstrumentTable with inline editing for rank and visibility
    - Add VersionBar component
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [x] 10.2 Create InstrumentTable component
    - Implement table with columns: symbol, displayName (i18n), base, quote, type, price precision, qty step, min order, visible, rank, region, tags
    - Support inline editing for rank and visibility
    - Add batch operations (show/hide, export)
    - _Requirements: 8.2, 8.4_
  
  - [x] 10.3 Create instrument form and modals
    - Implement InstrumentForm with sections: basic info, trading parameters, bindings, risk settings
    - Create EditInstrumentDrawer (right-side, 720px)
    - Build BulkImportModal with CSV/JSON support and field mapping
    - Implement PublishModal with version notes and impact estimation
    - _Requirements: 8.3, 8.5, 8.7_
  
  - [x] 10.4 Implement instruments store and API
    - Create instruments store with draft/publish/rollback workflow
    - Implement fetchPublished, fetchDrafts, createDraft, updateDraft, publish, rollback actions
    - Add export and import functionality
    - Create instruments API service
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7_


- [x] 11. Build Config - Margin module
  - [x] 11.1 Create margin page
    - Implement margin page with tabs (Templates, Bindings, Calculator, Drafts)
    - Create template list section with TemplateTable
    - Build template editing section
    - Create bindings section with BindingTable
    - Integrate MarginCalculator widget
    - Add VersionBar component
    - _Requirements: 9.1_
  
  - [x] 11.2 Create margin forms and modals
    - Implement TemplateForm with tier configuration (notional value range, initial margin %, maintenance margin %, max leverage, liquidation rules)
    - Create BindingForm for multi-select symbol binding
    - Build VersionModal and DiffModal
    - Implement BulkBindModal
    - _Requirements: 9.2, 9.3_
  
  - [x] 11.3 Create MarginCalculator widget
    - Implement calculator for estimating initial margin, maintenance margin, and liquidation price
    - Support input: notional value and leverage
    - _Requirements: 9.4_
  
  - [x] 11.4 Implement margin store and API
    - Create margin store with draft/publish/rollback workflow
    - Implement template and binding management actions
    - Add impact scanning for binding changes
    - Create margin API service
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7_

- [x] 12. Build Config - Fees module
  - [x] 12.1 Create fees page
    - Implement fees page with tabs (Trading Fees, Withdrawal Fees, Calculator, Drafts)
    - Create TradingFeeTable with VIP tiers and maker/taker rates
    - Build WithdrawFeeTable with currency, chain, fixed/percentage rates, minimum, and daily limits
    - Integrate FeeCalcWidget
    - Add VersionBar component
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [x] 12.2 Create fee forms and modals
    - Implement TradingTierForm and WithdrawFeeForm
    - Create NewTierModal, BulkImportModal, PublishModal
    - Build DiffModal for fee comparison
    - _Requirements: 10.2, 10.5_
  
  - [x] 12.3 Create FeeCalcWidget
    - Implement calculator for estimating fees based on trading volume, VIP level, and instrument
    - _Requirements: 10.4_
  
  - [x] 12.4 Implement fees store and API
    - Create fees store with draft/publish/rollback workflow
    - Implement trading and withdrawal fee management actions
    - Add consistency validation with frontend fees
    - Create fees API service
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7_


- [x] 13. Build Config - Calendar module (OPTIONAL)
  - [x] 13.1 Create calendar page
    - Implement calendar page with tabs (Funding, Maintenance, Events/Announcements, Drafts)
    - Create FundingScheduleTable with next funding time, period, and calculation rules
    - Build MaintenanceTable with time windows, affected scope, and announcement push
    - Implement AnnouncementTable with multi-language support, pinning, and push channels
    - Add VersionBar component
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [x] 13.2 Create calendar widgets
    - Implement Countdown widget for upcoming events
    - Create MonthView calendar widget
    - _Requirements: 11.5_
  
  - [x] 13.3 Create calendar forms and modals
    - Implement FundingRuleForm, MaintenanceForm, AnnouncementForm
    - Build publish/rollback/diff modals
    - _Requirements: 11.2, 11.3, 11.4_
  
  - [x] 13.4 Implement calendar store and API
    - Create calendar store with draft/publish/rollback workflow
    - Implement funding, maintenance, and announcement management actions
    - Add time conflict validation
    - Create calendar API service
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7_

- [x] 14. Build Config - Icons module (OPTIONAL)
  - [x] 14.1 Create icons page
    - Implement icons page with tabs (Asset Library, Symbol Mapping, Bulk Upload)
    - Create IconAssetTable for managing SVG/PNG assets with light/dark versions
    - Build IconMappingTable for symbol-to-icon mapping
    - Implement bulk upload section with validation
    - _Requirements: 12.1, 12.2, 12.3_
  
  - [x] 14.2 Create icon modals
    - Implement PreviewModal for icon preview
    - Create ReplaceModal for icon replacement
    - _Requirements: 12.6_
  
  - [x] 14.3 Create icon forms
    - Implement IconAssetForm, IconMappingForm, BulkUploadForm
    - Add automatic naming, size validation, and transparency checking
    - _Requirements: 12.3, 12.4_
  
  - [x] 14.4 Implement icons store and API
    - Create icons store with asset and mapping management actions
    - Implement upload, preview, and replace functionality
    - Add format and dimension validation
    - Create icons API service
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [x] 15. Build Config - Mappings module (OPTIONAL)
  - [x] 15.1 Create mappings page
    - Implement mappings page with tabs (Nav→API, Route Migration, Page→API)
    - Create NavToApiTable with NavApiForm
    - Build RedirectGraph widget and RedirectTable for route migration
    - Implement PageApiMatrix for page-to-API relationships
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [x] 15.2 Create mapping modals
    - Implement EditMappingModal
    - Create BulkSyncModal
    - _Requirements: 13.1_
  
  - [x] 15.3 Implement mappings store and API
    - Create mappings store with nav-to-API, route migration, and page-to-API management
    - Add validation for broken or redundant links
    - Create mappings API service
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 22.7_


- [x] 16. Build Config - Security module (OPTIONAL)
  - [x] 16.1 Create security page
    - Implement security page with tabs (RBAC, Admin Users, IP Whitelist, API Keys, Audit Logs)
    - Create PermissionTree widget for managing roles and permissions
    - Build RolesTable for role management
    - Implement AdminUsersTable with status management
    - Create ApiKeysTable with signature permissions
    - Build AuditLogsTable with search by object, admin user, and time
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 16.2 Create security forms and modals
    - Implement RoleForm, AdminUserForm, SecurityRuleForm, ApiKeyForm
    - Create AssignPermModal for permission assignment
    - Build DisableAdminModal with confirmation
    - _Requirements: 14.6, 14.7_
  
  - [x] 16.3 Implement security store and API
    - Create security store with RBAC, admin users, IP whitelist, API keys, and audit logs management
    - Implement role-permission binding actions
    - Create security API service
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8_

- [x] 17. Build Risk module (OPTIONAL)
  - [x] 17.1 Create risk rules page
    - Implement risk rules page with RiskRuleTable (rule name, trigger conditions, actions, priority, status)
    - Create RiskRuleForm with condition builder
    - Build RuleSimulator widget for testing rules
    - Add VersionBar component
    - _Requirements: 15.1, 15.2, 15.6_
  
  - [x] 17.2 Create risk limits page
    - Implement limits page with tables for user, country, device, and currency limits
    - Create LimitForm with scope, effective period, and threshold configuration
    - _Requirements: 15.3, 15.4_
  
  - [x] 17.3 Create blacklist page
    - Implement blacklist page with tables for addresses, devices, IPs, and countries
    - Create BlacklistForm
    - Build BulkImportModal for batch blacklist entries
    - _Requirements: 15.4, 15.5_
  
  - [x] 17.4 Implement risk store and API
    - Create risk store with draft/publish/rollback workflow for rules
    - Implement rules, limits, and blacklist management actions
    - Create risk API service
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7_

- [x] 18. Build Ops module (OPTIONAL)
  - [x] 18.1 Create logs page
    - Implement logs page with tabs (System, Audit, Errors)
    - Create SystemLogTable, AuditLogTable, ErrorLogTable
    - Build filter section (log level, source, request ID, API endpoint, account)
    - Implement LogDetailDrawer with request/response snippets and diff links
    - _Requirements: 16.1, 16.2, 16.3_
  
  - [x] 18.2 Create tasks page
    - Implement tasks page with TaskTable and RetryQueueTable
    - Create TaskScheduleForm
    - Build RunNowModal and DisableTaskModal
    - _Requirements: 16.4, 16.5, 16.6_
  
  - [x] 18.3 Implement ops store and API
    - Create logs store with fetchLogs action and filtering
    - Create tasks store with task management and retry queue actions
    - Implement ops API service
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7_


- [x] 19. Build Reports module (OPTIONAL)
  - [x] 19.1 Create trade reports page
    - Implement trade reports page with trend charts, top trading pairs, and maker/taker composition
    - Create TradeDailyTable and SymbolVolumeTable
    - Build dimension selection form (time, market, region)
    - _Requirements: 17.1, 17.2, 17.3_
  
  - [x] 19.2 Create finance reports page
    - Implement finance reports page showing deposit/withdrawal net inflows, fee income, and funding rate settlements
    - Create FinanceDailyTable and FeeIncomeTable
    - Build StackedBar and KPI widgets
    - _Requirements: 17.4, 17.5_
  
  - [x] 19.3 Create retention reports page
    - Implement retention page with DAU/WAU, retention funnel, and conversion metrics
    - Create RetentionTable and FunnelTable
    - Build FunnelChart and CohortChart widgets
    - _Requirements: 17.6, 17.7_
  
  - [x] 19.4 Implement reports store and API
    - Create reports store with fetchTradeReports, fetchFinanceReports, fetchRetentionReports actions
    - Implement reports API service
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_

- [x] 20. Build Settings module (OPTIONAL)
  - [x] 20.1 Create general settings page
    - Implement general settings page with site name, logo, operation mode, and cache refresh
    - Create GeneralSettingForm
    - Build CacheStatus widget
    - _Requirements: 18.1_
  
  - [x] 20.2 Create theme settings page
    - Implement theme page with ThemeForm (theme colors, light/dark mode, login page text, copyright)
    - Create ThemePreview widget
    - _Requirements: 18.2, 18.6_
  
  - [x] 20.3 Create i18n settings page
    - Implement i18n page with I18nKeyTable
    - Create I18nEntryForm for editing translations
    - Build BulkI18nImportModal for batch import
    - Add missing key scanning functionality
    - _Requirements: 18.3, 18.4_
  
  - [x] 20.4 Create cache and switches page
    - Implement cache page with one-click cache refresh
    - Create FeatureToggle widget for feature flags
    - Build CacheControls component
    - _Requirements: 18.5_
  
  - [x] 20.5 Implement settings store and API
    - Create settings store with general, theme, i18n, and cache management actions
    - Implement settings API service
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7_

- [x] 21. Implement internationalization (i18n)
  - [x] 21.1 Install and configure vue-i18n
    - Install vue-i18n package
    - Create i18n configuration file with English and Chinese locales
    - Setup message structure for common terms and all modules
    - Integrate i18n with main.ts
    - _Requirements: 18.3_
  
  - [x] 21.2 Create locale switching functionality
    - Implement useLocale composable for language switching
    - Update Ant Design Vue locale on language change
    - Update dayjs locale on language change
    - Persist locale preference to localStorage
    - _Requirements: 18.3_
  
  - [x] 21.3 Add i18n to existing components
    - Replace hardcoded strings in navigation and layout components
    - Update all page titles and labels to use i18n
    - Add translations for form labels and validation messages
    - Update table column headers and action buttons
    - _Requirements: 18.3_

- [x] 22. Enhance security features
  - [x] 22.1 Implement token refresh mechanism
    - Add token expiration checking in AdminApiClient
    - Implement automatic token refresh before expiration
    - Handle refresh token failure with redirect to login
    - _Requirements: 21.1, 21.2_
  
  - [x] 22.2 Add session timeout
    - Implement activity tracking for user interactions
    - Create auto logout after 30 minutes of inactivity
    - Show warning modal before auto logout
    - _Requirements: 21.5_
  
  - [x] 22.3 Add sensitive data masking
    - Create utility functions for masking emails and phone numbers
    - Apply masking to user tables and detail views
    - Add toggle to reveal full data for authorized users
    - _Requirements: 21.4_

- [x] 23. Optimize performance and bundle
  - [x] 23.1 Configure Vite build optimization
    - Setup manual chunk splitting for vendors
    - Configure code splitting for routes and heavy components
    - Set appropriate chunk size warning limits
    - Enable compression in build output
    - _Requirements: 1.1, 1.4_
  
  - [x] 23.2 Implement lazy loading
    - Add lazy loading for chart components (ECharts)
    - Implement lazy loading for heavy modals and drawers
    - Add virtual scrolling for large tables (>1000 rows)
    - _Requirements: 24.1_
  
  - [x] 23.3 Add caching strategies
    - Implement API response caching with TTL for GET requests
    - Add localStorage persistence for table configurations
    - Optimize keep-alive for frequently visited pages
    - _Requirements: 24.1_

- [ ] 24. Improve accessibility and responsive design
  - [ ] 24.1 Add ARIA labels and roles
    - Add ARIA labels to all interactive elements
    - Implement proper heading hierarchy
    - Add role attributes for custom components
    - Ensure screen reader compatibility
    - _Requirements: 24.5, 24.6_
  
  - [ ] 24.2 Implement keyboard navigation
    - Add keyboard shortcuts for common actions
    - Ensure tab order is logical throughout the app
    - Add focus indicators for all interactive elements
    - Implement escape key handling for modals
    - _Requirements: 24.5_
  
  - [ ] 24.3 Enhance responsive layouts
    - Test and adjust layouts for 1280px to 2560px widths
    - Ensure tables are responsive with horizontal scrolling
    - Optimize sidebar behavior on smaller screens
    - Test all modals and drawers on different screen sizes
    - _Requirements: 24.1_

- [ ] 25. Setup deployment configuration
  - [ ] 25.1 Create Docker configuration
    - Write Dockerfile with multi-stage build
    - Create docker-compose.yml for local development
    - Add nginx configuration for production serving
    - Configure environment variable handling
    - _Requirements: 1.4_
  
  - [ ] 25.2 Setup CI/CD pipeline
    - Create GitHub Actions workflow for build and test
    - Add linting and type checking to CI pipeline
    - Configure automated deployment to staging and production
    - Setup CDN upload and cache invalidation
    - _Requirements: 1.4_
  
  - [ ] 25.3 Document deployment procedures
    - Write deployment guide with step-by-step instructions
    - Document environment variable configuration
    - Add rollback procedures
    - Create troubleshooting guide
    - _Requirements: 1.4_


- [ ]* 26. Add testing infrastructure (OPTIONAL)
  - [ ]* 26.1 Setup Vitest for unit testing
    - Install Vitest and testing utilities
    - Configure vitest.config.ts
    - Create test utilities and fixtures
    - Setup coverage reporting
    - _Requirements: 1.1_
  
  - [ ]* 26.2 Write unit tests
    - Write tests for utility functions (validation, format, date, number)
    - Write tests for composables (usePermission, useNotification)
    - Write tests for store actions and getters
    - Achieve 80% coverage for utilities
    - _Requirements: 1.1_
  
  - [ ]* 26.3 Write component tests
    - Write tests for shared components (RBACGuard, SchemaForm, ServerTable)
    - Test form validation logic
    - Test permission-based rendering
    - Achieve 70% coverage for shared components
    - _Requirements: 1.1_
  
  - [ ]* 26.4 Setup E2E testing
    - Install and configure Playwright
    - Create E2E test utilities and page objects
    - Write E2E tests for critical flows (login, KYC review, config publish, withdrawal approval)
    - Configure E2E tests in CI pipeline
    - _Requirements: 1.1_
