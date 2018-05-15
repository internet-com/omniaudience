import Currencies from 'api/collections/Currencies'
import getBlockchainHeight from 'api/helpers/getBlockchainHeight'
import updateBlockchainData from 'api/helpers/updateBlockchainData'
import moment from 'moment'

export default async function() {
  const currency = Currencies.findAndModify({
    query: {
      active: true,
      $or: [
        {
          workingAt: null
        },
        {
          workingAt: {
            $lte: moment()
              .subtract(1, 'minutes')
              .toDate()
          }
        }
      ]
    },
    update: {$set: {workingAt: new Date()}},
    sort: {updatedAt: 1}
  })

  if (!currency) {
    return 'This Blockchain is not being tracked'
  }

  console.log(`Watching Currency ${currency.name}`)
  const height = await getBlockchainHeight(currency.code)

  console.log('Blockchain height', height, 'Tracking height', currency.latestBlockNumber)
  if (height <= currency.latestBlockNumber) {
    console.log(`No new blocks on ${currency.name}\n`)
    Currencies.update(currency._id, {$set: {workingAt: null, updatedAt: new Date()}})
    return
  }

  await updateBlockchainData(currency.code, currency.latestBlockNumber + 1)
  Currencies.update(currency._id, {$set: {workingAt: null, updatedAt: new Date()}})
}
