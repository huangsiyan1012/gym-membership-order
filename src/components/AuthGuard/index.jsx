import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuthStore } from '@/store/authStore'

/**
 * 受保护路由守卫。
 *
 * 未登录用户会被替换到登录页，同时记录原目标路径，后续登录页可按需回跳。
 * 已登录用户直接渲染子路由，守卫本身不负责页面布局。
 */
function AuthGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: `${location.pathname}${location.search}`,
        }}
      />
    )
  }

  return <Outlet />
}

export default AuthGuard
