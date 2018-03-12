import SimpleSchema from 'simpl-schema'

export default new SimpleSchema({
  txid: {
    type: String
  },
  address: {
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
  confirmed: {
    type: Boolean,
    optional: true
  },
  confirmations: {
    type: Number,
    optional: true
  },
  updatedAt: {
    type: Date,
    optional: true
  }
})
