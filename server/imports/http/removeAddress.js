import {Picker} from 'meteor/meteorhacks:picker'
import Wallets from 'api/collections/Wallets'
import bodyParser from 'body-parser'

Picker.middleware(bodyParser.json())
Picker.middleware(bodyParser.urlencoded({extended: false}))

Picker.route('/removeAddress', function(params, req, res, next) {
  const {address} = req.body
  Wallets.remove({address})
  res.end('done')
})
