# Firmware Agent 用户与访问治理原型

基于 React、Vite、TypeScript、React Router、CSS Variables 和 CSS Modules 的纯前端视觉原型。页面数据来自本地 TypeScript Fixture，不连接后端。

## 本地运行

```bash
npm install
npm run dev
```

质量检查：

```bash
npm run lint
npm run build
```

## 页面

- `/login`、`/admin/login`
- `/admin/overview`、`/admin/users`、`/admin/organization`、`/admin/audit`
- `/user/overview`、`/user/collaboration`

## 响应式验收

2026-08-11 已完成以下检查：

- 360px：移动端单列、创建账号全宽 Drawer，无页面级横向溢出
- 767/768px：顶部导航及侧栏抽屉切换稳定
- 1199/1200px：抽屉布局与固定侧栏切换稳定；组织指标无横向溢出
- 1440px：按 Figma 基准校准侧栏、内容宽度、统计卡与治理健康度
- 1920px：固定侧栏保持可见，内容区域无页面级横向溢出
- Drawer：打开后焦点进入弹层，Tab 焦点循环，Escape 关闭并恢复触发点
- Notification Popover：支持点击外部及 Escape 关闭
- 表格：窄屏仅表格容器横向滚动
