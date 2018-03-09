import SimpleSchema from 'simpl-schema'

export default new SimpleSchema({
  txid: {
    type: String
  },
  walletId: {
    type: String
  },
  blockHash: {
    type: String
  },
  blockHeight: {
    type: SimpleSchema.Integer
  },
  currencyCode: {
    type: String
  },
  amount: {
    type: Number
  },
  notified: {
    type: Boolean,
    optional: true
  },
  updatedAt: {
    type: Date,
    optional: true
  }
})
