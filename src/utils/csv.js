import dayjs from 'dayjs'

import { EXPORTABLE_ORDER_STATUSES, getStatusLabel } from '@/constants/order'
import { formatDateTime } from '@/utils/format'

const CSV_LINE_BREAK = '\r\n'
const UTF8_BOM = '\uFEFF'

// 导出金额固定两位小数且不带千分位，避免财务工具解析时出现分列问题。
function formatExportAmount(value) {
  const amount = Number(value)
  const normalizedAmount = Number.isFinite(amount) ? amount : 0

  return normalizedAmount.toFixed(2)
}

function formatExportDateTime(value) {
  return value ? formatDateTime(value) : ''
}

// CSV 字段包含逗号、双引号或换行时，用双引号包裹并转义内部双引号。
function escapeCsvCell(value) {
  const text = value === null || value === undefined ? '' : String(value)
  const needsQuotes = /[",\r\n]/.test(text)

  return needsQuotes ? `"${text.replaceAll('"', '""')}"` : text
}

/**
 * 过滤可导出的订单。
 *
 * 当前业务假设取消订单不进入财务导出，其余状态均允许导出。
 */
export function filterExportableOrders(orders) {
  const exportableStatusSet = new Set(EXPORTABLE_ORDER_STATUSES)

  return orders.filter((order) => exportableStatusSet.has(order.status))
}

/**
 * 将订单数组转换为财务对账 CSV。
 *
 * 返回内容包含 UTF-8 BOM 和 CRLF 换行，便于 Excel 正确识别中文和行结构。
 */
export function createOrdersCsv(orders) {
  const headers = [
    '订单号',
    '会员姓名',
    '联系手机号',
    '购卡年限',
    '订单金额',
    '状态',
    '创建时间',
    '备注',
    '最近续卡年限',
    '最近续卡费用',
    '最近续卡时间',
  ]

  const rows = orders.map((order) => [
    order.orderNo,
    order.memberName,
    order.phone,
    order.purchaseYears,
    formatExportAmount(order.orderAmount),
    getStatusLabel(order.status),
    formatExportDateTime(order.createdAt),
    order.remark ?? '',
    order.lastRenewalYears ?? '',
    order.lastRenewalFee === null || order.lastRenewalFee === undefined
      ? ''
      : formatExportAmount(order.lastRenewalFee),
    formatExportDateTime(order.renewedAt),
  ])

  return (
    UTF8_BOM +
    [headers, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join(CSV_LINE_BREAK) +
    CSV_LINE_BREAK
  )
}

// 生成包含导出时间的文件名，便于财务区分多次导出结果。
export function createOrdersCsvFileName(date = new Date()) {
  return `orders_${dayjs(date).format('YYYYMMDD_HHmmss')}.csv`
}

/**
 * 触发浏览器下载。
 *
 * 使用 Blob 和临时 Object URL，下载完成后主动释放 URL，避免页面内存累积。
 */
export function downloadCsv(content, filename) {
  if (typeof document === 'undefined') {
    return false
  }

  const blob = new Blob([content], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)

  return true
}
