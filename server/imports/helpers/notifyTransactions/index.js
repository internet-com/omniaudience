import Transactions from 'api/collections/Transactions'
import Wallets from 'api/collections/Wallets'
import rp from 'request-promise'

export default async function(currencyCode, height) {
  const transactions = Transactions.find({
    currencyCode,
    blockHeight: height,
    notified: {$ne: true}
  }).fetch()

  for (const transaction of transactions) {
    const wallet = Wallets.findOne(transaction.walletId)
    if (!wallet) {
      continue
    }
    await rp({
      uri: wallet.notifyUrl,
      simple: true,
      json: true,
      body: {
        address: wallet.address,
        amount: transaction.amount
      }
    })
    Transactions.update(transaction._id, {$set: {notified: true, updatedAt: new Date()}})
  }
}
