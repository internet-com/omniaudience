import {Meteor} from 'meteor/meteor'
import Schema from './Schema'

const Transactions = new Meteor.Collection('transactions')

Transactions.attachSchema(Schema)

global.Transactions = Transactions

export default Transactions
