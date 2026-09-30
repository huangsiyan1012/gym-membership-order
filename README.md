# 健身房会员办卡订单管理

## 项目简介

这是一个面向连锁健身房后台管理场景的会员办卡订单管理模块，使用 React 18 和 Vite 构建。

项目包含登录鉴权、后台布局、订单列表查询、跨页批量选择、批量续卡、一键撤单、新建订单和 CSV 导出功能。所有接口由前端内存 Mock 层模拟，页面刷新后数据恢复为初始状态。

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | React 18 |
| 构建工具 | Vite |
| 路由 | react-router v7 |
| UI 组件库 | Ant Design v5 |
| HTTP 请求 | axios |
| 全局状态 | zustand |
| 日期处理 | dayjs |
| Mock 接口 | axios-mock-adapter |
| 语言 | JavaScript |
| 样式 | CSS Modules 和全局 CSS |
| 工程化 | ESLint、Prettier |

## 环境要求

- Node.js 20.19 或更高版本
- npm 10 或更高版本

## 安装和启动

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:5173
```

构建生产版本：

```bash
npm run build
```

本地预览生产构建：

```bash
npm run preview
```

## 可用脚本

```bash
npm run dev           # 启动开发服务器
npm run build         # 生产构建
npm run preview       # 预览生产构建
npm run lint          # ESLint 检查
npm run lint:fix      # ESLint 自动修复
npm run format        # Prettier 写入
npm run format:check  # Prettier 检查
```

当前版本尚未配置 `npm run test`。M14 自动化测试阶段未执行，若继续完善项目，建议接入 Vitest 并补充纯函数、Mock 数据和请求层测试。

## 环境变量

项目提供 `.env.example`：

```env
VITE_API_BASE_URL=/api
```

复制为 `.env.local` 后可覆盖接口前缀。当前 Mock 层会匹配 `/orders` 相关路径，真实接入后端时可保留同样的业务接口封装。

## 功能清单

- 模拟登录和退出登录
- localStorage 登录态持久化
- 路由守卫
- 订单列表分页查询
- 状态 Tab 筛选
- 订单号精确搜索
- 会员姓名模糊搜索
- 状态 Tag 映射
- 金额千分位展示
- 默认按创建时间倒序
- 跨页保留订单勾选
- 单条续卡
- 批量续卡
- 续卡年限校验和实时费用计算
- 满 5 年续卡 8 折
- 批量撤单
- 撤单二次确认
- 新建订单
- 前端 CSV 导出
- 404 页面
- 401 登录态清理

## 路由说明

| 路径 | 页面 | 访问要求 |
| --- | --- | --- |
| `/login` | 登录页 | 游客可访问 |
| `/` | 重定向到 `/orders` | 登录后访问 |
| `/orders` | 订单列表页 | 登录后访问 |
| `/orders/new` | 新建订单页 | 登录后访问 |
| `*` | 404 页面 | 公开 |

## 登录使用说明

项目使用 Mock 登录，不连接真实后端。

- 任意非空账号和密码均可登录。
- 示例账号：`admin`。
- 示例密码：`123456`。
- Supabase 或其他真实登录服务未接入。
- 登录成功后生成 `mock-token-<时间戳>`。
- token 和用户名保存在 zustand，并同步到 localStorage。
- 退出登录或接口返回 401 时，会清除登录态并跳转 `/login`。

localStorage key：

```text
gym_orders_token
gym_orders_username
```

## 订单状态

| 状态 | 中文名称 | 说明 |
| --- | --- | --- |
| `PENDING_REVIEW` | 待审核 | 订单进入审核流程 |
| `PENDING_CARD` | 待制卡 | 等待制卡 |
| `PENDING_SHIP` | 待寄卡 | 等待寄送 |
| `COMPLETED` | 已完成 | 订单流程完成 |
| `EXPIRED` | 已到期 | 到期未续费 |
| `CANCELLED` | 已取消 | 客户撤单 |

状态流转：

```text
待审核 -> 待制卡 -> 待寄卡 -> 已完成
待制卡 -> 已取消
待寄卡 -> 已取消
已到期 -> 待审核（续卡）
```

## 业务规则

### 列表查询

- “全部”查询所有状态。
- “进行中”包含待审核、待制卡、待寄卡。
- 订单号使用精确匹配。
- 会员姓名使用模糊匹配。
- 默认按 `createdAt desc` 查询，最新订单在前。
- 切换 Tab、查询或修改每页条数时回到第 1 页。

### 续卡

- 只有已到期订单可以续卡。
- 续卡年限必须为 1 到 10 的整数。
- 费用公式：

```text
应付费用 = 续卡年限 × 1200
续卡年限 >= 5 时，应付费用再乘以 0.8
```

- 续卡成功后购卡年限累加。
- 订单状态变更为待审核。
- 最近一次续卡年限、费用和时间会写入订单。
- 原始订单金额保持不变。
- 批量中如有不符合条件的订单，整批不执行并列出问题订单号。

### 撤单

- 只有待制卡、待寄卡订单可以撤单。
- 操作前必须二次确认。
- 确认框会列出全部将被撤单的订单号。
- 批量中如有不符合条件的订单，整批不执行并列出问题订单号。
- 成功后订单状态变更为已取消。

### 新建订单

- 姓名必须为 2 到 30 个字符。
- 手机号按中国大陆号码格式校验。
- 购卡年限为 1 到 10 的整数。
- 办卡费用自动计算，只读展示。
- 备注最多 200 字。
- 成功后跳转订单列表，新订单立即可查询。

## 请求层设计

请求层主要文件：

```text
src/api/http.js
src/api/order.js
src/api/mock/index.js
src/api/mock/orderStore.js
src/api/mock/orders.js
```

### axios 实例

`http.js` 创建统一 axios 实例：

- 从 `VITE_API_BASE_URL` 读取 baseURL。
- 默认前缀为 `/api`。
- 超时时间 10 秒。
- 注册 M4/M5 的 Mock 接口。

### 请求拦截器

从 zustand auth store 读取 token，并注入：

```http
Authorization: Bearer <mock-token>
```

### 响应拦截器

- 成功响应统一解包 `{ code, message, data }`。
- 业务错误统一调用 antd message 提示并 reject。
- HTTP 401 会清除登录状态并跳转 `/login`。
- 错误提示通过 `src/utils/feedback.js` 与根组件中的 antd `App` 上下文连接。

### 订单 API

`src/api/order.js` 封装：

```text
GET  /orders
POST /orders
POST /orders/renew
POST /orders/cancel
```

## 全局状态设计

登录态使用 zustand 管理：

```text
token
username
isAuthenticated
login
logout
hydrate
```

设计原则：

- zustand 提供页面内实时状态。
- localStorage 提供刷新后的登录态恢复。
- 退出登录和 401 处理复用同一个 logout 方法。
- 页面业务查询状态不放入全局 store，避免把列表分页和搜索污染为全局状态。

## 模拟接口设计

模拟接口使用 `axios-mock-adapter`。

请求流程：

```text
页面调用 order API
  -> axios 请求拦截器注入 token
  -> mock adapter 匹配请求方法和 URL
  -> 调用 orderStore
  -> 返回统一响应
  -> axios 响应拦截器处理
  -> 页面获得 data 或错误
```

内存数据特点：

- 初始数据定义在 `src/api/mock/orders.js`。
- 至少 30 条数据，覆盖全部状态。
- 包含金额为 0 和 null 的边界数据。
- `orderStore.js` 在模块级维护同一份数组。
- 查询和写操作访问同一份内存数据。
- 写操作成功后，后续查询可以立即读取变更。
- 页面刷新后模块重新加载，数据恢复初始状态。

## 状态管理和数据流

```text
constants
  -> utils
  -> mock order seeds
  -> orderStore
  -> mock adapter
  -> axios request layer
  -> custom hooks
  -> pages/components
```

列表数据流：

```text
OrderList
  -> useOrderListQuery
  -> getOrderList
  -> axios
  -> mock adapter
  -> queryOrders
  -> Table
```

选择数据流：

```text
Table rowSelection
  -> useOrderSelection
  -> 以订单号为键保存完整订单快照
  -> 翻页后保留选择
  -> 续卡或撤单成功后按订单号清理
```

## 目录结构

```text
.
├─ public/
├─ src/
│  ├─ api/
│  │  ├─ http.js
│  │  ├─ order.js
│  │  └─ mock/
│  │     ├─ index.js
│  │     ├─ orders.js
│  │     └─ orderStore.js
│  ├─ components/
│  │  ├─ AppLayout/
│  │  ├─ AuthGuard/
│  │  ├─ CancelOrderModal/
│  │  ├─ RenewOrderModal/
│  │  └─ StatusTag/
│  ├─ constants/
│  │  ├─ order.js
│  │  └─ pricing.js
│  ├─ hooks/
│  │  ├─ useOrderListQuery.js
│  │  └─ useOrderSelection.js
│  ├─ pages/
│  │  ├─ Login/
│  │  ├─ NotFound/
│  │  ├─ OrderCreate/
│  │  └─ OrderList/
│  ├─ router/
│  │  ├─ index.jsx
│  │  └─ routes.jsx
│  ├─ store/
│  │  └─ authStore.js
│  ├─ utils/
│  │  ├─ csv.js
│  │  ├─ feedback.js
│  │  ├─ format.js
│  │  ├─ order.js
│  │  ├─ orderSelection.js
│  │  └─ validators.js
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ .env.example
├─ .prettierignore
├─ .prettierrc
├─ eslint.config.js
├─ index.html
├─ package.json
├─ package-lock.json
├─ SPEC.md
└─ IMPLEMENTATION_PLAN.md
```

## CSV 导出说明

入口位于订单列表页的操作区。

导出规则：

- 有跨页勾选时，只导出已勾选订单。
- 无勾选时，导出当前 Tab 和搜索条件下的全部订单。
- 导出不受当前分页限制。
- 已取消订单默认跳过。
- 如果全部订单均不可导出，不生成空文件。
- 提示实际导出数量和跳过数量。

CSV 格式：

- UTF-8 BOM
- CRLF 换行
- 固定中文字段头
- 金额为不带千分位的两位小数
- 日期为 `YYYY-MM-DD HH:mm:ss`
- 正确转义逗号、双引号和换行

导出字段：

```text
订单号
会员姓名
联系手机号
购卡年限
订单金额
状态
创建时间
备注
最近续卡年限
最近续卡费用
最近续卡时间
```

## Part 5 澄清问题清单

收到“列表页增加导出功能”的需求后，实际开发前应向业务方确认：

1. 导出范围是当前筛选结果的全部订单，还是只导出当前页？
2. 是否存在跨页勾选，导出时应优先勾选订单还是当前筛选结果？
3. 哪些订单状态允许导出，取消订单是否绝对禁止？
4. 禁止导出的订单应跳过、标注异常，还是阻止整个导出？
5. 财务对账需要哪些字段，是否需要手机号、备注和续卡信息？
6. 金额是否包含人民币符号，是否保留千分位和两位小数？
7. 日期使用日期还是完整时间，是否要求指定时区？
8. CSV 文件命名规则是什么？
9. 是否需要记录导出人、导出时间和导出范围？
10. 是否需要限制最大导出数量？
11. 所有登录用户是否都能导出，是否还有角色权限限制？
12. 是否需要兼容 Excel 的中文编码和长数字格式？

## Part 5 实现假设

当前实现基于以下假设：

1. 导出范围跟随当前列表筛选条件。
2. 有跨页勾选时优先导出勾选订单。
3. 除已取消外，其余状态均可导出。
4. 已取消订单默认跳过。
5. 部分订单不可导出时仍导出合法数据，并提示跳过数量。
6. 全部不可导出时不生成文件。
7. 导出字段使用 README 中列出的 11 个字段。
8. CSV 金额使用固定两位小数，不带千分位，便于财务工具解析。
9. 页面仍使用千分位金额展示，CSV 数据不复用页面展示字符串。
10. 日期使用 `YYYY-MM-DD HH:mm:ss`。
11. 文件名使用 `orders_YYYYMMDD_HHmmss.csv`。
12. 使用 UTF-8 BOM，降低 Excel 中文乱码风险。
13. 暂不记录后台审计日志，仅提示导出结果。
14. 导出完全由前端完成，不请求后端。
15. 取消订单后续仍可查询，只是不进入默认导出文件。

## 加分项实现

### 跨页保留勾选

使用订单号作为唯一键保存选中订单快照，不依赖当前页数组，因此翻页后选择不会丢失。

### 自定义 Hook

- `useOrderListQuery` 管理查询条件、分页、请求竞态和刷新。
- `useOrderSelection` 管理跨页选择和写操作后的选择清理。

### 其他工程实践

- 状态、颜色、价格和规则集中配置。
- 模拟接口统一响应结构。
- 批量操作先校验后写入，避免部分成功。
- 请求层统一 401 和业务错误处理。
- CSV 转义、BOM 和下载逻辑独立维护。
- ESLint 和 Prettier 统一代码规范。

## 开发中遇到的最难问题

最难的问题是把多个写操作、列表筛选和跨页勾选统一到同一份可信数据上。

解决过程：

1. 使用模块级 `orderStore` 作为唯一内存数据源。
2. 初始数据通过工厂函数创建，避免写操作污染种子数据。
3. 批量续卡和撤单先完整校验，再统一更新，避免部分成功。
4. 列表 Hook 使用请求序号屏蔽过期响应，避免快速切换时旧数据覆盖新数据。
5. 跨页勾选以订单号为键保存快照，避免依赖当前页的 `dataSource`。
6. 写操作成功后只清理已成功处理的订单选择，保留其他跨页选择。
7. 请求层通过 `feedback.js` 桥接 antd 上下文，解决拦截器无法直接使用 React 组件 API 的问题。

## 开发工具和使用环节

| 工具 | 使用环节 |
| --- | --- |
| Codex | 代码生成、重构、注释修订、接口验证和文档整理 |
| Vite | 项目初始化、开发服务器和生产构建 |
| npm | 依赖安装和脚本执行 |
| React | 页面、组件和 Hook 实现 |
| react-router v7 | 路由、守卫和嵌套布局 |
| Ant Design v5 | 表单、表格、弹窗、菜单和反馈组件 |
| axios | 请求封装和拦截器 |
| axios-mock-adapter | Mock API 拦截和响应 |
| zustand | 登录状态管理 |
| dayjs | 日期格式化和语言配置 |
| ESLint | 静态代码检查 |
| Prettier | 代码格式化 |
| PowerShell | Windows 环境下的命令执行和验证脚本 |

## 已知限制

- 数据只保存在内存中，刷新页面后会重置。
- 登录和接口都是 Mock，不连接真实服务。
- 当前未配置自动化测试脚本。
- 生产构建主包超过 500 kB，存在 Vite 拆包警告。
- 未做完整移动端适配，主要面向桌面后台。
- CSV 导出没有后端审计记录。
- 浏览器禁用 localStorage 时，刷新后会丢失登录态。
- 当前未实现订单详情、审批和订单编辑。

## 后续改进方向

1. 接入 Vitest、Testing Library 和 Playwright。
2. 按路由进行懒加载，拆分 antd 和业务页面。
3. 增加后端接口环境和真实鉴权。
4. 增加权限模型和导出审计。
5. 增加订单详情、状态流转记录和续卡历史。
6. 增加服务端持久化和并发版本控制。
7. 增加移动端和低分辨率适配。
8. 增加可访问性检查和视觉回归测试。

## 提交说明

提交前：

1. 运行 `npm run lint`。
2. 运行 `npm run format:check`。
3. 运行 `npm run build`。
4. 确认未提交 `node_modules` 和 `dist`。
5. 确认 Git 提交历史完整。
6. 将仓库设置为公开。
7. 按笔试要求发送仓库地址和邮件标题。
