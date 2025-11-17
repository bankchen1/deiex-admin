# 调试指南

## 问题描述
用户报告除了Dashboard、Users、Assets之外的页面都显示白屏或报错。

## 需要检查的内容

### 1. 浏览器控制台错误
请打开浏览器开发者工具（F12），访问以下页面并记录错误：

#### Orders页面
- URL: `http://localhost:5173/admin/orders/spot`
- 预期：显示现货订单列表
- 检查：Console中的错误信息

#### Risk页面
- URL: `http://localhost:5173/admin/risk`
- 预期：显示风险管理标签页
- 检查：Console中的错误信息

#### Config页面
- URL: `http://localhost:5173/admin/config/instruments`
- 预期：显示交易对配置
- 检查：Console中的错误信息

### 2. 网络请求
在Network标签中检查：
- 是否有API请求失败（红色）
- 请求的响应格式是否正确
- 是否返回了mock数据

### 3. Vue DevTools
如果安装了Vue DevTools：
- 检查组件是否正常挂载
- 检查store中的数据状态
- 检查是否有组件错误

## 可能的问题

### 问题1: Mock数据格式不匹配
**症状**: 页面白屏，console显示类型错误
**原因**: Mock service返回旧格式，但store期望新格式
**解决**: 需要统一mock数据格式

### 问题2: Store方法未正确处理响应
**症状**: 数据加载失败，显示错误消息
**原因**: Store没有正确解构{data, error}
**解决**: 已修复大部分，可能还有遗漏

### 问题3: 组件导入错误
**症状**: 页面完全白屏，console显示模块加载错误
**原因**: 组件路径错误或组件不存在
**解决**: 检查路由配置和组件路径

### 问题4: 权限问题
**症状**: 页面显示"无权限"或重定向
**原因**: Mock的用户权限不足
**解决**: 检查mock auth数据中的permissions

## 调试步骤

### 步骤1: 检查开发服务器
```bash
npm run dev
```
确认服务器正常运行在 http://localhost:5173

### 步骤2: 检查环境变量
```bash
cat .env.development
```
确认 `VITE_USE_MOCK=true`

### 步骤3: 测试简单页面
访问 http://localhost:5173/admin/dashboard
如果Dashboard正常，说明基础架构没问题

### 步骤4: 逐个测试问题页面
按顺序测试：
1. Orders -> Spot Orders
2. Risk -> Risk Rules
3. Config -> Instruments
4. KYC -> Applications

记录每个页面的具体错误信息

### 步骤5: 检查Store状态
在浏览器console中运行：
```javascript
// 检查orders store
window.__PINIA__.state.value.orders

// 检查risk store
window.__PINIA__.state.value.risk

// 检查config store
window.__PINIA__.state.value.config
```

## 需要用户提供的信息

请提供以下信息以便诊断：

1. **具体的错误消息**
   - 完整的console错误堆栈
   - 错误发生的页面URL

2. **网络请求信息**
   - 失败的API请求URL
   - 请求的响应内容
   - 响应状态码

3. **页面表现**
   - 是完全白屏还是部分显示？
   - 是否有加载动画？
   - 是否显示错误提示？

4. **浏览器信息**
   - 浏览器类型和版本
   - 是否有浏览器插件干扰

## 快速测试命令

在浏览器console中运行以下命令测试API：

```javascript
// 测试orders API
fetch('http://localhost:5173/admin/orders/spot?page=1&pageSize=10')
  .then(r => r.json())
  .then(console.log)

// 测试risk API  
fetch('http://localhost:5173/admin/risk/rules?page=1&pageSize=10')
  .then(r => r.json())
  .then(console.log)
```

## 下一步

根据用户提供的具体错误信息，我们可以：
1. 修复特定的响应格式问题
2. 补充缺失的mock数据
3. 修复组件导入错误
4. 调整权限配置
