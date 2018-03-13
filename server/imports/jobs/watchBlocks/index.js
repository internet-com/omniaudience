import Currencies from 'api/collections/Currencies'
import getBlockchainHeight from 'api/helpers/getBlockchainHeight'
import updateBlockchainData from 'api/helpers/updateBlockchainData'

export default async function() {
  const currency = Currencies.findAndModify({
    query: {
      active: true,
      updating: {$ne: true}
    },
    update: {
      $set: {updating: true}
    },
    sort: {updatedAt: 1}
  })
  if (!currency) {
    return 'No Blockchain tracked'
  }
  console.log(`Watching Currency ${currency.name}`)
  const height = await getBlockchainHeight(currency.code)
  console.log(height, currency.latestBlockNumber)
  if (height <= currency.latestBlockNumber) {
    console.log(`No new blocks on ${currency.name}\n`)
    return
  }
  for (var i = currency.latestBlockNumber; i <= height; i++) {
    await updateBlockchainData(currency.code, i)
  }
  Currencies.update(currency._id, {$set: {updating: false}})
}
