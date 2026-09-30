import MockAdapter from 'axios-mock-adapter'

import { IN_PROGRESS_ORDER_STATUSES } from '@/constants/order'

import {
  cancelOrders,
  createOrder,
  queryOrders,
  renewOrders,
} from './orderStore'

const SUCCESS_CODE = 0
const BUSINESS_ERROR_CODE = 400

function successResponse(data) {
  return {
    code: SUCCESS_CODE,
    message: 'success',
    data,
  }
}

function businessErrorResponse(error) {
  return {
    code: BUSINESS_ERROR_CODE,
    message: error instanceof Error ? error.message : '操作失败，请稍后重试',
    data: null,
  }
}

// axios 不同版本和适配器下请求头访问方式不同，这里统一读取 Authorization。
function getAuthorizationHeader(config) {
  const headers = config.headers ?? {}

  if (typeof headers.get === 'function') {
    return headers.get('Authorization')
  }

  return headers.Authorization ?? headers.authorization
}

function hasValidToken(config) {
  const authorization = getAuthorizationHeader(config)

  return (
    typeof authorization === 'string' && authorization.startsWith('Bearer ')
  )
}

// mock adapter 可能收到字符串或对象请求体，解析失败时返回空对象交给业务校验处理。
function parseRequestBody(config) {
  if (!config.data) {
    return {}
  }

  if (typeof config.data === 'object') {
    return config.data
  }

  try {
    return JSON.parse(config.data)
  } catch {
    return {}
  }
}

// 将列表页筛选参数转换为仓储可识别的状态集合。
function resolveQueryStatuses(params = {}) {
  if (params.statusGroup === 'IN_PROGRESS') {
    return IN_PROGRESS_ORDER_STATUSES
  }

  if (params.statuses) {
    return params.statuses
  }

  return params.status
}

/**
 * 为指定 axios 实例注册模拟接口。
 *
 * axios 实例与拦截器中完成。未知请求默认继续走真实网络。
 */
export function setupMockServer(httpClient, { delayResponse = 300 } = {}) {
  const mock = new MockAdapter(httpClient, {
    delayResponse,
    onNoMatch: 'passthrough',
  })

  mock.onGet(/\/orders$/).reply((config) => {
    if (!hasValidToken(config)) {
      return [401, { code: 401, message: '登录状态已失效', data: null }]
    }

    const params = config.params ?? {}

    return [
      200,
      successResponse(
        queryOrders({
          ...params,
          statuses: resolveQueryStatuses(params),
        }),
      ),
    ]
  })

  mock.onPost(/\/orders$/).reply((config) => {
    if (!hasValidToken(config)) {
      return [401, { code: 401, message: '登录状态已失效', data: null }]
    }

    try {
      return [200, successResponse(createOrder(parseRequestBody(config)))]
    } catch (error) {
      return [200, businessErrorResponse(error)]
    }
  })

  mock.onPost(/\/orders\/renew$/).reply((config) => {
    if (!hasValidToken(config)) {
      return [401, { code: 401, message: '登录状态已失效', data: null }]
    }

    try {
      return [200, successResponse(renewOrders(parseRequestBody(config)))]
    } catch (error) {
      return [200, businessErrorResponse(error)]
    }
  })

  mock.onPost(/\/orders\/cancel$/).reply((config) => {
    if (!hasValidToken(config)) {
      return [401, { code: 401, message: '登录状态已失效', data: null }]
    }

    try {
      return [200, successResponse(cancelOrders(parseRequestBody(config)))]
    } catch (error) {
      return [200, businessErrorResponse(error)]
    }
  })

  return mock
}
