# Tauri 集成设置完成

## 已完成的配置

### 1. 安装 Tauri CLI
✅ 已安装 `@tauri-apps/cli@^2.9.6`

### 2. 初始化 Tauri 项目
✅ 已创建 `src-tauri` 目录
✅ 已生成 Tauri 配置文件和 Rust 项目结构

### 3. 窗口配置
✅ 窗口标题: "ADHD Timer"
✅ 窗口尺寸: 500px × 800px
✅ 可调整大小: 是
✅ 默认图标: 已生成

### 4. 构建配置
✅ 前端构建命令: `npm run build`
✅ 开发服务器: `http://localhost:5173`
✅ 输出目录: `dist`

### 5. 修复的问题
✅ 修复了 Anime.js v4 API 兼容性问题
  - 将 `import anime from 'animejs'` 改为 `import { animate } from 'animejs'`
  - 更新了所有动画函数调用以使用 v4 API
  - 将 `.finished.then()` 改为 `.then()`

## 测试步骤

### 运行开发模式

```bash
npm run tauri:dev
```

这将：
1. 启动 Vite 开发服务器 (http://localhost:5173)
2. 编译 Rust 后端
3. 打开 Tauri 桌面应用窗口

### 验证功能

在 Tauri 应用中测试以下功能：

1. **视图切换** - 切换月度、周度、倒计时、年份、人生视图
2. **倒计时功能** - 设置时间、开始、暂停、重置
3. **人生进度** - 配置出生日期和预期寿命，保存配置
4. **颜色配置** - 修改主题色，保存并重新加载应用
5. **localStorage** - 验证配置在应用重启后仍然保存
6. **底部时间条** - 验证时间条实时更新
7. **响应式布局** - 调整窗口大小，验证布局适配

### 构建生产版本

```bash
npm run tauri:build
```

这将生成平台特定的安装包：
- **Windows**: `src-tauri/target/release/bundle/msi/ADHD Timer_0.1.0_x64_en-US.msi`
- **macOS**: `src-tauri/target/release/bundle/dmg/ADHD Timer_0.1.0_x64.dmg`
- **Linux**: `src-tauri/target/release/bundle/deb/adhd-timer_0.1.0_amd64.deb`

## 配置文件

### src-tauri/tauri.conf.json

```json
{
  "productName": "ADHD Timer",
  "version": "0.1.0",
  "identifier": "com.tauri.dev",
  "build": {
    "frontendDist": "../dist",
    "devUrl": "http://localhost:5173",
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build"
  },
  "app": {
    "windows": [
      {
        "title": "ADHD Timer",
        "width": 500,
        "height": 800,
        "resizable": true,
        "fullscreen": false
      }
    ]
  }
}
```

## 系统要求

- **Rust**: 已安装 (rustc 1.88.0)
- **Node.js**: 已安装
- **操作系统**: Windows (当前系统)

## 下一步

1. 运行 `npm run tauri:dev` 测试开发模式
2. 验证所有功能在桌面应用中正常工作
3. 如果一切正常，运行 `npm run tauri:build` 构建生产版本
4. 测试生成的安装包

## 注意事项

- 首次运行 `tauri:dev` 可能需要较长时间，因为需要编译 Rust 依赖
- 确保防火墙允许 Vite 开发服务器 (端口 5173)
- localStorage 在 Tauri 环境中的行为与浏览器相同
- 所有 Web API 在 Tauri 中都可以正常使用
