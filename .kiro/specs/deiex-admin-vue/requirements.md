# Requirements Document

## Introduction

DEIEX Admin (admin-vue) is a comprehensive cryptocurrency exchange administration system. The system provides a unified interface for managing KYC processes, user accounts, asset operations (deposits/withdrawals), trading orders (spot/futures), platform configurations, risk management, operations monitoring, reporting, and system settings. The platform emphasizes role-based access control (RBAC), version control for configurations with draft/publish/rollback capabilities, and audit trails for all critical operations.

## Glossary

- **Admin_System**: The DEIEX Admin Vue-based frontend application
- **RBAC_Module**: Role-Based Access Control system managing permissions
- **Config_Center**: Configuration management module with versioning capabilities
- **KYC_Module**: Know Your Customer verification and review system
- **Asset_Module**: Deposit, withdrawal, and wallet management system
- **Order_Module**: Trading order management for spot and futures markets
- **Risk_Module**: Risk management and control system
- **Ops_Module**: Operations monitoring and task management system
- **Report_Module**: Analytics and reporting system
- **Admin_User**: Authenticated administrator using the system
- **End_User**: Platform user being managed by administrators
- **Draft_State**: Unpublished configuration changes
- **Published_State**: Active configuration in production
- **Audit_Trail**: Historical record of all system changes
- **Version_Control**: System for managing configuration versions
- **Diff_Viewer**: Component showing differences between versions


## Requirements

### Requirement 1

**User Story:** As a project administrator, I want to initialize the admin-vue framework with proper technology stack and directory structure, so that the development team has a solid foundation for building the admin system.

#### Acceptance Criteria

1. THE Admin_System SHALL be built using Vue 3, TypeScript, Vite, Pinia, Vue Router, Ant Design Vue, and Axios
2. THE Admin_System SHALL implement a directory structure with separate layers for layouts, router, pages, sections, widgets, forms, tables, modals, stores, services, and utilities
3. THE Admin_System SHALL organize router configurations into separate module files for each functional area
4. THE Admin_System SHALL provide shared components including RBACGuard, SchemaForm, IconPicker, VersionBar, and DiffModal
5. THE Admin_System SHALL support global interactions for draft/publish/rollback, unified filtering, unified table containers, and unified import/export

### Requirement 2

**User Story:** As an administrator, I want a consistent navigation structure with sidebar, top bar, breadcrumbs, and tabs, so that I can efficiently navigate through different modules.

#### Acceptance Criteria

1. THE Admin_System SHALL display a two-level sidebar navigation with all major modules (Dashboard, KYC, Users, Assets, Orders, Config, Risk, Ops, Reports, Settings)
2. THE Admin_System SHALL show a top bar containing environment label, global search, language/theme switcher, and admin profile menu
3. THE Admin_System SHALL display breadcrumbs showing the current navigation path
4. THE Admin_System SHALL support optional page tabs with a maximum of 8 tabs and overflow scrolling
5. WHEN an Admin_User lacks required permissions, THE Admin_System SHALL display an EmptyState component


### Requirement 3

**User Story:** As an administrator, I want a dashboard overview page, so that I can quickly see key metrics and pending tasks.

#### Acceptance Criteria

1. THE Admin_System SHALL display overview statistics including registrations, active users, pending KYC, deposits/withdrawals, and trading volume
2. THE Admin_System SHALL show time-series charts for trading volume, funding rates, and net inflows
3. THE Admin_System SHALL display an operations queue showing pending KYC reviews, withdrawals, abnormal orders, and risk alerts
4. THE Admin_System SHALL default to a 7-day time range with support for custom date range selection
5. WHEN an Admin_User clicks on an alert, THE Admin_System SHALL open a detail drawer

### Requirement 4

**User Story:** As a compliance officer, I want to review and manage KYC applications, so that I can verify user identities and maintain regulatory compliance.

#### Acceptance Criteria

1. THE Admin_System SHALL display a KYC list with tabs for All, Pending, Approved, and Rejected applications
2. THE Admin_System SHALL show KYC table columns including user ID, country, submission time, status, score, matched rules, and actions
3. THE Admin_System SHALL provide filtering by status, country, and time range
4. THE Admin_System SHALL support batch export and batch review operations
5. WHEN an Admin_User reviews a KYC application, THE Admin_System SHALL open a review drawer with approve/reject options, notes field, and evidence upload
6. THE Admin_System SHALL display KYC detail pages showing basic information, documents/OCR results, risk hits, and audit history
7. THE Admin_System SHALL preserve scroll position when switching between status tabs


### Requirement 5

**User Story:** As a customer support administrator, I want to view and manage user accounts, so that I can assist users and monitor account activities.

#### Acceptance Criteria

1. THE Admin_System SHALL display a users list with filtering by status, VIP level, and tags
2. THE Admin_System SHALL show user table columns including ID, nickname, email/phone, KYC status, VIP level, risk tags, asset snapshot, and actions
3. THE Admin_System SHALL provide a quick view drawer showing assets, recent logins, and devices
4. THE Admin_System SHALL display user detail pages with tabs for Overview, Assets, Orders, Security, and Logs
5. THE Admin_System SHALL show login tracking with map visualization and device information
6. WHEN an Admin_User adjusts VIP level or security settings, THE Admin_System SHALL require dual approval
7. THE Admin_System SHALL record all user management actions in the audit trail

### Requirement 6

**User Story:** As a finance administrator, I want to monitor and manage deposits and withdrawals, so that I can ensure proper fund flows and detect anomalies.

#### Acceptance Criteria

1. THE Admin_System SHALL display a deposits table showing user, currency, chain, transaction hash, amount, status, and risk flags
2. THE Admin_System SHALL display a withdrawals table with risk scores and rule matches
3. THE Admin_System SHALL provide filtering by time, currency, chain, and status
4. THE Admin_System SHALL support multi-role approval workflow for withdrawals
5. WHEN an Admin_User reviews a withdrawal, THE Admin_System SHALL display a transaction detail drawer
6. THE Admin_System SHALL provide approve and reject modals with reason templates
7. WHERE wallet management is enabled, THE Admin_System SHALL display chain/hot/cold wallet addresses, balance monitoring, and retry queues


### Requirement 7

**User Story:** As a trading operations administrator, I want to monitor spot and futures orders, so that I can track trading activities and identify issues.

#### Acceptance Criteria

1. THE Admin_System SHALL display spot orders table with order ID, user, trading pair, direction, quantity, price, status, error code, and matching latency
2. THE Admin_System SHALL display futures orders table with additional columns for leverage, margin mode, liquidation flag, and funding rate impact
3. THE Admin_System SHALL display positions table showing unrealized PnL, average entry price, leverage, risk ratio, and liquidation price
4. THE Admin_System SHALL display liquidations table with liquidation records and path reconstruction
5. THE Admin_System SHALL provide filtering by trading pair, time, status, and direction
6. WHEN an Admin_User clicks on an order, THE Admin_System SHALL open an order detail drawer
7. WHERE copy-trading is supported, THE Admin_System SHALL display follow relationships, risk thresholds, and profit sharing

### Requirement 8

**User Story:** As a platform administrator, I want to manage instrument configurations with version control, so that I can safely update trading pair settings.

#### Acceptance Criteria

1. THE Admin_System SHALL display instruments table with tabs for All, Spot, Futures, Hidden, and Drafts
2. THE Admin_System SHALL show instrument columns including symbol, display name (i18n), base, quote, type, price precision, quantity step, minimum order, visibility, rank, region, and tags
3. THE Admin_System SHALL provide an instrument form with sections for basic info, trading parameters, bindings, and risk settings
4. THE Admin_System SHALL support inline editing for rank and visibility in the table
5. THE Admin_System SHALL support bulk import via CSV/JSON with field mapping and pre-validation
6. WHEN an Admin_User publishes changes, THE Admin_System SHALL display a diff viewer for review
7. WHEN an Admin_User publishes changes, THE Admin_System SHALL require version notes and show impact estimation
8. THE Admin_System SHALL trigger frontend cache refresh after publishing


### Requirement 9

**User Story:** As a risk administrator, I want to configure tiered margin requirements, so that I can manage leverage and liquidation risks.

#### Acceptance Criteria

1. THE Admin_System SHALL display margin configuration with tabs for Templates, Bindings, Calculator, and Drafts
2. THE Admin_System SHALL provide a template form for configuring notional value ranges with initial margin %, maintenance margin %, max leverage, and liquidation rules
3. THE Admin_System SHALL support binding multiple symbols to margin templates
4. THE Admin_System SHALL provide a calculator widget for estimating initial margin, maintenance margin, and liquidation price based on notional value and leverage
5. WHEN an Admin_User changes bindings, THE Admin_System SHALL show affected symbols
6. THE Admin_System SHALL support version control with draft/publish/rollback for margin templates
7. THE Admin_System SHALL validate margin configurations before publishing

### Requirement 10

**User Story:** As a finance administrator, I want to configure trading and withdrawal fees, so that I can manage platform revenue and user costs.

#### Acceptance Criteria

1. THE Admin_System SHALL display fee configuration with tabs for Trading Fees, Withdrawal Fees, Calculator, and Drafts
2. THE Admin_System SHALL show trading fee tiers by VIP level with maker/taker rates and inheritance settings
3. THE Admin_System SHALL show withdrawal fees by currency and chain with fixed/percentage rates, minimum amounts, and daily limits
4. THE Admin_System SHALL provide a fee calculator widget for estimating fees based on trading volume, VIP level, and instrument
5. THE Admin_System SHALL support bulk import/export for fee configurations
6. THE Admin_System SHALL support draft/publish/rollback workflow for fee changes
7. THE Admin_System SHALL validate consistency between admin fees and frontend displayed fees


### Requirement 11

**User Story:** As a platform administrator, I want to manage funding rates, maintenance windows, and announcements, so that I can communicate important events to users.

#### Acceptance Criteria

1. THE Admin_System SHALL display calendar configuration with tabs for Funding, Maintenance, Events/Announcements, and Drafts
2. THE Admin_System SHALL show funding rate schedules with next funding time, period, and calculation rules
3. THE Admin_System SHALL show maintenance windows with time range, affected scope, and announcement push settings
4. THE Admin_System SHALL show events/announcements with multi-language support, pinning, and push channels
5. THE Admin_System SHALL provide countdown widgets for upcoming events
6. THE Admin_System SHALL support draft/publish/rollback for calendar items
7. THE Admin_System SHALL validate time conflicts before publishing

### Requirement 12

**User Story:** As a UI administrator, I want to manage asset and symbol icons, so that I can maintain consistent branding across the platform.

#### Acceptance Criteria

1. THE Admin_System SHALL display icon management with tabs for Asset Library, Symbol Mapping, and Bulk Upload
2. THE Admin_System SHALL store icons in SVG/PNG format with light/dark versions and CDN paths
3. THE Admin_System SHALL provide symbol-to-icon mapping functionality
4. THE Admin_System SHALL support bulk upload with automatic naming, size validation, and transparency checking
5. THE Admin_System SHALL provide an icon picker component for selecting icons
6. THE Admin_System SHALL provide preview and replace modals for icon management
7. THE Admin_System SHALL validate icon formats and dimensions before upload


### Requirement 13

**User Story:** As a system administrator, I want to manage navigation-to-API mappings, route migrations, and page-to-API relationships, so that I can ensure system consistency.

#### Acceptance Criteria

1. THE Admin_System SHALL display mappings configuration with tabs for Nav→API, Route Migration, and Page→API
2. THE Admin_System SHALL provide a table for managing navigation-to-API mappings
3. THE Admin_System SHALL display a redirect graph and table for route migration management
4. THE Admin_System SHALL show a page-to-API matrix for viewing relationships
5. WHEN an Admin_User saves mappings, THE Admin_System SHALL validate for broken or redundant links
6. THE Admin_System SHALL support bulk synchronization of mappings
7. THE Admin_System SHALL provide diff viewer for mapping changes

### Requirement 14

**User Story:** As a security administrator, I want to manage RBAC permissions, admin users, IP whitelists, and API keys, so that I can control system access.

#### Acceptance Criteria

1. THE Admin_System SHALL display security configuration with tabs for RBAC, Admin Users, IP Whitelist, API Keys, and Audit Logs
2. THE Admin_System SHALL show a permission tree for managing roles and permissions
3. THE Admin_System SHALL display admin user list with status management
4. THE Admin_System SHALL provide IP whitelist and API key management with signature permissions
5. THE Admin_System SHALL display audit logs searchable by object, admin user, and time
6. WHEN an Admin_User assigns permissions, THE Admin_System SHALL open a permission assignment modal
7. WHEN an Admin_User disables an admin account, THE Admin_System SHALL require confirmation
8. THE Admin_System SHALL record all security changes in the audit trail


### Requirement 15

**User Story:** As a risk administrator, I want to configure risk rules, limits, and blacklists, so that I can protect the platform from fraudulent activities.

#### Acceptance Criteria

1. THE Admin_System SHALL display risk rules table with rule name, trigger conditions, actions, priority, and status
2. THE Admin_System SHALL provide a risk rule form with condition builder and sample simulation
3. THE Admin_System SHALL display limits by user, country, device, and currency
4. THE Admin_System SHALL display blacklists for addresses, devices, IPs, and countries
5. THE Admin_System SHALL support bulk import for blacklist entries
6. THE Admin_System SHALL provide a rule simulator widget for testing rules
7. THE Admin_System SHALL support version control with draft/publish/rollback for risk rules

### Requirement 16

**User Story:** As an operations administrator, I want to view system logs and manage scheduled tasks, so that I can monitor system health and troubleshoot issues.

#### Acceptance Criteria

1. THE Admin_System SHALL display logs with tabs for System, Audit, and Errors
2. THE Admin_System SHALL provide filtering by log level, source, request ID, API endpoint, and account
3. THE Admin_System SHALL display log detail drawer showing request/response snippets and diff links
4. THE Admin_System SHALL display scheduled tasks, retry queues, and failed tasks
5. THE Admin_System SHALL provide task schedule management with run-now and disable options
6. WHEN an Admin_User runs a task manually, THE Admin_System SHALL require confirmation
7. THE Admin_System SHALL record task execution results in the audit trail


### Requirement 17

**User Story:** As a business analyst, I want to view trading, finance, and retention reports, so that I can analyze platform performance and user behavior.

#### Acceptance Criteria

1. THE Admin_System SHALL display trade reports with trend charts, top trading pairs, and maker/taker composition
2. THE Admin_System SHALL show daily trading volume and symbol volume tables
3. THE Admin_System SHALL display finance reports showing deposit/withdrawal net inflows, fee income, and funding rate settlements
4. THE Admin_System SHALL show daily finance and fee income tables
5. THE Admin_System SHALL display retention reports with DAU/WAU, retention funnel, and conversion metrics
6. THE Admin_System SHALL provide dimension selection for time, market, and region
7. THE Admin_System SHALL visualize data using stacked bar charts, funnel charts, and cohort charts

### Requirement 18

**User Story:** As a system administrator, I want to configure general settings, themes, internationalization, and feature flags, so that I can customize the platform.

#### Acceptance Criteria

1. THE Admin_System SHALL display general settings including site name, logo, operation mode, and cache refresh
2. THE Admin_System SHALL provide theme configuration for colors, light/dark mode, login page text, and copyright
3. THE Admin_System SHALL provide i18n dictionary upload/edit and missing key scanning
4. THE Admin_System SHALL support bulk import for i18n entries
5. THE Admin_System SHALL provide cache refresh controls and feature toggle switches
6. THE Admin_System SHALL display theme preview widget
7. THE Admin_System SHALL validate settings before saving


### Requirement 19

**User Story:** As an administrator, I want all configuration modules to support draft/publish/rollback workflows, so that I can safely manage configuration changes.

#### Acceptance Criteria

1. THE Config_Center SHALL maintain separate Draft_State and Published_State for all configurations
2. WHEN an Admin_User saves configuration changes, THE Config_Center SHALL store them in Draft_State
3. WHEN an Admin_User publishes a draft, THE Config_Center SHALL display a Diff_Viewer comparing Draft_State and Published_State
4. WHEN an Admin_User confirms publication, THE Config_Center SHALL move Draft_State to Published_State and create a version record
5. THE Config_Center SHALL allow Admin_User to rollback to any previous version
6. THE Config_Center SHALL record all version changes in Audit_Trail with timestamp, admin user, and change notes
7. THE Config_Center SHALL support version tagging and notes for all publications

### Requirement 20

**User Story:** As an administrator, I want unified data table components with filtering, sorting, pagination, and export, so that I can efficiently work with large datasets.

#### Acceptance Criteria

1. THE Admin_System SHALL provide a unified table component with server-side pagination
2. THE Admin_System SHALL support column-level sorting and filtering
3. THE Admin_System SHALL allow Admin_User to configure visible columns with persistence to localStorage
4. THE Admin_System SHALL support single-row and batch operations
5. THE Admin_System SHALL provide export functionality for CSV and JSON formats
6. WHEN exporting data, THE Admin_System SHALL include field mapping and pre-validation
7. THE Admin_System SHALL preserve filter and sort state when navigating between pages


### Requirement 21

**User Story:** As an administrator, I want all critical operations to be protected by RBAC and recorded in audit trails, so that I can maintain security and accountability.

#### Acceptance Criteria

1. THE RBAC_Module SHALL check permissions before displaying any protected UI elements
2. WHEN an Admin_User lacks required permissions, THE Admin_System SHALL hide or disable the corresponding buttons and menu items
3. THE Admin_System SHALL record all create, update, delete, and approval operations in Audit_Trail
4. THE Audit_Trail SHALL include timestamp, admin user, operation type, affected object, before/after values, and IP address
5. WHEN an Admin_User performs a dangerous operation, THE Admin_System SHALL require secondary confirmation
6. WHERE dual approval is required, THE Admin_System SHALL enforce approval by a different Admin_User
7. THE Admin_System SHALL display audit history for all configuration and business objects

### Requirement 22

**User Story:** As a developer, I want a unified API client with error handling and request tracking, so that I can reliably communicate with backend services.

#### Acceptance Criteria

1. THE Admin_System SHALL provide a unified AdminApiClient with request/response interceptors
2. THE AdminApiClient SHALL automatically attach authentication tokens to all requests
3. WHEN a request returns 401 status, THE AdminApiClient SHALL attempt token refresh
4. THE AdminApiClient SHALL attach a unique request ID to each API call
5. THE AdminApiClient SHALL map error codes to user-friendly messages
6. THE AdminApiClient SHALL provide loading and error states for all API operations
7. THE Admin_System SHALL validate page-to-API mappings on page mount and display warnings for broken mappings


### Requirement 23

**User Story:** As an administrator, I want consistent form components with validation and draft saving, so that I can efficiently input and validate data.

#### Acceptance Criteria

1. THE Admin_System SHALL provide a unified SchemaForm component supporting synchronous and asynchronous validation
2. THE Admin_System SHALL support field visibility and value linkage based on other field values
3. THE Admin_System SHALL support remote dictionary loading for dropdown fields
4. THE Admin_System SHALL automatically save form drafts to prevent data loss
5. WHEN an Admin_User submits a form with validation errors, THE Admin_System SHALL highlight error fields and display error messages
6. THE Admin_System SHALL display diff comparison before submitting forms that modify existing data
7. THE Admin_System SHALL support large forms in right-side drawers with 720px width

### Requirement 24

**User Story:** As an administrator, I want responsive and accessible UI components, so that I can use the system efficiently across different devices and screen sizes.

#### Acceptance Criteria

1. THE Admin_System SHALL support responsive layouts for screen widths from 1280px to 2560px
2. THE Admin_System SHALL provide loading skeletons for all async data loading
3. THE Admin_System SHALL display empty states with helpful messages when no data is available
4. THE Admin_System SHALL provide error boundaries to prevent full page crashes
5. THE Admin_System SHALL support keyboard navigation for all interactive elements
6. THE Admin_System SHALL maintain consistent spacing, typography, and color schemes across all pages
7. THE Admin_System SHALL provide toast notifications for operation success, failure, and warnings

