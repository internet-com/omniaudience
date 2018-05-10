import rp from 'request-promise'

export default async function(currency, height) {
  const response = await rp({
    uri: `${currency.api}/block-index/${height}`,
    json: true,
    simple: true
  })
  return response.blockHash
}
