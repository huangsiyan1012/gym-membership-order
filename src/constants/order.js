/**
 * 订单状态枚举。
 *
 * 所有接口、筛选、写操作和页面展示都只能使用这里的值，避免出现字符串拼写不一致。
 */
export const ORDER_STATUS = Object.freeze({
  PENDING_REVIEW: 'PENDING_REVIEW',
  PENDING_CARD: 'PENDING_CARD',
  PENDING_SHIP: 'PENDING_SHIP',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
})

// 状态到中文文案的映射，页面不直接硬编码状态名称。
export const ORDER_STATUS_LABELS = Object.freeze({
  [ORDER_STATUS.PENDING_REVIEW]: '待审核',
  [ORDER_STATUS.PENDING_CARD]: '待制卡',
  [ORDER_STATUS.PENDING_SHIP]: '待寄卡',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.EXPIRED]: '已到期',
  [ORDER_STATUS.CANCELLED]: '已取消',
})

// 状态到 antd Tag 颜色的映射，保证列表页状态展示一致。
export const ORDER_STATUS_TAG_COLORS = Object.freeze({
  [ORDER_STATUS.PENDING_REVIEW]: 'processing',
  [ORDER_STATUS.PENDING_CARD]: 'cyan',
  [ORDER_STATUS.PENDING_SHIP]: 'geekblue',
  [ORDER_STATUS.COMPLETED]: 'success',
  [ORDER_STATUS.EXPIRED]: 'warning',
  [ORDER_STATUS.CANCELLED]: 'default',
})

// “进行中”是列表页筛选分组，并非独立订单状态，包含待审核、待制卡、待寄卡。
export const IN_PROGRESS_ORDER_STATUSES = Object.freeze([
  ORDER_STATUS.PENDING_REVIEW,
  ORDER_STATUS.PENDING_CARD,
  ORDER_STATUS.PENDING_SHIP,
])

/**
 * 列表页状态 Tab 配置。
 *
 * statuses 为 null 时查询全部状态；否则查询时按数组中的状态集合过滤。
 */
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

/**
 * 获取状态中文文案。
 *
 * 已知状态返回配置文案；未知状态回退为接口原始值，便于定位异常数据。
 */
export function getStatusLabel(status) {
  return ORDER_STATUS_LABELS[status] ?? status ?? '-'
}

// 获取状态对应的 antd Tag 颜色，未知状态使用 default 兜底。
export function getStatusColor(status) {
  return ORDER_STATUS_TAG_COLORS[status] ?? 'default'
}
