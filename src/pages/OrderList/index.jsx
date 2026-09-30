import { Alert, Button, Form, Input, Space, Table, Tabs, Typography } from 'antd'

import StatusTag from '@/components/StatusTag'
import { ORDER_STATUS_TABS } from '@/constants/order'
import { useOrderListQuery } from '@/hooks/useOrderListQuery'
import { formatAmount, formatDateTime } from '@/utils/format'

import styles from './index.module.css'

const columns = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    width: 190,
  },
  {
    title: '会员姓名',
    dataIndex: 'memberName',
    key: 'memberName',
    width: 120,
  },
  {
    title: '购卡年限',
    dataIndex: 'purchaseYears',
    key: 'purchaseYears',
    width: 100,
    render: (value) => `${value} 年`,
  },
  {
    title: '订单金额',
    dataIndex: 'orderAmount',
    key: 'orderAmount',
    width: 130,
    align: 'right',
    render: (value) => formatAmount(value),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status) => <StatusTag status={status} />,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
    render: (value) => formatDateTime(value),
  },
  {
    title: '操作',
    key: 'action',
    width: 90,
    render: () => '-',
  },
]

/**
 * 订单列表页。
 *
 * 页面负责收集 Tab、搜索和分页交互，并通过 useOrderListQuery 管理请求状态。
 */
function OrderListPage() {
  const [searchForm] = Form.useForm()
  const {
    activeTab,
    page,
    pageSize,
    data,
    loading,
    error,
    changeTab,
    search,
    reset,
    changePagination,
  } = useOrderListQuery()

  function handleSearch(values) {
    search({
      orderNo: values.orderNo?.trim() ?? '',
      memberName: values.memberName?.trim() ?? '',
    })
  }

  function handleReset() {
    searchForm.resetFields()
    reset()
  }

  return (
    <>
      <Typography.Title level={4}>订单列表</Typography.Title>
      <Tabs
        activeKey={activeTab}
        items={ORDER_STATUS_TABS.map((tab) => ({
          key: tab.key,
          label: tab.label,
        }))}
        onChange={changeTab}
      />
      <Form
        form={searchForm}
        layout="inline"
        className={styles.searchForm}
        initialValues={{
          orderNo: '',
          memberName: '',
        }}
        onFinish={handleSearch}
      >
        <Form.Item label="订单号" name="orderNo">
          <Input allowClear placeholder="请输入完整订单号" />
        </Form.Item>
        <Form.Item label="会员姓名" name="memberName">
          <Input allowClear placeholder="请输入会员姓名" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
      {error ? (
        <Alert
          className={styles.error}
          type="error"
          showIcon
          message="订单查询失败"
          description={error.message}
        />
      ) : null}
      <div>
        <Table
          rowKey="orderNo"
          columns={columns}
          dataSource={data.list}
          loading={loading}
          scroll={{
            x: 980,
          }}
          pagination={{
            current: page,
            pageSize,
            total: data.total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: [10, 20, 50],
            onChange: changePagination,
          }}
        />
      </div>
    </>
  )
}

export default OrderListPage
