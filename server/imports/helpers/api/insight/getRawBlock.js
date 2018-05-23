import rp from 'request-promise'

export default async function(currency, blockHash) {
  const blockInfo = await rp({
    uri: `${currency.api}/rawblock/${blockHash}`,
    json: true,
    simple: true
  })
  return blockInfo.rawblock
}
