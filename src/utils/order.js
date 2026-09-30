import {
  MAX_PURCHASE_YEARS,
  MIN_PURCHASE_YEARS,
  ORDER_PRICE_PER_YEAR,
  RENEWAL_DISCOUNT_MIN_YEARS,
  RENEWAL_DISCOUNT_RATE,
} from '@/constants/pricing'
import dayjs from 'dayjs'

let orderSequence = 0

// 仅对 1 到 10 的整数年限计算费用，非法输入返回 0。
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

// 毫秒时间戳加自增序号，避免同一毫秒内连续创建订单时订单号重复。
export function generateOrderNo(date = new Date()) {
  const timestamp = dayjs(date).format('YYYYMMDDHHmmssSSS')
  orderSequence = (orderSequence + 1) % 1000

  return `ORD${timestamp}${String(orderSequence).padStart(3, '0')}`
}
