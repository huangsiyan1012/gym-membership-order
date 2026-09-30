import { createInitialOrders } from '@/api/mock/orders'

/**
 * 模拟订单仓储。
 *
 * 数据保存在模块内存中，查询和后续写操作都访问同一份引用。页面刷新会重新加载
 * 模块，因此数据会恢复为初始状态。
 */
let orderStore = createInitialOrders()

// 返回对象副本，避免调用方直接修改仓储中的订单数据。
function cloneOrder(order) {
  return { ...order }
}

// 将分页参数归一化为大于 0 的整数，非法值使用调用方提供的默认值。
function normalizePositiveInteger(value, fallback) {
  const normalizedValue = Number(value)

  return Number.isInteger(normalizedValue) && normalizedValue > 0 ? normalizedValue : fallback
}

// 支持传入单个状态或状态数组，过滤掉空值并统一为数组。
function normalizeStatuses(statuses) {
  if (Array.isArray(statuses)) {
    return statuses.filter(Boolean)
  }

  return statuses ? [statuses] : []
}

/**
 * 查询订单列表。
 *
 * 查询流程固定为：状态筛选 -> 订单号精确匹配 -> 会员姓名模糊匹配 ->
 * 默认按创建时间倒序 -> 分页。返回值中的 list 为副本，total 为筛选后的总数。
 */
export function queryOrders({
  page = 1,
  pageSize = 10,
  statuses,
  orderNo = '',
  memberName = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
} = {}) {
  const normalizedPage = normalizePositiveInteger(page, 1)
  const normalizedPageSize = normalizePositiveInteger(pageSize, 10)
  const normalizedOrderNo = typeof orderNo === 'string' ? orderNo.trim() : ''
  const normalizedMemberName = typeof memberName === 'string' ? memberName.trim() : ''
  const normalizedStatuses = normalizeStatuses(statuses)

  let filteredOrders = [...orderStore]

  if (normalizedStatuses.length > 0) {
    filteredOrders = filteredOrders.filter((order) => normalizedStatuses.includes(order.status))
  }

  if (normalizedOrderNo) {
    filteredOrders = filteredOrders.filter((order) => order.orderNo === normalizedOrderNo)
  }

  if (normalizedMemberName) {
    filteredOrders = filteredOrders.filter((order) =>
      order.memberName.includes(normalizedMemberName),
    )
  }

  const direction = sortOrder === 'asc' ? 1 : -1

  filteredOrders.sort((leftOrder, rightOrder) => {
    if (sortBy !== 'createdAt') {
      return 0
    }

    return (new Date(leftOrder.createdAt) - new Date(rightOrder.createdAt)) * direction
  })

  const startIndex = (normalizedPage - 1) * normalizedPageSize
  const list = filteredOrders.slice(startIndex, startIndex + normalizedPageSize).map(cloneOrder)

  return {
    list,
    total: filteredOrders.length,
    page: normalizedPage,
    pageSize: normalizedPageSize,
  }
}

/**
 * 恢复初始模拟数据。
 *
 * 主要用于测试和开发调试；正常页面刷新时模块重新初始化，也会得到相同结果。
 */
export function resetOrderStore() {
  orderStore = createInitialOrders()

  return orderStore.length
}
