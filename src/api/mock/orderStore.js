import { createInitialOrders } from '@/api/mock/orders'
import { ORDER_STATUS } from '@/constants/order'
import { MAX_PURCHASE_YEARS, MIN_PURCHASE_YEARS, ORDER_PRICE_PER_YEAR } from '@/constants/pricing'
import { calculateRenewalFee, generateOrderNo } from '@/utils/order'
import { isValidMemberName, isValidPhone } from '@/utils/validators'
import dayjs from 'dayjs'

/**
 * 模拟订单仓储。
 *
 * 数据保存在模块内存中，查询和后续写操作都访问同一份引用。页面刷新会重新加载
 * 模块，因此数据会恢复为初始状态。
 */
let orderStore = createInitialOrders()
let createdOrderSequence = 0

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

// 生成仅用于前端模拟数据的内部订单 ID，避免与新订单创建时间冲突。
function createOrderId() {
  createdOrderSequence += 1

  return `mock-order-created-${Date.now()}-${createdOrderSequence}`
}

// 统一校验订单号数组，并去除重复订单号，保证批量操作按唯一集合执行。
function normalizeOrderNos(orderNos) {
  if (!Array.isArray(orderNos)) {
    throw new Error('请选择需要操作的订单')
  }

  const normalizedOrderNos = [...new Set(orderNos.filter(Boolean))]

  if (normalizedOrderNos.length === 0) {
    throw new Error('请选择需要操作的订单')
  }

  return normalizedOrderNos
}

// 查找批量操作目标；存在无效订单号时直接报错，避免部分更新。
function findOrdersByNos(orderNos) {
  const orderMap = new Map(orderStore.map((order) => [order.orderNo, order]))
  const missingOrderNos = orderNos.filter((orderNo) => !orderMap.has(orderNo))

  if (missingOrderNos.length > 0) {
    throw new Error(`以下订单不存在：${missingOrderNos.join('、')}`)
  }

  return orderNos.map((orderNo) => orderMap.get(orderNo))
}

// 校验新建订单参数，错误信息可直接用于模拟接口响应和页面提示。
function validateCreateOrderPayload({ memberName, phone, purchaseYears, remark }) {
  if (!isValidMemberName(memberName)) {
    throw new Error('会员姓名需为 2 到 30 个字符')
  }

  if (!isValidPhone(phone)) {
    throw new Error('请输入正确的手机号')
  }

  const normalizedYears = Number(purchaseYears)

  if (
    !Number.isInteger(normalizedYears) ||
    normalizedYears < MIN_PURCHASE_YEARS ||
    normalizedYears > MAX_PURCHASE_YEARS
  ) {
    throw new Error('购卡年限需为 1 到 10 的整数')
  }

  if (typeof remark === 'string' && remark.length > 200) {
    throw new Error('备注不能超过 200 个字符')
  }

  return normalizedYears
}

/**
 * 新建订单。
 *
 * 订单金额由模拟接口按购卡年限重新计算，不信任客户端传入金额。新订单固定进入
 * 待审核状态，并写入内存仓储头部，后续列表查询可以立即读取。
 */
export function createOrder(payload) {
  const purchaseYears = validateCreateOrderPayload(payload)
  const createdAt = dayjs().format()
  const order = {
    id: createOrderId(),
    orderNo: generateOrderNo(createdAt),
    memberName: payload.memberName.trim(),
    phone: payload.phone.trim(),
    purchaseYears,
    orderAmount: purchaseYears * ORDER_PRICE_PER_YEAR,
    status: ORDER_STATUS.PENDING_REVIEW,
    createdAt,
    updatedAt: createdAt,
    remark: typeof payload.remark === 'string' ? payload.remark.trim() : '',
    lastRenewalYears: null,
    lastRenewalFee: null,
    renewedAt: null,
  }

  orderStore.unshift(order)

  return cloneOrder(order)
}

/**
 * 批量续卡。
 *
 * 只有已到期订单可以续卡。所有目标订单校验通过后才统一更新，避免批量操作出现
 * 部分成功；续卡后购卡年限累加，状态回到待审核。
 */
export function renewOrders({ orderNos, renewalYears }) {
  const normalizedOrderNos = normalizeOrderNos(orderNos)
  const normalizedYears = Number(renewalYears)

  if (
    !Number.isInteger(normalizedYears) ||
    normalizedYears < MIN_PURCHASE_YEARS ||
    normalizedYears > MAX_PURCHASE_YEARS
  ) {
    throw new Error('续卡年限需为 1 到 10 的整数')
  }

  const targetOrders = findOrdersByNos(normalizedOrderNos)
  const invalidOrderNos = targetOrders
    .filter((order) => order.status !== ORDER_STATUS.EXPIRED)
    .map((order) => order.orderNo)

  if (invalidOrderNos.length > 0) {
    throw new Error(`以下订单不满足续卡条件：${invalidOrderNos.join('、')}`)
  }

  const renewedAt = dayjs().format()
  const renewalFee = calculateRenewalFee(normalizedYears)

  targetOrders.forEach((order) => {
    order.purchaseYears += normalizedYears
    order.status = ORDER_STATUS.PENDING_REVIEW
    order.lastRenewalYears = normalizedYears
    order.lastRenewalFee = renewalFee
    order.renewedAt = renewedAt
    order.updatedAt = renewedAt
  })

  return targetOrders.map(cloneOrder)
}

/**
 * 批量撤单。
 *
 * 只有待制卡和待寄卡订单可以撤销。所有订单先完成状态校验，再统一更新状态，
 * 避免出现部分订单已撤销、部分订单仍保留原状态。
 */
export function cancelOrders({ orderNos }) {
  const normalizedOrderNos = normalizeOrderNos(orderNos)
  const targetOrders = findOrdersByNos(normalizedOrderNos)
  const cancellableStatuses = [ORDER_STATUS.PENDING_CARD, ORDER_STATUS.PENDING_SHIP]
  const invalidOrderNos = targetOrders
    .filter((order) => !cancellableStatuses.includes(order.status))
    .map((order) => order.orderNo)

  if (invalidOrderNos.length > 0) {
    throw new Error(`以下订单不满足撤单条件：${invalidOrderNos.join('、')}`)
  }

  const updatedAt = dayjs().format()

  targetOrders.forEach((order) => {
    order.status = ORDER_STATUS.CANCELLED
    order.updatedAt = updatedAt
  })

  return targetOrders.map(cloneOrder)
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
