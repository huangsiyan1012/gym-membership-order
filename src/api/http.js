import axios from 'axios'

import { setupMockServer } from '@/api/mock'
import { useAuthStore } from '@/store/authStore'
import { showError } from '@/utils/feedback'

/**
 * 业务请求统一使用的 axios 实例。
 *
 * baseURL 从环境变量读取，经过此实例的请求会依次执行 token 注入、模拟接口匹配
 * 和统一响应处理。后续接入真实后端时，只需移除 setupMockServer 调用。
 */
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

setupMockServer(httpClient)

// 从 zustand 当前状态读取 token，保证登录、退出和刷新恢复后的值始终一致。
httpClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// 401 后回到登录页，但不重复处理已经位于登录页的情况。
function handleUnauthorized() {
  useAuthStore.getState().logout()

  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.assign('/login')
  }
}

httpClient.interceptors.response.use(
  (response) => {
    const responseBody = response.data

    // 业务错误使用 HTTP 200 返回，拦截器根据 code 统一拒绝并提示。
    if (responseBody?.code !== 0) {
      const errorMessage = responseBody?.message || '请求失败，请稍后重试'

      showError(errorMessage)
      return Promise.reject(new Error(errorMessage))
    }

    return responseBody.data
  },
  (error) => {
    const status = error.response?.status
    const errorMessage =
      error.response?.data?.message ||
      (status === 401 ? '登录状态已失效' : error.message || '网络异常，请稍后重试')

    if (status === 401) {
      handleUnauthorized()
    }

    showError(errorMessage)

    return Promise.reject(error)
  },
)
