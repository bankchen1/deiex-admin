# 导航菜单修复

## 问题诊断

### 原始问题
用户报告访问Risk的Rules、Limits、Blacklist显示404。

### 根本原因
**菜单配置与路由配置不匹配**

- **菜单配置**: 有子菜单项指向 `/admin/risk/rules`、`/admin/risk/limits`、`/admin/risk/blacklist`
- **路由配置**: 只有 `/admin/risk` 路由，使用Tab组织子功能
- **结果**: 点击子菜单项导致404错误

## 修复方案

### 修复内容
修改 `src/layouts/AdminShell.vue` 中的Risk菜单配置：

**修复前** ❌
```typescript
{
  key: 'risk',
  path: '/admin/risk',
  title: t('nav.risk'),
  icon: 'WarningOutlined',
  permissions: ['risk.view'],
  children: [
    {
      key: 'risk-rules',
      path: '/admin/risk/rules',  // ❌ 路由不存在
      title: t('risk.rules'),
      permissions: ['risk.rules.view'],
    },
    {
      key: 'risk-limits',
      path: '/admin/risk/limits',  // ❌ 路由不存在
      title: t('risk.limits'),
      permissions: ['risk.limits.view'],
    },
    {
      key: 'blacklist',
      path: '/admin/risk/blacklist',  // ❌ 路由不存在
      title: t('risk.blacklist'),
      permissions: ['risk.blacklist.view'],
    },
  ],
},
```

**修复后** ✅
```typescript
{
  key: 'risk',
  path: '/admin/risk',
  title: t('nav.risk'),
  icon: 'WarningOutlined',
  permissions: ['risk.view'],
  // 移除children，直接访问主页面
},
```

### 为什么这样修复？

Risk模块使用**Tab组织**而不是独立路由：

```vue
<!-- src/pages/risk/index.vue -->
<a-tabs v-model:active-key="activeTab">
  <a-tab-pane key="rules" tab="Risk Rules">
    <Rules />
  </a-tab-pane>
  <a-tab-pane key="limits" tab="Risk Limits">
    <Limits />
  </a-tab-pane>
  <a-tab-pane key="blacklist" tab="Blacklist">
    <Blacklist />
  </a-tab-pane>
</a-tabs>
```

所有功能都在一个页面上，通过Tab切换，不需要独立路由。

## 使用方式

### 修复后的访问流程
1. 点击侧边栏的"Risk"菜单
2. 进入 `/admin/risk` 页面
3. 在页面上点击Tab切换：
   - Risk Rules
   - Risk Limits
   - Blacklist

### 优点
- ✅ 简单直观
- ✅ 所有Risk功能在一个页面
- ✅ 快速切换，无需重新加载
- ✅ 符合当前的页面设计

## 其他类似的模块

### 检查结果
其他模块的菜单配置都是正确的：

- **Orders**: 有独立子路由 ✅
- **Assets**: 有独立子路由 ✅
- **Config**: 有独立子路由 ✅
- **Reports**: 有独立子路由 ✅
- **Ops**: 有独立子路由 ✅

只有Risk模块使用Tab组织，所以只需要修复Risk的菜单配置。

## 验证步骤

### 1. 刷新浏览器
```bash
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### 2. 测试Risk菜单
1. 点击侧边栏的"Risk"
2. 应该直接进入Risk页面（不再有子菜单）
3. 在页面上看到三个Tab
4. 点击Tab切换功能

### 3. 预期结果
- ✅ 点击Risk菜单直接进入Risk页面
- ✅ 不再显示404错误
- ✅ 可以通过Tab切换Rules、Limits、Blacklist

## 总结

### 修复内容
- ✅ 修改Risk菜单配置，移除不存在的子菜单项
- ✅ TypeScript编译通过
- ✅ 菜单配置与路由配置匹配

### 影响
- ✅ Risk菜单现在能正常工作
- ✅ 不再出现404错误
- ✅ 用户体验改善

### 建议
如果将来需要Risk有独立的子路由，需要：
1. 修改路由配置（`src/router/modules/risk.ts`）
2. 修改页面结构（不使用Tab）
3. 更新菜单配置

但当前的Tab设计是合理的，建议保持。
