/**
 * 合并当前页选择到跨页选择集合。
 *
 * selectedKeys 可能包含其他页面的订单号，因此只更新当前页订单：
 * - 当前页已选订单写入或更新快照；
 * - 当前页取消的订单从集合中移除；
 * - 其他页面选择保持不变。
 */
export function mergePageSelection(previousSelection, pageOrders, selectedKeys) {
  const nextSelection = { ...previousSelection }
  const selectedKeySet = new Set(selectedKeys)

  pageOrders.forEach((order) => {
    if (selectedKeySet.has(order.orderNo)) {
      nextSelection[order.orderNo] = order
    } else {
      delete nextSelection[order.orderNo]
    }
  })

  return nextSelection
}

// 从跨页选择集合中移除指定订单，供写操作成功后清理选择。
export function removeOrdersFromSelection(previousSelection, orderNos) {
  const nextSelection = { ...previousSelection }

  orderNos.forEach((orderNo) => {
    delete nextSelection[orderNo]
  })

  return nextSelection
}

/**
 * 按允许状态拆分订单。
 *
 * 返回满足条件的 validOrders 和不满足条件的 invalidOrders，调用方可以据此
 * 决定是否继续业务操作并展示不可操作用户的订单号。
 */
export function partitionOrdersByStatus(orders, allowedStatuses) {
  const allowedStatusSet = new Set(allowedStatuses)
  const result = {
    validOrders: [],
    invalidOrders: [],
  }

  orders.forEach((order) => {
    if (allowedStatusSet.has(order.status)) {
      result.validOrders.push(order)
    } else {
      result.invalidOrders.push(order)
    }
  })

  return result
}
