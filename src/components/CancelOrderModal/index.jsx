import { App as AntdApp, Modal, Typography } from 'antd'
import { useState } from 'react'

import { cancelOrder } from '@/api/order'

import styles from './index.module.css'

/**
 * 批量撤单确认框。
 *
 * 展示全部将被撤销的订单号，用户确认后调用模拟接口。提交成功由调用方负责
 * 刷新列表和清理选择；失败时保持弹窗打开，方便用户重试。
 */
function CancelOrderModal({ open, orders, onCancel, onSuccess }) {
  const [submitting, setSubmitting] = useState(false)
  const { message } = AntdApp.useApp()

  async function handleConfirm() {
    setSubmitting(true)

    try {
      const cancelledOrders = await cancelOrder({
        orderNos: orders.map((order) => order.orderNo),
      })

      message.success(`已撤销 ${cancelledOrders.length} 条订单`)
      onSuccess(cancelledOrders)
    } catch {
      // 请求拦截器已经展示接口错误，保留弹窗便于用户重新确认。
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="确认撤单"
      open={open}
      okText="确认撤单"
      cancelText="取消"
      okButtonProps={{ danger: true }}
      confirmLoading={submitting}
      destroyOnHidden
      onCancel={onCancel}
      onOk={handleConfirm}
    >
      <Typography.Paragraph>以下订单将被撤销，请确认：</Typography.Paragraph>
      <ul className={styles.orderList}>
        {orders.map((order) => (
          <li key={order.orderNo}>{order.orderNo}</li>
        ))}
      </ul>
      <Typography.Text type="warning">撤单后订单状态将变为“已取消”。</Typography.Text>
    </Modal>
  )
}

export default CancelOrderModal
