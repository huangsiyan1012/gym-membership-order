import { App as AntdApp, Button, Form, Input, InputNumber, Space, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createOrder as createOrderRequest } from '@/api/order'
import { MAX_PURCHASE_YEARS, MIN_PURCHASE_YEARS, ORDER_PRICE_PER_YEAR } from '@/constants/pricing'
import { formatAmount } from '@/utils/format'
import { isValidMemberName, isValidPhone } from '@/utils/validators'

import styles from './index.module.css'

/**
 * 新建订单页。
 *
 * 表单只提交会员信息，订单号、订单金额、状态和时间由模拟接口生成。购卡费用
 * 根据年限实时展示，但不作为可编辑字段提交。
 */
function OrderCreatePage() {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { message } = AntdApp.useApp()
  const purchaseYears = Form.useWatch('purchaseYears', form)
  const orderAmount =
    Number.isInteger(purchaseYears) && purchaseYears > 0 ? purchaseYears * ORDER_PRICE_PER_YEAR : 0

  /**
   * 提交订单。
   *
   * 请求成功后跳回订单列表，列表重新挂载时会查询最新内存数据，因此新订单可以
   * 立即出现在列表中。失败时保留当前表单，方便用户修改后重试。
   */
  async function handleSubmit(values) {
    setSubmitting(true)

    try {
      const order = await createOrderRequest({
        memberName: values.memberName.trim(),
        phone: values.phone.trim(),
        purchaseYears: Number(values.purchaseYears),
        remark: values.remark?.trim() ?? '',
      })

      message.success(`订单 ${order.orderNo} 创建成功`)
      navigate('/orders', { replace: true })
    } catch {
      // 响应拦截器已展示具体错误，这里保留表单供用户修改。
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Typography.Title level={4}>新建订单</Typography.Title>
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        className={styles.form}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="会员姓名"
          name="memberName"
          rules={[
            {
              required: true,
              message: '请输入会员姓名',
            },
            {
              validator: (_, value) =>
                isValidMemberName(value)
                  ? Promise.resolve()
                  : Promise.reject(new Error('会员姓名需为 2 到 30 个字符')),
            },
          ]}
        >
          <Input maxLength={30} placeholder="请输入会员姓名" />
        </Form.Item>
        <Form.Item
          label="联系手机号"
          name="phone"
          rules={[
            {
              required: true,
              message: '请输入联系手机号',
            },
            {
              validator: (_, value) =>
                isValidPhone(value)
                  ? Promise.resolve()
                  : Promise.reject(new Error('请输入正确的手机号')),
            },
          ]}
        >
          <Input maxLength={11} placeholder="请输入 11 位手机号" />
        </Form.Item>
        <Form.Item
          label="购卡年限"
          name="purchaseYears"
          rules={[
            {
              required: true,
              message: '请输入购卡年限',
            },
            {
              type: 'integer',
              min: MIN_PURCHASE_YEARS,
              max: MAX_PURCHASE_YEARS,
              message: '购卡年限需为 1 到 10 的整数',
            },
          ]}
        >
          <InputNumber
            min={MIN_PURCHASE_YEARS}
            max={MAX_PURCHASE_YEARS}
            precision={0}
            placeholder="请输入 1 到 10 的整数"
            className={styles.inputNumber}
          />
        </Form.Item>
        <Form.Item label="办卡费用">
          <Input readOnly value={formatAmount(orderAmount)} />
        </Form.Item>
        <Form.Item
          label="备注"
          name="remark"
          rules={[
            {
              max: 200,
              message: '备注不能超过 200 个字符',
            },
          ]}
        >
          <Input.TextArea rows={4} maxLength={200} showCount placeholder="请输入备注（选填）" />
        </Form.Item>
        <Form.Item className={styles.actions}>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              提交订单
            </Button>
            <Button disabled={submitting} onClick={() => navigate('/orders')}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default OrderCreatePage
