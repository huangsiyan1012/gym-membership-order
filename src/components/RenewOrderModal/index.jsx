import { App as AntdApp, Form, InputNumber, Modal, Typography } from 'antd'
import { useState } from 'react'

import { renewOrder } from '@/api/order'
import { MAX_PURCHASE_YEARS, MIN_PURCHASE_YEARS } from '@/constants/pricing'
import { formatAmount } from '@/utils/format'
import { calculateRenewalFee } from '@/utils/order'

/**
 * 续卡弹窗。
 *
 * 单条续卡和批量续卡共用该组件。组件只负责年限校验、费用实时展示和提交，
 * 成功后的列表刷新及选择清理由调用方处理。
 */
function RenewOrderModal({ open, orders, onCancel, onSuccess }) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const renewalYears = Form.useWatch('renewalYears', form)
  const renewalFee = calculateRenewalFee(renewalYears)
  const { message } = AntdApp.useApp()

  async function handleSubmit(values) {
    setSubmitting(true)

    try {
      const updatedOrders = await renewOrder({
        orderNos: orders.map((order) => order.orderNo),
        renewalYears: Number(values.renewalYears),
      })

      message.success(`已完成 ${updatedOrders.length} 条订单续卡`)
      form.resetFields()
      onSuccess(updatedOrders)
    } catch {
      // 响应拦截器已统一展示接口错误，弹窗保持打开方便用户修改。
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="订单续卡"
      open={open}
      okText="确认续卡"
      cancelText="取消"
      confirmLoading={submitting}
      destroyOnHidden
      afterClose={() => form.resetFields()}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Typography.Paragraph>
        本次将续卡 {orders.length} 条订单，单次续卡满 5 年享受 8 折。
      </Typography.Paragraph>
      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit}>
        <Form.Item
          label="续卡年限"
          name="renewalYears"
          rules={[
            {
              required: true,
              message: '请输入续卡年限',
            },
            {
              type: 'integer',
              min: MIN_PURCHASE_YEARS,
              max: MAX_PURCHASE_YEARS,
              message: '续卡年限需为 1 到 10 的整数',
            },
          ]}
        >
          <InputNumber
            min={MIN_PURCHASE_YEARS}
            max={MAX_PURCHASE_YEARS}
            precision={0}
            placeholder="请输入 1 到 10 的整数"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <div>
          应付费用：
          <Typography.Text strong>{formatAmount(renewalFee)}</Typography.Text>
        </div>
      </Form>
    </Modal>
  )
}

export default RenewOrderModal
