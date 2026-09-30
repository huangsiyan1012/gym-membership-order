import { create } from 'zustand'

export const AUTH_STORAGE_KEYS = Object.freeze({
  token: 'gym_orders_token',
  username: 'gym_orders_username',
})

// SSR 和单元测试环境没有 localStorage，所有存储访问都通过安全方法完成。
function getStorage() {
  return typeof window !== 'undefined' ? window.localStorage : null
}

function readStorageValue(key) {
  try {
    return getStorage()?.getItem(key) ?? ''
  } catch {
    return ''
  }
}

function writeStorageValue(key, value) {
  try {
    const storage = getStorage()

    if (value) {
      storage?.setItem(key, value)
    } else {
      storage?.removeItem(key)
    }
  } catch {
    // 浏览器禁用存储时仍保留内存登录态，避免整个应用不可用。
  }
}

/**
 * 登录状态管理。
 *
 * zustand 负责页面实时读取登录态，localStorage 负责刷新页面后的恢复。退出登录
 * 和 401 处理都会同时清理这两处状态。
 */
export const useAuthStore = create((set) => ({
  token: readStorageValue(AUTH_STORAGE_KEYS.token),
  username: readStorageValue(AUTH_STORAGE_KEYS.username),
  isAuthenticated: Boolean(readStorageValue(AUTH_STORAGE_KEYS.token)),

  /**
   * 模拟登录。
   *
   * 表单层负责非空校验，这里接受任意账号密码并生成 mock token。
   */
  login({ username } = {}) {
    const normalizedUsername = typeof username === 'string' ? username.trim() : ''
    const token = `mock-token-${Date.now()}`

    writeStorageValue(AUTH_STORAGE_KEYS.token, token)
    writeStorageValue(AUTH_STORAGE_KEYS.username, normalizedUsername)
    set({
      token,
      username: normalizedUsername,
      isAuthenticated: true,
    })

    return token
  },

  // 清除内存状态和持久化信息，供退出登录和 401 处理复用。
  logout() {
    writeStorageValue(AUTH_STORAGE_KEYS.token, '')
    writeStorageValue(AUTH_STORAGE_KEYS.username, '')
    set({
      token: '',
      username: '',
      isAuthenticated: false,
    })
  },

  // 从 localStorage 重新同步状态，供应用启动或特殊恢复场景调用。
  hydrate() {
    const token = readStorageValue(AUTH_STORAGE_KEYS.token)
    const username = readStorageValue(AUTH_STORAGE_KEYS.username)

    set({
      token,
      username,
      isAuthenticated: Boolean(token),
    })
  },
}))
