import Currencies from 'api/collections/Currencies'
import {Block, address as Address} from 'bitcoinjs-lib'
import Wallets from 'api/collections/Wallets'
import Transactions from 'api/collections/Transactions'
import CurrenciesDetails from 'api/currencies'
import notifyTransactions from 'api/helpers/notifyTransactions'
import getBlockHash from './getBlockHash'
import getRawBlock from './getRawBlock'
import each from 'lodash/each'
import sumby from 'lodash/sumby'

export default async function(currencyCode, height) {
  console.log('Watching block', height)
  const currency = Currencies.findOne({code: currencyCode})
  const blockHash = await getBlockHash(currency, height)
  const rawBlock = await getRawBlock(currency, blockHash)
  const parsedBlock = Block.fromHex(rawBlock)

  for (const transaction of parsedBlock.transactions) {
    if (!transaction.outs) {
      continue
    }
    const txid = transaction.getId()

    let tracking = {}
    for (let i = 0; i < transaction.outs.length; i++) {
      const vout = transaction.outs[i]
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
            tracking[address] = [{value: value || 0, index: i}]
          } else {
            tracking[address].push({value: value || 0, index: i})
          }
        }
      } catch (e) {
        continue
      }
    }
    each(tracking, (outs, index) => {
      const amount = sumby(outs, 'value')
      Transactions.insert({
        txid,
        blockHash,
        blockHeight: height,
        currencyCode: currencyCode,
        amount,
        outs: outs,
        address: index
      })
    })
  }
  await notifyTransactions(currency.code, height)
  Currencies.update(currency._id, {
    $set: {updatedAt: new Date(), latestBlockNumber: height}
  })
}
