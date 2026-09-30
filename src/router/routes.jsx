import { Navigate } from 'react-router-dom'

import AppLayout from '@/components/AppLayout'
import AuthGuard from '@/components/AuthGuard'
import LoginPage from '@/pages/Login'
import NotFoundPage from '@/pages/NotFound'
import OrderCreatePage from '@/pages/OrderCreate'
import OrderListPage from '@/pages/OrderList'

/**
 * 应用路由配置。
 *
 * 业务页面统一放在 AuthGuard 和 AppLayout 内；Login 与 404 独立于后台布局。
 * 单独导出配置便于验证路由匹配，索引文件只负责创建 BrowserRouter。
 */
export const routes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/orders" replace />,
          },
          {
            path: 'orders',
            element: <OrderListPage />,
          },
          {
            path: 'orders/new',
            element: <OrderCreatePage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
