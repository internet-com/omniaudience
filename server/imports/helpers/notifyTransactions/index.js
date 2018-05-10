import Transactions from 'api/collections/Transactions'
import Wallets from 'api/collections/Wallets'
import Currencies from 'api/collections/Currencies'
import rp from 'request-promise'

export default async function(currencyCode) {
  const currency = Currencies.findOne({code: currencyCode})
  const transactions = Transactions.find({
    currencyCode,
    confirmed: {$ne: true}
  }).fetch()

  for (const transaction of transactions) {
    const wallet = Wallets.findOne({address: transaction.address})
    if (!wallet) {
      continue
    }
    const confirmations = currency.latestBlockNumber - transaction.blockHeight + 1
    if (confirmations === transaction.confirmations) {
      continue
    }
    const confirmed = confirmations >= currency.requiredConfirmations
    try {
      await rp({
        uri: wallet.notifyUrl,
        method: 'POST',
        json: true,
        body: {
          address: wallet.address,
          amount: transaction.amount,
          confirmed,
          confirmations,
          txid: transaction.txid,
          outs: transaction.outs
        }
      })
      Transactions.update(transaction._id, {
        $set: {
          confirmed,
          confirmations,
          updatedAt: new Date()
        }
      })
    } catch (e) {
      Transactions.update(transaction._id, {
        $set: {
          confirmed,
          confirmations,
          updatedAt: new Date()
        }
      })
      console.log(e)
      continue
    }
  }
}
