import { Navigate } from 'react-router-dom'
import { Typography } from 'antd'

import { useAuthStore } from '@/store/authStore'

/**
 * 登录页占位。
 *
 * M7 会在此实现账号密码表单和登录提交；已登录用户访问时直接进入订单列表。
 */
function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/orders" replace />
  }

  return (
    <main style={{ padding: 48 }}>
      <Typography.Title level={3}>登录页</Typography.Title>
      <Typography.Paragraph>登录表单将在 M7 实现。</Typography.Paragraph>
    </main>
  )
}

export default LoginPage
