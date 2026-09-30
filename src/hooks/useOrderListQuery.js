import { useEffect, useRef, useState } from 'react'

import { getOrderList } from '@/api/order'
import { ORDER_STATUS_TABS } from '@/constants/order'

const DEFAULT_PAGE_SIZE = 10

/**
 * 订单列表查询 Hook。
 *
 * 统一维护 Tab、搜索条件、分页、加载状态和查询结果。页面只负责收集交互参数，
 * 不需要重复处理请求竞态和刷新逻辑。
 */
export function useOrderListQuery() {
  const requestIdRef = useRef(0)
  const [activeTab, setActiveTab] = useState(ORDER_STATUS_TABS[0].key)
  const [filters, setFilters] = useState({
    orderNo: '',
    memberName: '',
  })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [refreshToken, setRefreshToken] = useState(0)
  const [data, setData] = useState({
    list: [],
    total: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isActive = true
    const requestId = requestIdRef.current + 1
    const activeTabConfig = ORDER_STATUS_TABS.find((tab) => tab.key === activeTab)
    const params = {
      page,
      pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }

    requestIdRef.current = requestId

    if (activeTabConfig?.statuses?.length) {
      params.statuses = activeTabConfig.statuses
    }

    if (filters.orderNo) {
      params.orderNo = filters.orderNo
    }

    if (filters.memberName) {
      params.memberName = filters.memberName
    }

    async function fetchOrders() {
      setLoading(true)
      setError(null)

      try {
        const result = await getOrderList(params)

        if (isActive && requestIdRef.current === requestId) {
          setData(result)
        }
      } catch (requestError) {
        if (isActive && requestIdRef.current === requestId) {
          setError(requestError)
        }
      } finally {
        if (isActive && requestIdRef.current === requestId) {
          setLoading(false)
        }
      }
    }

    fetchOrders()

    return () => {
      isActive = false
    }
  }, [activeTab, filters.memberName, filters.orderNo, page, pageSize, refreshToken])

  /**
   * 切换状态 Tab。
   *
   * 状态集合变化后必须从第一页开始查询，避免停留在超范围页码。
   */
  function changeTab(nextTab) {
    setActiveTab(nextTab)
    setPage(1)
  }

  // 提交搜索条件并回到第一页，搜索值由页面表单提前去除首尾空格。
  function search(nextFilters) {
    setFilters({
      orderNo: nextFilters.orderNo ?? '',
      memberName: nextFilters.memberName ?? '',
    })
    setPage(1)
  }

  // 清空搜索条件并重新查询第一页。
  function reset() {
    setFilters({
      orderNo: '',
      memberName: '',
    })
    setPage(1)
  }

  /**
   * 分页变化。
   *
   * 修改每页条数时回到第一页；普通翻页保留用户选择的页码和每页条数。
   */
  function changePagination(nextPage, nextPageSize) {
    const pageSizeChanged = nextPageSize !== pageSize

    setPage(pageSizeChanged ? 1 : nextPage)
    setPageSize(nextPageSize)
  }

  // 保持当前筛选和分页不变，重新请求最新数据。
  function refresh() {
    setRefreshToken((value) => value + 1)
  }

  return {
    activeTab,
    filters,
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
  }
}
