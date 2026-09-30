// 请求层位于 React 组件树之外，这里保存 antd message API 供拦截器调用。
let messageApi = null

/**
 * 注册 antd message API。
 *
 * 由根组件在 AntdApp 上下文内调用；注册后，axios 拦截器可以使用应用统一的
 * 中文环境、主题和消息样式。
 */
export function registerFeedbackApi(api) {
  messageApi = api
}

/**
 * 显示请求错误。
 *
 * 优先使用 antd message；应用尚未完成挂载或单独调用请求层时，开发环境仅输出
 * 控制台日志，避免因缺少 React 上下文导致请求流程中断。
 */
export function showError(content) {
  const message = typeof content === 'string' && content.trim() ? content : '操作失败，请稍后重试'

  if (messageApi) {
    messageApi.error(message)
    return
  }

  if (import.meta.env.DEV) {
    console.error(`[request] ${message}`)
  }
}
