import {
  MAX_PURCHASE_YEARS,
  MIN_PURCHASE_YEARS,
  ORDER_PRICE_PER_YEAR,
  RENEWAL_DISCOUNT_MIN_YEARS,
  RENEWAL_DISCOUNT_RATE,
} from '@/constants/pricing'
import dayjs from 'dayjs'

let orderSequence = 0

/**
 * 计算单次续卡费用。
 *
 * 年限必须为 1 到 10 的整数；少于 5 年按原价，达到 5 年按 8 折。
 * 非法输入返回 0，实际表单仍需先完成校验。
 */
export function calculateRenewalFee(years) {
  const normalizedYears = Number(years)
  const isValidYears =
    Number.isInteger(normalizedYears) &&
    normalizedYears >= MIN_PURCHASE_YEARS &&
    normalizedYears <= MAX_PURCHASE_YEARS

  if (!isValidYears) {
    return 0
  }

  const originalFee = normalizedYears * ORDER_PRICE_PER_YEAR
  const finalFee =
    normalizedYears >= RENEWAL_DISCOUNT_MIN_YEARS
      ? originalFee * RENEWAL_DISCOUNT_RATE
      : originalFee

  return Number(finalFee.toFixed(2))
}

/**
 * 生成模拟订单号。
 *
 * 使用毫秒时间戳和模块内自增序号，降低快速连续创建时订单号冲突的概率。
 * 页面刷新后序号会重置，这符合当前内存模拟数据的生命周期。
 */
export function generateOrderNo(date = new Date()) {
  const timestamp = dayjs(date).format('YYYYMMDDHHmmssSSS')
  orderSequence = (orderSequence + 1) % 1000

  return `ORD${timestamp}${String(orderSequence).padStart(3, '0')}`
}
