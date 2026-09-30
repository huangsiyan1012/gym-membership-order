/**
 * 办卡和续卡共用的定价规则。
 *
 * 后续新建订单、续卡弹窗和模拟接口都从这里读取价格，避免多处硬编码。
 */
export const ORDER_PRICE_PER_YEAR = 1200
export const MIN_PURCHASE_YEARS = 1
export const MAX_PURCHASE_YEARS = 10

// 单次续卡达到该年限后，应付费用按 RENEWAL_DISCOUNT_RATE 计算。
export const RENEWAL_DISCOUNT_MIN_YEARS = 5
export const RENEWAL_DISCOUNT_RATE = 0.8
