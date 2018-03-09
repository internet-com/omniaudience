import {Meteor} from 'meteor/meteor'
import Schema from './Schema'

const Wallets = new Meteor.Collection('wallets')

Wallets.attachSchema(Schema)

global.Wallets = Wallets

export default Wallets
