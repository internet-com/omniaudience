import getBlockHash from './getBlockHash'
import getRawBlock from './getRawBlock'
import {Block} from 'bitcoinjs-lib'

export default async function(currency, height) {
  const blockHash = await getBlockHash(currency, height)
  const rawBlock = await getRawBlock(currency, blockHash)
  return Block.fromHex(rawBlock)
}
