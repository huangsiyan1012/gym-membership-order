import { useState } from 'react'
import { App as AntdApp, Button, Form, Input, Typography } from 'antd'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/store/authStore'

import styles from './index.module.css'

/**
 * 登录页。
 *
 * 本阶段使用模拟登录：账号和密码只做非空校验，提交后由 authStore 生成
 * mock token。登录成功后优先回到进入登录页前的受保护地址。
 */
function LoginPage() {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const login = useAuthStore((state) => state.login)
  const { message } = AntdApp.useApp()

  if (isAuthenticated) {
    return <Navigate to="/orders" replace />
  }

  const requestedPath = location.state?.from
  const redirectPath =
    typeof requestedPath === 'string' && requestedPath.startsWith('/') ? requestedPath : '/orders'

  /**
   * 提交模拟登录。
   *
   * Form 在进入本方法前已经完成非空校验；登录动作本身是同步的内存状态更新，
   * 这里使用 async 方法保证提交始终经过统一成功和清理流程。
   */
  async function handleSubmit(values) {
    setSubmitting(true)

    try {
      login({
        username: values.username,
      })
      message.success('登录成功')
      navigate(redirectPath, { replace: true })
    } finally {
      setSubmitting(false)
      form.setFieldsValue({
        password: '',
      })
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.brand}>健身房会员管理</div>
        <Typography.Title level={3} className={styles.title}>
          登录后台
        </Typography.Title>
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          autoComplete="off"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[
              {
                required: true,
                whitespace: true,
                message: '请输入账号',
              },
            ]}
          >
            <Input size="large" placeholder="请输入账号" autoComplete="username" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                whitespace: true,
                message: '请输入密码',
              },
            ]}
          >
            <Input.Password size="large" placeholder="请输入密码" autoComplete="current-password" />
          </Form.Item>
          <Form.Item className={styles.submitItem}>
            <Button type="primary" htmlType="submit" size="large" block loading={submitting}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </section>
    </main>
  )
}

export default LoginPage
