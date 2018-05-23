import Currencies from 'api/collections/Currencies'
import rp from 'request-promise'

export default async function(currencyCode) {
  const currency = Currencies.findOne({code: currencyCode})
  const request = await rp({
    uri: `${currency.api}/sync`,
    json: true,
    simple: true
  })
  return request.blockChainHeight
}
