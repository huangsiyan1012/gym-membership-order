import { ORDER_STATUS } from '@/constants/order'
import { ORDER_PRICE_PER_YEAR } from '@/constants/pricing'

/**
 * 初始订单种子数据。
 *
 * 数据覆盖全部订单状态，并额外包含金额为 0、金额为 null 的边界记录。
 * 这里只保存业务字段，公共默认字段由 createInitialOrders 统一补齐。
 */
const ORDER_SEEDS = Object.freeze([
  {
    orderNo: 'ORD202609300036',
    memberName: '张伟',
    phone: '13800138001',
    purchaseYears: 3,
    status: ORDER_STATUS.PENDING_REVIEW,
    createdAt: '2026-09-30T09:30:00+08:00',
    remark: '首次办卡',
  },
  {
    orderNo: 'ORD202609300035',
    memberName: '李娜',
    phone: '13900139002',
    purchaseYears: 1,
    status: ORDER_STATUS.PENDING_REVIEW,
    createdAt: '2026-09-30T09:10:00+08:00',
  },
  {
    orderNo: 'ORD202609290034',
    memberName: '王强',
    phone: '13700137003',
    purchaseYears: 5,
    status: ORDER_STATUS.PENDING_CARD,
    createdAt: '2026-09-29T18:20:00+08:00',
  },
  {
    orderNo: 'ORD202609290033',
    memberName: '赵敏',
    phone: '13600136004',
    purchaseYears: 2,
    status: ORDER_STATUS.PENDING_SHIP,
    createdAt: '2026-09-29T16:45:00+08:00',
  },
  {
    orderNo: 'ORD202609290032',
    memberName: '陈杰',
    phone: '13500135005',
    purchaseYears: 4,
    status: ORDER_STATUS.COMPLETED,
    createdAt: '2026-09-29T14:10:00+08:00',
  },
  {
    orderNo: 'ORD202609290031',
    memberName: '刘洋',
    phone: '18800188006',
    purchaseYears: 1,
    status: ORDER_STATUS.EXPIRED,
    createdAt: '2026-09-29T11:30:00+08:00',
    remark: '到期未续费',
  },
  {
    orderNo: 'ORD202609280030',
    memberName: '周婷',
    phone: '18900189007',
    purchaseYears: 3,
    status: ORDER_STATUS.CANCELLED,
    createdAt: '2026-09-28T17:15:00+08:00',
    remark: '客户撤单',
  },
  {
    orderNo: 'ORD202609280029',
    memberName: '吴磊',
    phone: '18600186008',
    purchaseYears: 10,
    status: ORDER_STATUS.PENDING_REVIEW,
    createdAt: '2026-09-28T15:40:00+08:00',
  },
  {
    orderNo: 'ORD202609280028',
    memberName: '郑雪',
    phone: '18500185009',
    purchaseYears: 2,
    status: ORDER_STATUS.PENDING_CARD,
    createdAt: '2026-09-28T13:05:00+08:00',
  },
  {
    orderNo: 'ORD202609270027',
    memberName: '孙浩',
    phone: '18400184010',
    purchaseYears: 1,
    status: ORDER_STATUS.PENDING_SHIP,
    createdAt: '2026-09-27T19:25:00+08:00',
  },
  {
    orderNo: 'ORD202609270026',
    memberName: '马丽',
    phone: '18300183011',
    purchaseYears: 6,
    status: ORDER_STATUS.COMPLETED,
    createdAt: '2026-09-27T16:00:00+08:00',
  },
  {
    orderNo: 'ORD202609270025',
    memberName: '朱鹏',
    phone: '18200182012',
    purchaseYears: 2,
    orderAmount: null,
    status: ORDER_STATUS.EXPIRED,
    createdAt: '2026-09-27T10:20:00+08:00',
    remark: '历史数据金额缺失',
  },
  {
    orderNo: 'ORD202609260024',
    memberName: '胡静',
    phone: '18100181013',
    purchaseYears: 4,
    status: ORDER_STATUS.CANCELLED,
    createdAt: '2026-09-26T18:35:00+08:00',
    remark: '客户撤单',
  },
  {
    orderNo: 'ORD202609260023',
    memberName: '郭涛',
    phone: '18000180014',
    purchaseYears: 3,
    status: ORDER_STATUS.PENDING_REVIEW,
    createdAt: '2026-09-26T14:55:00+08:00',
  },
  {
    orderNo: 'ORD202609260022',
    memberName: '何艳',
    phone: '17800178015',
    purchaseYears: 1,
    status: ORDER_STATUS.PENDING_CARD,
    createdAt: '2026-09-26T10:15:00+08:00',
  },
  {
    orderNo: 'ORD202609250021',
    memberName: '高翔',
    phone: '17700177016',
    purchaseYears: 8,
    status: ORDER_STATUS.PENDING_SHIP,
    createdAt: '2026-09-25T20:05:00+08:00',
  },
  {
    orderNo: 'ORD202609250020',
    memberName: '林慧',
    phone: '17600176017',
    purchaseYears: 2,
    status: ORDER_STATUS.COMPLETED,
    createdAt: '2026-09-25T15:30:00+08:00',
  },
  {
    orderNo: 'ORD202609250019',
    memberName: '罗宇',
    phone: '17500175018',
    purchaseYears: 1,
    status: ORDER_STATUS.EXPIRED,
    createdAt: '2026-09-25T09:45:00+08:00',
  },
  {
    orderNo: 'ORD202609240018',
    memberName: '梁欣',
    phone: '17300173019',
    purchaseYears: 5,
    status: ORDER_STATUS.CANCELLED,
    createdAt: '2026-09-24T18:10:00+08:00',
  },
  {
    orderNo: 'ORD202609240017',
    memberName: '宋涛',
    phone: '17200172020',
    purchaseYears: 3,
    status: ORDER_STATUS.PENDING_REVIEW,
    createdAt: '2026-09-24T13:25:00+08:00',
  },
  {
    orderNo: 'ORD202609240016',
    memberName: '唐悦',
    phone: '17100171021',
    purchaseYears: 2,
    status: ORDER_STATUS.PENDING_CARD,
    createdAt: '2026-09-24T08:50:00+08:00',
  },
  {
    orderNo: 'ORD202609230015',
    memberName: '许诺',
    phone: '17000170022',
    purchaseYears: 7,
    status: ORDER_STATUS.PENDING_SHIP,
    createdAt: '2026-09-23T17:40:00+08:00',
  },
  {
    orderNo: 'ORD202609230014',
    memberName: '邓超',
    phone: '16900169023',
    purchaseYears: 1,
    status: ORDER_STATUS.COMPLETED,
    createdAt: '2026-09-23T12:15:00+08:00',
  },
  {
    orderNo: 'ORD202609230013',
    memberName: '冯娜',
    phone: '16800168024',
    purchaseYears: 4,
    status: ORDER_STATUS.EXPIRED,
    createdAt: '2026-09-23T09:05:00+08:00',
  },
  {
    orderNo: 'ORD202609220012',
    memberName: '曾磊',
    phone: '16700167025',
    purchaseYears: 2,
    status: ORDER_STATUS.CANCELLED,
    createdAt: '2026-09-22T16:30:00+08:00',
  },
  {
    orderNo: 'ORD202609220011',
    memberName: '彭芳',
    phone: '16600166026',
    purchaseYears: 3,
    status: ORDER_STATUS.PENDING_REVIEW,
    createdAt: '2026-09-22T10:40:00+08:00',
  },
  {
    orderNo: 'ORD202609210010',
    memberName: '袁晨',
    phone: '16500165027',
    purchaseYears: 1,
    status: ORDER_STATUS.PENDING_CARD,
    createdAt: '2026-09-21T18:25:00+08:00',
  },
  {
    orderNo: 'ORD202609210009',
    memberName: '谢琳',
    phone: '16300163028',
    purchaseYears: 6,
    status: ORDER_STATUS.PENDING_SHIP,
    createdAt: '2026-09-21T14:05:00+08:00',
  },
  {
    orderNo: 'ORD202609210008',
    memberName: '韩雪',
    phone: '16200162029',
    purchaseYears: 2,
    status: ORDER_STATUS.COMPLETED,
    createdAt: '2026-09-21T09:35:00+08:00',
  },
  {
    orderNo: 'ORD202609200007',
    memberName: '曹阳',
    phone: '16100161030',
    purchaseYears: 1,
    orderAmount: 0,
    status: ORDER_STATUS.EXPIRED,
    createdAt: '2026-09-20T17:50:00+08:00',
    remark: '活动赠送订单',
  },
  {
    orderNo: 'ORD202609200006',
    memberName: '潘婷',
    phone: '16000160031',
    purchaseYears: 3,
    status: ORDER_STATUS.CANCELLED,
    createdAt: '2026-09-20T11:20:00+08:00',
  },
  {
    orderNo: 'ORD202609190005',
    memberName: '杜鹏',
    phone: '15900159032',
    purchaseYears: 2,
    status: ORDER_STATUS.PENDING_REVIEW,
    createdAt: '2026-09-19T16:15:00+08:00',
  },
  {
    orderNo: 'ORD202609190004',
    memberName: '叶青',
    phone: '15800158033',
    purchaseYears: 1,
    status: ORDER_STATUS.PENDING_CARD,
    createdAt: '2026-09-19T09:55:00+08:00',
  },
  {
    orderNo: 'ORD202609180003',
    memberName: '程琳',
    phone: '15700157034',
    purchaseYears: 4,
    status: ORDER_STATUS.PENDING_SHIP,
    createdAt: '2026-09-18T15:25:00+08:00',
  },
  {
    orderNo: 'ORD202609180002',
    memberName: '苏航',
    phone: '15600156035',
    purchaseYears: 5,
    status: ORDER_STATUS.COMPLETED,
    createdAt: '2026-09-18T10:05:00+08:00',
  },
  {
    orderNo: 'ORD202609170001',
    memberName: '魏然',
    phone: '15500155036',
    purchaseYears: 2,
    status: ORDER_STATUS.CANCELLED,
    createdAt: '2026-09-17T14:45:00+08:00',
  },
])

/**
 * 计算种子订单金额。
 *
 * 未显式提供 orderAmount 时按购卡年限计算；显式传入 0 或 null 时保留原值，
 * 用于覆盖页面金额展示和历史数据缺失场景。
 */
function resolveOrderAmount(seed) {
  return Object.hasOwn(seed, 'orderAmount')
    ? seed.orderAmount
    : seed.purchaseYears * ORDER_PRICE_PER_YEAR
}

/**
 * 创建一份全新的初始订单数组。
 *
 * 每次调用都会创建新对象，避免模拟仓储修改数据时污染种子数据；页面刷新后
 * 模块重新加载即可恢复为这批初始数据。
 */
export function createInitialOrders() {
  return ORDER_SEEDS.map((seed, index) => ({
    id: `mock-order-${String(index + 1).padStart(3, '0')}`,
    memberName: seed.memberName,
    phone: seed.phone,
    purchaseYears: seed.purchaseYears,
    orderAmount: resolveOrderAmount(seed),
    status: seed.status,
    createdAt: seed.createdAt,
    updatedAt: seed.updatedAt ?? seed.createdAt,
    remark: seed.remark ?? '',
    lastRenewalYears: null,
    lastRenewalFee: null,
    renewedAt: null,
    orderNo: seed.orderNo,
  }))
}
