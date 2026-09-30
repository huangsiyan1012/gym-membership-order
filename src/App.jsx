import { App as AntdApp, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

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
