import { useState } from 'react'

import { mergePageSelection, removeOrdersFromSelection } from '@/utils/orderSelection'

/**
 * 跨页订单选择 Hook。
 *
 * 以订单号为键保存订单快照，保证翻页后仍能读取完整订单信息。选择集合是唯一
 * 数据源，表格的 selectedRowKeys 始终由该集合派生。
 */
export function useOrderSelection() {
  const [selectedOrderMap, setSelectedOrderMap] = useState({})
  const selectedOrderNos = Object.keys(selectedOrderMap)
  const selectedOrders = Object.values(selectedOrderMap)

  // 同步当前页勾选结果，同时保留其他页面的订单选择。
  function syncPageSelection(pageOrders, selectedKeys) {
    setSelectedOrderMap((previousSelection) =>
      mergePageSelection(previousSelection, pageOrders, selectedKeys),
    )
  }

  // 清空全部页面的选择。
  function clearSelection() {
    setSelectedOrderMap({})
  }

  // 写操作成功后移除已处理订单，未处理订单继续保留选择。
  function removeSelection(orderNos) {
    setSelectedOrderMap((previousSelection) =>
      removeOrdersFromSelection(previousSelection, orderNos),
    )
  }

  return {
    selectedOrderNos,
    selectedOrders,
    selectedCount: selectedOrders.length,
    syncPageSelection,
    clearSelection,
    removeSelection,
  }
}
