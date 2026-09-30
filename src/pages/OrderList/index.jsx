import { Alert, App as AntdApp, Button, Form, Input, Space, Table, Tabs, Typography } from 'antd'
import { useState } from 'react'

import CancelOrderModal from '@/components/CancelOrderModal'
import RenewOrderModal from '@/components/RenewOrderModal'
import StatusTag from '@/components/StatusTag'
import { ORDER_STATUS, ORDER_STATUS_TABS } from '@/constants/order'
import { useOrderSelection } from '@/hooks/useOrderSelection'
import { useOrderListQuery } from '@/hooks/useOrderListQuery'
import { formatAmount, formatDateTime } from '@/utils/format'
import { partitionOrdersByStatus } from '@/utils/orderSelection'

import styles from './index.module.css'

const baseColumns = [
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
]

/**
 * 订单列表页。
 *
 * 页面负责收集 Tab、搜索和分页交互，并通过 useOrderListQuery 管理请求状态。
 */
function OrderListPage() {
  const [searchForm] = Form.useForm()
  const [renewalOrders, setRenewalOrders] = useState([])
  const [cancellationOrders, setCancellationOrders] = useState([])
  const { message } = AntdApp.useApp()
  const {
    selectedOrderNos,
    selectedOrders,
    selectedCount,
    syncPageSelection,
    clearSelection,
    removeSelection,
  } = useOrderSelection()
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
    refresh,
  } = useOrderListQuery()

  const columns = [
    ...baseColumns,
    {
      title: '操作',
      key: 'action',
      width: 90,
      render: (_, order) =>
        order.status === ORDER_STATUS.EXPIRED ? (
          <Button type="link" onClick={() => setRenewalOrders([order])}>
            续卡
          </Button>
        ) : (
          '-'
        ),
    },
  ]

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

  /**
   * 批量续卡前置校验。
   *
   * 先验证全部选中订单均为已到期状态，校验通过后打开续卡弹窗。
   */
  function handleBatchRenew() {
    const { validOrders, invalidOrders } = partitionOrdersByStatus(selectedOrders, [
      ORDER_STATUS.EXPIRED,
    ])

    if (invalidOrders.length > 0) {
      message.warning(
        `以下订单不满足续卡条件：${invalidOrders.map((order) => order.orderNo).join('、')}`,
      )
      return
    }

    if (validOrders.length > 0) {
      setRenewalOrders(validOrders)
    }
  }

  /**
   * 批量撤单前置校验。
   *
   * 先验证全部选中订单均可撤单，校验通过后打开二次确认框。
   */
  function handleBatchCancel() {
    const { validOrders, invalidOrders } = partitionOrdersByStatus(selectedOrders, [
      ORDER_STATUS.PENDING_CARD,
      ORDER_STATUS.PENDING_SHIP,
    ])

    if (invalidOrders.length > 0) {
      message.warning(
        `以下订单不满足撤单条件：${invalidOrders.map((order) => order.orderNo).join('、')}`,
      )
      return
    }

    if (validOrders.length > 0) {
      setCancellationOrders(validOrders)
    }
  }

  // 续卡成功后清理已处理订单的选择，并刷新当前列表。
  function handleRenewalSuccess(updatedOrders) {
    removeSelection(updatedOrders.map((order) => order.orderNo))
    setRenewalOrders([])
    refresh()
  }

  // 撤单成功后清理已处理订单的选择，并刷新当前列表。
  function handleCancellationSuccess(cancelledOrders) {
    removeSelection(cancelledOrders.map((order) => order.orderNo))
    setCancellationOrders([])
    refresh()
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
      <div className={styles.actionBar}>
        <Space wrap>
          <Button type="primary" disabled={selectedCount === 0} onClick={handleBatchRenew}>
            批量续卡
          </Button>
          <Button danger disabled={selectedCount === 0} onClick={handleBatchCancel}>
            一键撤单
          </Button>
          <Button disabled={selectedCount === 0} onClick={clearSelection}>
            清空选择
          </Button>
        </Space>
        <span className={styles.selectionCount}>已选择 {selectedCount} 条</span>
      </div>
      <div>
        <Table
          rowKey="orderNo"
          columns={columns}
          dataSource={data.list}
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedOrderNos,
            preserveSelectedRowKeys: true,
            onChange: (selectedKeys) => syncPageSelection(data.list, selectedKeys),
          }}
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
      <RenewOrderModal
        open={renewalOrders.length > 0}
        orders={renewalOrders}
        onCancel={() => setRenewalOrders([])}
        onSuccess={handleRenewalSuccess}
      />
      <CancelOrderModal
        open={cancellationOrders.length > 0}
        orders={cancellationOrders}
        onCancel={() => setCancellationOrders([])}
        onSuccess={handleCancellationSuccess}
      />
    </>
  )
}

export default OrderListPage
