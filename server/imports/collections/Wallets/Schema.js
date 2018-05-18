import SimpleSchema from 'simpl-schema'

export default new SimpleSchema({
  address: {
    type: String,
    index: 1
  },
  currencyCode: {
    type: String
  },
  updatedAt: {
    type: Date,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true
  }
})
