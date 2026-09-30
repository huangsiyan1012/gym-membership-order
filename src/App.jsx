import { App as AntdApp, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// 在应用启动前设置 dayjs 中文规则，日期组件的周起始日和月份名称才会一致。
dayjs.locale('zh-cn')

/**
 * 应用根组件。
 *
 * ConfigProvider 负责 antd 组件文案和全局主题，AntdApp 提供 message、Modal、
 * notification 等组件的上下文容器。后续路由页面统一挂在 AntdApp 内部。
 */
function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AntdApp>
        <main className="app-shell">
          <h1>健身房会员办卡订单管理</h1>
          <p>项目基础环境已就绪。</p>
        </main>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
