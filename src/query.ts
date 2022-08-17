import {
  decode,
  decodeQueryValue,
  encodeQueryKey,
  encodeQueryValue
} from './encoding'

type QueryType = string | string[] | undefined
export type QueryValue = QueryType | Record<string, QueryType>
export type QueryObject = Record<string, QueryValue>

export function parseQuery (paramsStr: string = ''): QueryObject {
  const obj: QueryObject = {}
  if (paramsStr[0] === '?') {
    paramsStr = paramsStr.substr(1)
  }
  for (const param of paramsStr.split('&')) {
    const s = (param.match(/([^=]+)=?(.*)/) || [])
    if (s.length < 2) { continue }
    const key = decode(s[1])
    if (key === '__proto__' || key === 'constructor') {
      continue
    }
    const value = decodeQueryValue(s[2] || '')
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        (obj[key] as string[]).push(value)
      } else {
        obj[key] = [obj[key] as string, value]
      }
    } else {
      obj[key] = value
    }
  }
  return obj
}

export function encodeQueryItem (key: string, val: QueryValue): string {
  if (typeof val === 'number' || typeof val === 'boolean') {
    val = String(val)
  }
  if (!val) {
    return encodeQueryKey(key)
  }

  if (Array.isArray(val)) {
    return val.map(_val => `${encodeQueryKey(key)}=${encodeQueryValue(_val)}`).join('&')
  }

  if (typeof val === 'object') {
    return Object.entries(val)
      .map(([objKey, objVal]) => {
        let thisKey = `${key}[${objKey}]`
        const thisValue = encodeQueryItem(objKey, objVal)

        const nextKey = decodeQueryValue(thisValue).match(/\[(.*?)]/) || []

        if (nextKey.length === 2) {
          thisKey += `[${nextKey[1]}]`
        }

        return `${encodeQueryKey(thisKey)}=${thisValue.split('=').pop()}`
      })
      .join('&')
  }

  return `${encodeQueryKey(key)}=${encodeQueryValue(val)}`
}

export function stringifyQuery (query: QueryObject) {
  return Object.keys(query).map(k => encodeQueryItem(k, query[k])).join('&')
}
