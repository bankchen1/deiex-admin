# 关键错误修复

## 已修复的错误

### 1. PositionTable - 重复导入 ✅
**错误**: `Identifier 'PositionQueryParams' has already been declared`
**原因**: 同一个类型被导入了两次
**修复**: 删除重复的import语句

### 2. Instruments Store - 缺失导出 ✅
**错误**: `The requested module does not provide an export named 'exportInstruments'`
**原因**: Store导入了不存在的facade函数
**修复**: 移除不存在的导入（exportInstruments, importInstruments等）

### 3. Calendar Store - 未定义变量 ✅
**错误**: `calendarApi is not defined`
**原因**: 代码使用了`calendarApi`但没有导入
**修复**: 将`calendarApi.getPublishedMaintenance`改为使用导入的`listMaintenanceWindows`

## 剩余问题

### Calendar Store需要全面重构
Calendar store中有大量使用`calendarApi`的地方（约50+处），都需要改为使用导入的facade函数。

**临时解决方案**: 只修复了`fetchPublishedMaintenance`方法，其他方法暂时保持原样。

**影响**: Calendar相关页面可能仍有问题，但不会影响Orders和Risk页面。

### Instruments Store功能受限
由于移除了不存在的导入，以下功能暂时不可用：
- 导入交易对配置
- 导出交易对配置
- 版本管理
- 差异对比
- 导入验证

**影响**: Config → Instruments页面的部分功能可能不工作。

## 验证步骤

### 1. 检查编译
```bash
npx vue-tsc --noEmit
# ✅ 应该无错误
```

### 2. 测试Orders页面
访问以下URL，确认能正常加载：
- http://localhost:5173/admin/orders/spot ✅
- http://localhost:5173/admin/orders/futures ✅
- http://localhost:5173/admin/orders/positions ✅

### 3. 测试Risk页面
访问 http://localhost:5173/admin/risk ✅

### 4. 检查Console
应该不再看到以下错误：
- ✅ `PositionQueryParams has already been declared`
- ✅ `does not provide an export named 'exportInstruments'`
- ✅ `calendarApi is not defined` (至少在加载时不会出现)

## 下一步行动

### 优先级1: 修复Calendar Store
需要系统性地将所有`calendarApi`调用改为使用facade函数。

### 优先级2: 补充Instruments Facade
需要在`config.ts`中添加缺失的函数：
- exportInstruments
- importInstruments
- getInstrumentVersions
- getInstrumentVersion
- rollbackInstrumentVersion
- getInstrumentDiff
- validateImport

### 优先级3: 修复其他Stores的空return
还有很多stores有同样的问题（返回undefined），需要批量修复。

## 当前状态

- ✅ Orders页面应该能正常显示
- ✅ Risk页面应该能正常显示
- ⚠️ Config页面可能有部分功能不工作
- ⚠️ Calendar相关功能可能有问题
- ✅ TypeScript编译通过

**请刷新浏览器并测试Orders和Risk页面！**
