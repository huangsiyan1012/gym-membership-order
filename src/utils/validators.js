export const MEMBER_NAME_MIN_LENGTH = 2
export const MEMBER_NAME_MAX_LENGTH = 30

// 当前业务按中国大陆手机号校验。
const PHONE_PATTERN = /^1[3-9]\d{9}$/

/**
 * 校验会员姓名。
 *
 * 仅接受字符串，去除首尾空格后的长度必须在 2 到 30 个字符之间。
 */
export function isValidMemberName(value) {
  if (typeof value !== 'string') {
    return false
  }

  const normalizedName = value.trim()

  return (
    normalizedName.length >= MEMBER_NAME_MIN_LENGTH &&
    normalizedName.length <= MEMBER_NAME_MAX_LENGTH
  )
}

/**
 * 校验联系手机号。
 *
 * 当前业务按中国大陆手机号规则校验，输入前后的空格会被忽略。
 */
export function isValidPhone(value) {
  if (typeof value !== 'string') {
    return false
  }

  return PHONE_PATTERN.test(value.trim())
}
