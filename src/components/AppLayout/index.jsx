import { App as AntdApp, Avatar, Breadcrumb, Button, Dropdown, Layout, Menu } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/store/authStore'

import styles from './index.module.css'

const { Header, Content, Sider } = Layout

const MENU_ITEMS = [
  {
    key: '/orders',
    label: '订单列表',
  },
  {
    key: '/orders/new',
    label: '新建订单',
  },
]

const BREADCRUMB_ITEMS = {
  '/orders': [{ title: '首页' }, { title: '订单管理' }, { title: '订单列表' }],
  '/orders/new': [{ title: '首页' }, { title: '订单管理' }, { title: '新建订单' }],
}

/**
 * 后台页面统一布局。
 *
 * 负责左侧菜单、顶部用户区域、面包屑和内容出口；具体业务页面通过 Outlet
 * 渲染，不感知布局细节。
 */
function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const username = useAuthStore((state) => state.username)
  const logout = useAuthStore((state) => state.logout)
  const { message } = AntdApp.useApp()

  const selectedMenuKey = location.pathname.startsWith('/orders/new') ? '/orders/new' : '/orders'
  const breadcrumbItems = BREADCRUMB_ITEMS[location.pathname] ?? BREADCRUMB_ITEMS['/orders']

  function handleLogout() {
    logout()
    message.success('已退出登录')
    navigate('/login', { replace: true })
  }

  return (
    <Layout className={styles.layout}>
      <Sider collapsible breakpoint="lg" theme="light">
        <div className={styles.logo}>健身房订单管理</div>
        <Menu
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          items={MENU_ITEMS}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.pageTitle}>会员办卡订单管理后台</div>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  label: '退出登录',
                },
              ],
              onClick: ({ key }) => {
                if (key === 'logout') {
                  handleLogout()
                }
              },
            }}
          >
            <Button type="text" className={styles.userEntry}>
              <Avatar size="small">{username?.slice(0, 1) || '用'}</Avatar>
              <span>{username || '当前用户'}</span>
            </Button>
          </Dropdown>
        </Header>
        <Content className={styles.content}>
          <Breadcrumb className={styles.breadcrumb} items={breadcrumbItems} />
          <div className={styles.contentBody}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
