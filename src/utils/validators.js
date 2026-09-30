export const MEMBER_NAME_MIN_LENGTH = 2
export const MEMBER_NAME_MAX_LENGTH = 30

// 当前业务按中国大陆手机号校验。
const PHONE_PATTERN = /^1[3-9]\d{9}$/

// 会员姓名先去除首尾空格，再校验有效长度。
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

// 手机号允许用户输入首尾空格，但校验时按纯数字格式判断。
export function isValidPhone(value) {
  if (typeof value !== 'string') {
    return false
  }

  return PHONE_PATTERN.test(value.trim())
}
