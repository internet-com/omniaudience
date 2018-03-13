import rp from 'request-promise'
import Currencies from 'api/collections/Currencies'
import {Block, address as Address} from 'bitcoinjs-lib'
import Wallets from 'api/collections/Wallets'
import Transactions from 'api/collections/Transactions'
import CurrenciesDetails from 'api/currencies'
import notifyTransactions from 'api/helpers/notifyTransactions'
import each from 'lodash/each'

export default async function(currencyCode, height) {
  console.log('Watching block', height)
  const currency = Currencies.findOne({code: currencyCode})
  const response = await rp({
    uri: `${currency.api}/block-index/${height}`,
    json: true,
    simple: true
  })
  const blockHash = response.blockHash
  const blockInfo = await rp({
    uri: `${currency.api}/rawblock/${blockHash}`,
    json: true,
    simple: true
  })
  const rawBlock = blockInfo.rawblock
  const parsedBlock = Block.fromHex(rawBlock)

  for (const transaction of parsedBlock.transactions) {
    if (!transaction.outs) {
      continue
    }
    const txid = transaction.getId()

    let tracking = {}
    for (const vout of transaction.outs) {
      const value = Number(vout.value)
      if (!value) {
        continue
      }
      try {
        const address = Address.fromOutputScript(
          vout.script,
          CurrenciesDetails[currency.name.toLowerCase()]
        )
        const wallet = Wallets.findOne({address})
        if (wallet) {
          console.log('\nTransaction found to', address, value, '\n')
          if (!tracking[address]) {
            tracking[address] = Number(value) || 0
          } else {
            tracking[address] += Number(value) || 0
          }
        }
      } catch (e) {
        continue
      }
    }
    each(tracking, (value, index) => {
      Transactions.insert({
        txid,
        blockHash,
        blockHeight: height,
        currencyCode: currencyCode,
        amount: value,
        address: index
      })
    })
  }
  await notifyTransactions(currency.code, height)
  Currencies.update(currency._id, {$set: {updatedAt: new Date(), latestBlockNumber: height}})
}
