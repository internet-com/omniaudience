import {Meteor} from 'meteor/meteor'
import Schema from './Schema'

const Currencies = new Meteor.Collection('currencies')

Currencies.attachSchema(Schema)

global.Currencies = Currencies

export default Currencies
