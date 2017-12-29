import lodash from 'lodash'
module.exports = (data, key, settings) => {
  let isMultiple = settings.options && settings.options.multiple
  let value = data[ key ]
  let returnValue = value
  if (lodash.isString(value) && isMultiple) {
    returnValue = [ value ]
  } else if (lodash.isArray(value) && !isMultiple) {
    returnValue = value[ 0 ]
  } else if (lodash.isObject(value) && !lodash.isArray(value)) {
    // Note: isObject(['test']) returns true!
    if (!value.ids && !value.urls && value.id) {
      returnValue = value
    } else {
      if (isMultiple) {
        returnValue = value.urls
      } else {
        returnValue = value.urls[ 0 ]
      }
    }
  }

  return returnValue
}
