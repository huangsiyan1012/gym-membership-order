import { Tag } from 'antd'

import { getStatusColor, getStatusLabel } from '@/constants/order'

/**
 * 订单状态标签。
 *
 * 页面只传入状态值，文案和颜色统一由 order 常量决定，避免不同页面展示不一致。
 */
function StatusTag({ status }) {
  return <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
}

export default StatusTag
