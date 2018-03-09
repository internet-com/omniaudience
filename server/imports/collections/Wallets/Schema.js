import SimpleSchema from 'simpl-schema'

export default new SimpleSchema({
  address: {
    type: String,
    index: 1
  },
  currencyCode: {
    type: String
  },
  notifyUrl: {
    type: String,
    optional: true
  },
  updatedAt: {
    type: Date,
    optional: true
  }
})
