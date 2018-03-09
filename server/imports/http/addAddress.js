import {Picker} from 'meteor/meteorhacks:picker'
import Wallets from 'api/collections/Wallets'
import bodyParser from 'body-parser'

Picker.middleware(bodyParser.json())
Picker.middleware(bodyParser.urlencoded({extended: false}))

Picker.route('/addAddress', function(params, req, res, next) {
  const {address, notifyUrl, currencyCode} = req.body
  Wallets.update({address}, {$set: {address, notifyUrl, currencyCode}}, {upsert: true})
  res.end('done')
})
