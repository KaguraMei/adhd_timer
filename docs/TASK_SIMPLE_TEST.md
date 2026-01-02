# 任务模块简化测试

## 快速测试代码

在浏览器控制台粘贴以下代码测试基本功能：

```javascript
// 1. 测试 localStorage
console.log('=== 测试 localStorage ===')
localStorage.setItem('test-key', JSON.stringify({ test: 'value' }))
console.log('写入测试:', localStorage.getItem('test-key'))
localStorage.removeItem('test-key')

// 2. 手动创建任务
console.log('=== 手动创建任务 ===')
const testTask = {
  id: 'task-' + Date.now(),
  title: '测试任务',
  priority: 'medium',
  status: 'todo',
  createdAt: Date.now()
}
console.log('任务对象:', testTask)

// 3. 保存到 localStorage
const tasks = [testTask]
localStorage.setItem('adhd-timer-tasks', JSON.stringify(tasks))
console.log('已保存任务到 localStorage')

// 4. 读取验证
const saved = JSON.parse(localStorage.getItem('adhd-timer-tasks'))
console.log('读取的任务:', saved)

// 5. 刷新页面查看
console.log('现在刷新页面，应该能看到任务列表中有一个任务')
```

## 预期结果

执行上述代码后：
1. 控制台应该显示所有日志
2. 刷新页面后，任务视图应该显示"测试任务"
3. 统计应该显示：待办 1，总计 1

## 如果看到任务

说明：
- ✅ localStorage 工作正常
- ✅ 任务加载功能正常
- ✅ 任务显示功能正常
- ❌ 添加任务按钮有问题

解决方案：检查按钮点击事件

## 如果看不到任务

说明：
- ❌ 任务加载或显示有问题

检查：
1. 控制台是否有错误
2. Vue DevTools 中 tasks 数组是否有数据
3. v-for 循环是否正常工作

## 清除测试数据

```javascript
localStorage.removeItem('adhd-timer-tasks')
location.reload()
```
