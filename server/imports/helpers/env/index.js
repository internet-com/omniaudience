import {Meteor} from 'meteor/meteor'

let env = 'local'

Meteor.startup(function() {
  console.log(`Running CryptoWatcher server [${env}]`)
})

export default env
