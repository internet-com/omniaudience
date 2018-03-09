import Currencies from 'api/collections/Currencies'
import getBlockchainHeight from 'api/helpers/getBlockchainHeight'
import updateBlockchainData from 'api/helpers/updateBlockchainData'
import notifyTransactions from 'api/helpers/notifyTransactions'

export default async function() {
  const currencies = Currencies.find({active: true}).fetch()
  for (const currency of currencies) {
    console.log(`Watching Currency ${currency.name}`)
    const height = await getBlockchainHeight(currency.code)
    console.log(height, currency.latestBlockNumber)
    if (height <= currency.latestBlockNumber) {
      console.log(`No new blocks on ${currency.name}\n`)
      continue
    }
    for (var i = currency.latestBlockNumber; i <= height; i++) {
      await notifyTransactions(
        currency.code,
        currency.latestBlockNumber - (currency.requiredConfirmations - 1)
      )
      await updateBlockchainData(currency.code, i)
    }
  }
}
