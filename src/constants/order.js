// 订单状态的完整生命周期。
export const ORDER_STATUS = Object.freeze({
  PENDING_REVIEW: 'PENDING_REVIEW',
  PENDING_CARD: 'PENDING_CARD',
  PENDING_SHIP: 'PENDING_SHIP',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
})

// 状态展示名称集中维护，避免页面和接口层出现不一致文案。
export const ORDER_STATUS_LABELS = Object.freeze({
  [ORDER_STATUS.PENDING_REVIEW]: '待审核',
  [ORDER_STATUS.PENDING_CARD]: '待制卡',
  [ORDER_STATUS.PENDING_SHIP]: '待寄卡',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.EXPIRED]: '已到期',
  [ORDER_STATUS.CANCELLED]: '已取消',
})

// antd Tag 颜色与状态一一对应，供列表页统一展示。
export const ORDER_STATUS_TAG_COLORS = Object.freeze({
  [ORDER_STATUS.PENDING_REVIEW]: 'processing',
  [ORDER_STATUS.PENDING_CARD]: 'cyan',
  [ORDER_STATUS.PENDING_SHIP]: 'geekblue',
  [ORDER_STATUS.COMPLETED]: 'success',
  [ORDER_STATUS.EXPIRED]: 'warning',
  [ORDER_STATUS.CANCELLED]: 'default',
})

// “进行中”是列表页筛选分组，而非独立订单状态。
export const IN_PROGRESS_ORDER_STATUSES = Object.freeze([
  ORDER_STATUS.PENDING_REVIEW,
  ORDER_STATUS.PENDING_CARD,
  ORDER_STATUS.PENDING_SHIP,
])

// Tab 的 statuses 为空表示不限制状态，否则按集合进行筛选。
export const ORDER_STATUS_TABS = Object.freeze([
  {
    key: 'ALL',
    label: '全部',
    statuses: null,
  },
  {
    key: 'IN_PROGRESS',
    label: '进行中',
    statuses: IN_PROGRESS_ORDER_STATUSES,
  },
  {
    key: ORDER_STATUS.EXPIRED,
    label: ORDER_STATUS_LABELS[ORDER_STATUS.EXPIRED],
    statuses: [ORDER_STATUS.EXPIRED],
  },
  {
    key: ORDER_STATUS.COMPLETED,
    label: ORDER_STATUS_LABELS[ORDER_STATUS.COMPLETED],
    statuses: [ORDER_STATUS.COMPLETED],
  },
  {
    key: ORDER_STATUS.CANCELLED,
    label: ORDER_STATUS_LABELS[ORDER_STATUS.CANCELLED],
    statuses: [ORDER_STATUS.CANCELLED],
  },
])

// 对未知状态保留原始值，避免接口异常数据导致页面显示为空。
export function getStatusLabel(status) {
  return ORDER_STATUS_LABELS[status] ?? status ?? '-'
}

// 未定义状态统一使用 antd 默认 Tag 颜色。
export function getStatusColor(status) {
  return ORDER_STATUS_TAG_COLORS[status] ?? 'default'
}
