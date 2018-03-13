import SimpleSchema from 'simpl-schema'

export default new SimpleSchema({
  name: {
    type: String
  },
  code: {
    type: String
  },
  requiredConfirmations: {
    type: SimpleSchema.Integer
  },
  maxTransactionTime: {
    type: SimpleSchema.Integer
  },
  latestBlockNumber: {
    type: SimpleSchema.Integer,
    optional: true
  },
  latestBlockHash: {
    type: String,
    optional: true
  },
  api: {
    type: String
  },
  updatedAt: {
    type: Date,
    optional: true
  },
  active: {
    type: Boolean,
    optional: true
  },
  updating: {
    type: Boolean,
    optional: true
  }
})
