import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

/**
 * 404 页面。
 *
 * 未匹配任何业务路由时展示，并提供返回订单列表的入口。
 */
function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，访问的页面不存在。"
      extra={
        <Button type="primary" onClick={() => navigate('/orders', { replace: true })}>
          返回订单列表
        </Button>
      }
    />
  )
}

export default NotFoundPage
