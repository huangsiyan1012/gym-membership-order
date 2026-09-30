import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css'

import App from '@/App'
import './index.css'

// 页面入口：加载全局样式和 antd reset，并将根组件挂载到 index.html 的 #root。
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
