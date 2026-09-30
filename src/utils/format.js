import dayjs from 'dayjs'

const amountFormatter = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * 将接口金额转为可安全展示的数字。
 *
 * null、空字符串、NaN、Infinity 等异常值统一按 0 处理，避免页面出现空值或 NaN。
 */
function normalizeAmount(value) {
  const amount = Number(value)

  return Number.isFinite(amount) ? amount : 0
}

/**
 * 格式化页面金额。
 *
 * 输出固定两位小数和千分位，例如 12000 会显示为 12,000.00，
 * 0 和空值会显示为 0.00。
 */
export function formatAmount(value) {
  return amountFormatter.format(normalizeAmount(value))
}

/**
 * 格式化日期时间。
 *
 * 创建时间等字段统一显示为 YYYY-MM-DD HH:mm:ss，空值和非法日期使用 "-"。
 */
export function formatDateTime(value) {
  if (!value) {
    return '-'
  }

  const date = dayjs(value)

  return date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : '-'
}
