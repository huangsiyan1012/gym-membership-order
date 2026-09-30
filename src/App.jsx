import { useEffect } from 'react'
import { App as AntdApp, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

import { registerFeedbackApi } from '@/utils/feedback'

// 在应用启动前设置 dayjs 中文规则，日期组件的周起始日和月份名称才会一致。
dayjs.locale('zh-cn')

/**
 * 将 antd 上下文中的 message API 注册给请求层。
 *
 * axios 拦截器运行在 React 组件树之外，无法直接使用 useApp；通过这里的注册桥接，
 * 请求错误才能使用与当前应用主题、语言一致的 message 提示。
 */
function AppContent() {
  const { message } = AntdApp.useApp()

  useEffect(() => {
    registerFeedbackApi(message)
  }, [message])

  return (
    <main className="app-shell">
      <h1>健身房会员办卡订单管理</h1>
      <p>项目基础环境已就绪。</p>
    </main>
  )
}

/**
 * 应用根组件。
 *
 * ConfigProvider 提供 antd 的中文文案，AntdApp 提供 message、Modal 和
 * notification 所需上下文；后续路由页面统一挂在 AntdApp 内部。
 */
function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AntdApp>
        <AppContent />
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
