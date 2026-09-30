import { httpClient } from '@/api/http'

/**
 * 查询订单列表。
 *
 * params 支持 page、pageSize、status/statuses/statusGroup、orderNo、
 * memberName、sortBy 和 sortOrder。响应拦截器已解包，直接返回分页对象。
 */
export function getOrderList(params) {
  return httpClient.get('/orders', { params })
}

/**
 * 新建订单。
 *
 * 请求体只提交会员姓名、手机号、购卡年限和备注；金额、状态、订单号均由
 * 模拟接口生成。
 */
export function createOrder(payload) {
  return httpClient.post('/orders', payload)
}

/**
 * 批量续卡。
 *
 * payload 格式为 { orderNos, renewalYears }，后端负责状态校验、费用计算和
 * 整批原子更新。
 */
export function renewOrder(payload) {
  return httpClient.post('/orders/renew', payload)
}

/**
 * 批量撤单。
 *
 * payload 格式为 { orderNos }，后端负责可撤状态校验和整批原子更新。
 */
export function cancelOrder(payload) {
  return httpClient.post('/orders/cancel', payload)
}
