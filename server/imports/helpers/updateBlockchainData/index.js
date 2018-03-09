import rp from 'request-promise'
import Currencies from 'api/collections/Currencies'
import {Block, address as Address} from 'bitcoinjs-lib'
import Wallets from 'api/collections/Wallets'
import Transactions from 'api/collections/Transactions'
import CurrenciesDetails from 'api/currencies'

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
        const spent = !!vout.spentTxId
        const wallet = Wallets.findOne({address})
        if (wallet) {
          console.log('\nTransaction found to', address, value, '\n')
          Transactions.insert({
            txid,
            blockHash,
            blockHeight: height,
            walletId: wallet._id,
            currencyCode: currencyCode,
            amount: value,
            address,
            spent
          })
        }
      } catch (e) {
        console.log(value)
        console.log(e)
        continue
      }
    }
  }
  Currencies.update(currency._id, {$set: {updatedAt: new Date(), latestBlockNumber: height}})
}
