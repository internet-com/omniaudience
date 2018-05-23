import Currencies from 'api/collections/Currencies'
import {address as Address} from 'bitcoinjs-lib'
import Wallets from 'api/collections/Wallets'
import Transactions from 'api/collections/Transactions'
import CurrenciesDetails from 'api/currencies'
import notifyTransactions from 'api/helpers/notifyTransactions'
import getParsedBlock from './getParsedBlock'
import getBlockchainHeight from './getBlockchainHeight'
import each from 'lodash/each'
import sumby from 'lodash/sumBy'

export default async function(currencyCode) {
  const currency = Currencies.findOne({code: currencyCode})
  const height = currency.latestBlockNumber + 1
  const blockchainHeight = await getBlockchainHeight(currency.code)

  // Check if update is needed
  console.log('Blockchain height', blockchainHeight, 'Tracking height', height)
  if (blockchainHeight <= currency.latestBlockNumber) {
    console.log(`No new blocks on ${currency.name}\n`)
    Currencies.update(currency._id, {$set: {workingAt: null, updatedAt: new Date()}})
    return
  }

  console.log('Watching block', height, '\n')
  const parsedBlock = await getParsedBlock(currency, height) // Get full parsed block

  // Parse block transactions
  for (const transaction of parsedBlock.transactions) {
    if (!transaction.outs) continue

    // Hashmap to store all incomming outputs from transaction
    let tracking = {}
    for (let i = 0; i < transaction.outs.length; i++) {
      const vout = transaction.outs[i]
      const value = parseInt(vout.value)
      if (!value) continue

      try {
        const address = Address.fromOutputScript(
          vout.script,
          CurrenciesDetails[currency.name.toLowerCase()] // network information for decryption
        )

        // Check if we are tracking this address
        const wallet = Wallets.findOne({address})
        if (!wallet) continue

        console.log('\nTransaction found to', address, value, '\n')
        // Save transaction outputs
        if (!tracking[address]) {
          tracking[address] = [{value: value || 0, index: i}]
        } else {
          tracking[address].push({value: value || 0, index: i})
        }
      } catch (e) {
        continue
      }
    }

    // Store transaction information in database
    const txid = transaction.getId() // Transaction hash
    each(tracking, (outs, index) => {
      const amount = sumby(outs, 'value')
      Transactions.insert({
        txid,
        blockHeight: height,
        currencyCode: currencyCode,
        amount,
        outs: outs,
        address: index
      })
    })
  }

  // Notify found transactions
  await notifyTransactions(currency.code, height)

  Currencies.update(currency._id, {
    $set: {updatedAt: new Date(), latestBlockNumber: height}
  })
}
