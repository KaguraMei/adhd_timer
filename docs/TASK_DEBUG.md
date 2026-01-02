# 任务模块调试指南

## 问题描述
- 添加新任务没有反应
- 初始进入时无法点击添加任务按钮

## 调试步骤

### 1. 打开浏览器控制台
按 F12 打开开发者工具，切换到 Console 标签

### 2. 检查初始化日志
应该看到以下日志：
```
TaskView mounted, loading tasks...
Tasks already loaded 或 No saved tasks found 或 Tasks loaded: X
```

### 3. 测试添加任务
1. 在输入框输入任务标题
2. 点击"➕ 添加"按钮
3. 查看控制台输出：
```
handleAddTask called, title: [你输入的标题]
Adding task with priority: medium
Task added: [任务对象]
Tasks saved: 1
Task added, tasks count: 1
Tasks updated: 1
```

### 4. 检查 localStorage
在控制台执行：
```javascript
localStorage.getItem('adhd-timer-tasks')
```
应该看到 JSON 格式的任务数据

### 5. 手动测试添加
在控制台执行：
```javascript
// 获取任务管理器
const { useTask } = await import('./src/composables/useTask.ts')
const taskManager = useTask()

// 添加测试任务
taskManager.addTask('测试任务', 'high')

// 查看任务列表
console.log(taskManager.tasks.value)
```

## 常见问题

### 问题1: 按钮被禁用
**原因**: `isAdding` 状态或输入验证问题
**解决**: 已移除 `!newTaskTitle.trim()` 条件

### 问题2: 点击无反应
**原因**: 事件处理器未绑定或被阻止
**检查**: 
- 确认 `@click="handleAddTask"` 正确绑定
- 检查是否有 CSS 覆盖导致点击事件被拦截

### 问题3: 任务添加但不显示
**原因**: 响应式更新问题
**解决**: 使用单例模式确保状态共享

### 问题4: localStorage 不工作
**原因**: 浏览器隐私模式或配额限制
**检查**: 
```javascript
try {
  localStorage.setItem('test', 'test')
  localStorage.removeItem('test')
  console.log('localStorage 可用')
} catch (e) {
  console.error('localStorage 不可用:', e)
}
```

## 代码改进

### 已实现的改进
1. ✅ 单例模式 - 确保状态在组件间共享
2. ✅ 详细日志 - 每个操作都有 console.log
3. ✅ 输入验证 - 检查空标题和长度
4. ✅ 错误处理 - try-catch 包裹关键操作
5. ✅ 禁用状态 - 添加时禁用按钮防止重复点击

### 当前实现特点
- 任务添加到数组开头（unshift）
- 自动保存到 localStorage
- 响应式更新统计数据
- 支持三种优先级

## 测试清单

- [ ] 页面加载后能看到"还没有任务"提示
- [ ] 输入框可以输入文字
- [ ] 优先级下拉框可以选择
- [ ] 点击添加按钮有反应
- [ ] 控制台有日志输出
- [ ] 任务出现在列表中
- [ ] 刷新页面任务仍然存在
- [ ] 可以切换任务状态
- [ ] 可以删除任务
- [ ] 统计数据正确更新

## 如果仍然不工作

### 清除缓存重试
```javascript
// 在控制台执行
localStorage.clear()
location.reload()
```

### 检查 Vue DevTools
1. 安装 Vue DevTools 浏览器扩展
2. 打开 DevTools
3. 查看 TaskView 组件的 data
4. 确认 tasks、stats、newTaskTitle 等状态

### 检查网络请求
虽然是纯前端应用，但确保：
- 没有 CORS 错误
- 没有 CSP 策略阻止
- 没有浏览器扩展干扰

## 联系支持
如果以上步骤都无法解决问题，请提供：
1. 浏览器版本和类型
2. 控制台完整日志
3. localStorage 内容
4. 是否在隐私/无痕模式
