import Currencies from 'api/collections/Currencies'
import api from 'api/helpers/api'
import notifyTransactions from 'api/helpers/notifyTransactions'
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
  try {
    await api[currency.code](currency.code)
    // Notify found transactions
    await notifyTransactions(currency.code)
    Currencies.update(currency._id, {$set: {workingAt: null, updatedAt: new Date()}})
  } catch (e) {
    console.log(`ERROR Tracking ${currency.name}`, e)
  }
}
