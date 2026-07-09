# 🚀 快速参考 - 供应链物流数据看板

## 📋 目录
1. [问题排查](#问题排查)
2. [流程图说明](#流程图说明)
3. [组件清单](#组件清单)
4. [技术栈](#技术栈)
5. [常用命令](#常用命令)

---

## 🔍 问题排查

### Q: 有的人能打开，有的人打不开？

**A: 按优先级检查**

1. **Figma权限** (最常见 50%)
   ```
   操作：进入Figma → Share → "Anyone with the link can view"
   ```

2. **网络/防火墙** (30%)
   ```
   解决：
   - 切换到手机热点测试
   - 联系IT开通 *.figma.com 白名单
   ```

3. **浏览器兼容** (20%)
   ```
   推荐：Chrome 120+ / Edge 120+ / Safari 17+
   避免：IE浏览器、360兼容模式
   ```

**快速修复三步曲**:
```
1️⃣ Ctrl+F5 强制刷新
2️⃣ Ctrl+Shift+Delete 清除缓存
3️⃣ Ctrl+Shift+N 无痕模式测试
```

### Q: 页面显示空白/加载失败？

**A: 查看浏览器控制台**

按 `F12` 打开开发者工具：

| 错误类型 | 原因 | 解决方案 |
|---------|------|---------|
| `Failed to fetch` | 网络问题 | 检查网络/防火墙 |
| `ChunkLoadError` | 资源加载失败 | 刷新页面 |
| `TypeError: xxx is not defined` | 缓存损坏 | 清除缓存 |

### Q: 流程图不显示？

**A: 已完全修复！**

- ✅ 旧方案：依赖外部图片（已弃用）
- ✅ 新方案：SVG组件动态生成（当前）

如果仍有问题，检查：
```typescript
// 确保导入了正确的组件
import { SmartProcessFlow } from '@/app/components/SmartProcessFlow';
```

---

## 📊 流程图说明

### 业务流程类型

| 类型 | Flow ID 范围 | 说明 |
|------|-------------|------|
| 订货链路 | flow_1_x_x | 供应商→国际物流→仓库 |
| 分货链路 | flow_2_x_x | 监管仓→周转仓→门店 |
| 调拨链路 | flow_3_x_x | 仓库间调拨及配送 |

### 完整流程映射

```
订货链路:
  flow_1_1_1: 供应商 → 国际物流 → 监管仓 → 完成入库
  flow_1_2_1: 供应商 → 国际物流 → 周转仓 → 门店直发

分货链路:
  flow_2_1_1: 监管仓 → 分货处理 → 周转仓 → 配送门店

调拨链路:
  flow_3_1_1: 监管仓 → 申请调拨 → 周转仓
  flow_3_2_1: 周转仓 → 出库处理 → 卖场上架
  flow_3_3_1: 卖场 → 调拨申请 → 分拣仓
  flow_3_4_1: 分拣仓 → 打包邮寄 → 顾客签收
  flow_3_5_1: 分拣仓 → 配送运输 → 提货点
  flow_3_6_1: 监管仓 → 预定处理 → 预定仓
  flow_3_7_1: 预定仓 → 打包邮寄 → 顾客签收
  flow_3_8_1: 预定仓 → 物流配送 → 顾客签收
```

---

## 🧩 组件清单

### 核心页面组件

| 组件名 | 路径 | 功能 |
|--------|------|------|
| App | `/src/app/App.tsx` | 主应用入口 |
| TopNavigation | `/src/app/components/TopNavigation.tsx` | 顶部导航栏 |
| FilterSidebar | `/src/app/components/FilterSidebar.tsx` | 左侧筛选栏 |
| IndicatorOverview | `/src/app/components/IndicatorOverview.tsx` | 指标总览页 |
| IndicatorDetail | `/src/app/components/IndicatorDetail.tsx` | 指标明细页 |
| Settings | `/src/app/components/Settings.tsx` | 异常分析页 |

### 业务组件

| 组件名 | 功能 | 使用场景 |
|--------|------|---------|
| MetricsOverview | 指标概览 | 显示各类指标卡片 |
| UnifiedInventoryModule | 一盘货模块 | 库存数据展示 |
| UnifiedInventoryMetrics | 库存指标 | 详细指标分析 |
| MetricTree | 指标树 | 层级结构展示 |
| MetricDetailTable | 明细表格 | 数据表格展示 |

### 流程图组件 ⭐ NEW

| 组件名 | 功能 | 参数 |
|--------|------|------|
| **ProcessFlowSVG** | SVG渲染引擎 | `steps: string[]` |
| **SmartProcessFlow** | 智能流程图 | `flowId: string, alt: string` |
| ProcessFlowDiagram | 旧版（已弃用） | ❌ 不再使用 |

### 错误处理 🛡️ NEW

| 组件名 | 功能 |
|--------|------|
| **ErrorBoundary** | 错误边界保护 |

---

## 🛠️ 技术栈

### 前端框架
```json
{
  "react": "^18.3.1",
  "typescript": "^5.x",
  "tailwindcss": "^4.0"
}
```

### UI库
```json
{
  "lucide-react": "图标库",
  "recharts": "图表库",
  "date-fns": "日期处理"
}
```

### 构建工具
```json
{
  "vite": "构建工具",
  "figma-make": "部署平台"
}
```

---

## ⌨️ 常用命令

### 开发环境

```bash
# 安装依赖（如需）
npm install

# 本地开发
npm run dev

# 类型检查
npm run type-check

# 构建生产版本
npm run build
```

### 组件导入别名

```typescript
// ✅ 正确：使用 @ 别名
import { Component } from '@/app/components/Component';

// ❌ 错误：不要使用相对路径
import { Component } from '../../components/Component';
```

### 图片资源导入

```typescript
// ✅ Figma资源：使用 figma:asset
import img from "figma:asset/abc123.png";

// ✅ SVG资源：使用 @ 别名
import svg from "@/imports/svg-wg56ef214f";

// ✅ 新图片：使用 ImageWithFallback
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
```

---

## 📁 项目结构

```
/src
├── app
│   ├── App.tsx                    # 主入口 ⭐
│   ├── types.ts                   # 类型定义
│   ├── components/                # 组件目录
│   │   ├── TopNavigation.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── IndicatorOverview.tsx
│   │   ├── IndicatorDetail.tsx
│   │   ├── Settings.tsx
│   │   ├── ErrorBoundary.tsx      # 错误边界 🛡️
│   │   ├── ProcessFlowSVG.tsx     # 流程图引擎 ⭐ NEW
│   │   └── SmartProcessFlow.tsx   # 智能流程图 ⭐ NEW
│   └── data/                      # 数据层
│       ├── storeWarehouseMapping.ts
│       ├── detailTableData.ts
│       └── metricsData.ts
└── styles/
    ├── fonts.css
    └── theme.css
```

---

## 🎯 视图切换逻辑

```typescript
// 三个主要视图
type ViewType = 'overview' | 'detail' | 'settings';

// 切换视图
const [currentView, setCurrentView] = useState<ViewType>('overview');

// 渲染对应组件
{currentView === 'overview' && <IndicatorOverview />}
{currentView === 'detail' && <IndicatorDetail />}
{currentView === 'settings' && <Settings />}
```

---

## 🔐 权限说明

### Figma 文件权限设置

**路径**: Figma → Share → Link Settings

**推荐设置**:
```
✅ "Anyone with the link can view"
   (任何有链接的人可查看)

❌ "Only people invited to this file"
   (仅邀请的人可查看)
```

### 数据权限（未来扩展）

当前所有数据都是 mock 数据，无需权限控制。

如需接入真实API，建议：
- 用户登录认证
- 角色权限管理（集团/门店/COE）
- 数据脱敏处理

---

## 📊 数据维度说明

### 时间维度
- **月度**: 按月统计
- **周度**: 按周统计

### 计量维度
- **件数**: 按商品件数计算
- **单数**: 按订单数计算

### 品类维度
- **香化**: 香水化妆品
- **酒水**: 酒类饮品

### 视角维度
- **集团视角**: 全局数据
- **门店视角**: 单个门店数据
- **COE全景**: 专业分析视角

---

## 🎨 设计规范

### 颜色系统

```css
/* 主色 */
primary: #3b82f6 (蓝色)
success: #22c55e (绿色)
warning: #f59e0b (橙色)
danger: #ef4444 (红色)

/* 中性色 */
gray-50: #f9fafb
gray-100: #f3f4f6
gray-200: #e5e7eb
...
gray-900: #111827
```

### 间距系统

```css
p-1: 0.25rem (4px)
p-2: 0.5rem (8px)
p-3: 0.75rem (12px)
p-4: 1rem (16px)
p-6: 1.5rem (24px)
p-8: 2rem (32px)
```

### 字体系统

```css
text-xs: 0.75rem (12px)
text-sm: 0.875rem (14px)
text-base: 1rem (16px)
text-lg: 1.125rem (18px)
text-xl: 1.25rem (20px)
```

---

## 📈 性能指标

### 加载性能

| 指标 | 目标值 | 当前值 |
|------|--------|--------|
| 首次内容渲染 | <1s | ~0.5s ✅ |
| 可交互时间 | <2s | ~1s ✅ |
| 资源大小 | <500KB | ~300KB ✅ |

### 运行性能

| 指标 | 目标值 | 说明 |
|------|--------|------|
| FPS | ≥60 | 流畅交互 |
| 内存占用 | <100MB | 合理范围 |
| Tab切换 | <100ms | 即时响应 |

---

## 🐛 调试技巧

### 查看组件渲染

```typescript
// 添加临时日志
console.log('当前筛选条件:', filters);
console.log('当前选中指标:', selectedMetric);
```

### 查看网络请求

```
F12 → Network Tab
- 筛选: Fetch/XHR
- 查看: 请求状态、响应时间
```

### 查看React组件树

```
安装 React DevTools 浏览器扩展
F12 → React Tab → 查看组件层级
```

---

## 📞 支持资源

### 文档清单

| 文档名 | 用途 | 阅读对象 |
|--------|------|---------|
| `DIAGNOSIS_REPORT.md` | 技术诊断报告 | 开发者 |
| `USER_TROUBLESHOOTING_GUIDE.md` | 用户故障排查 | 最终用户 |
| `PROCESS_FLOW_RESTORATION.md` | 流程图恢复说明 | 技术人员 |
| `FLOW_CHART_PREVIEW.md` | 流程图效果预览 | 设计/产品 |
| `QUICK_REFERENCE.md` | 快速参考（本文档） | 所有人 |

### 技术支持

**如需技术支持，请提供**:
1. 浏览器类型和版本
2. 控制台截图（F12 → Console）
3. 具体问题描述
4. 复现步骤

---

## ✅ 检查清单

### 部署前检查

- [ ] TypeScript 编译无错误
- [ ] 控制台无警告或错误
- [ ] 所有Tab页面可正常切换
- [ ] 筛选功能正常工作
- [ ] 流程图正常显示
- [ ] 表格数据正常渲染
- [ ] 响应式布局正常

### 发布前检查

- [ ] 更新版本号
- [ ] 测试主流浏览器兼容性
- [ ] 测试不同网络环境
- [ ] 确认Figma权限设置
- [ ] 准备用户培训材料

---

## 🎓 学习资源

### React
- 官方文档: https://react.dev
- TypeScript: https://www.typescriptlang.org

### Tailwind CSS
- 官方文档: https://tailwindcss.com
- 速查表: https://nerdcave.com/tailwind-cheat-sheet

### Figma Make
- 用户指南: https://help.figma.com/hc/en-us/articles/figma-make

---

**最后更新**: 2025-01-29  
**版本**: v1.0  
**维护者**: 供应链技术团队
