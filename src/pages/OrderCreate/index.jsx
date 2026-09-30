import { Empty, Typography } from 'antd'

/**
 * 新建订单页占位。
 *
 * M12 开始实现完整表单、校验和提交逻辑，本阶段只建立访问入口。
 */
function OrderCreatePage() {
  return (
    <>
      <Typography.Title level={4}>新建订单</Typography.Title>
      <Empty description="新建订单表单将在 M12 实现" />
    </>
  )
}

export default OrderCreatePage
