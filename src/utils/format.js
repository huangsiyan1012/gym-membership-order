import dayjs from 'dayjs'

const amountFormatter = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

// 接口可能返回 null、空字符串或非法值，统一按 0 处理。
function normalizeAmount(value) {
  const amount = Number(value)

  return Number.isFinite(amount) ? amount : 0
}

// 页面金额统一显示千分位和两位小数，例如 12,000.00。
export function formatAmount(value) {
  return amountFormatter.format(normalizeAmount(value))
}

// 创建时间等日期字段统一使用该格式，空值和非法日期显示为短横线。
export function formatDateTime(value) {
  if (!value) {
    return '-'
  }

  const date = dayjs(value)

  return date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : '-'
}
