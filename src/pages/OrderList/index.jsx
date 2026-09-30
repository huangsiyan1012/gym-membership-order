import { Empty, Typography } from 'antd'

/**
 * 订单列表页占位。
 *
 * M8 开始接入筛选、查询 Hook、表格和分页，本阶段只提供受保护路由出口。
 */
function OrderListPage() {
  return (
    <>
      <Typography.Title level={4}>订单列表</Typography.Title>
      <Empty description="订单列表将在 M8 实现" />
    </>
  )
}

export default OrderListPage
