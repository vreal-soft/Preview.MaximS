export const transformTinyIntToBool = (defaultValue = 1) => ({
  to(value) {
    return Number.isNaN(+value) ? defaultValue : value
  },
  from(value) {
    return Boolean(value)
  },
})
