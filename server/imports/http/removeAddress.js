import {Picker} from 'meteor/meteorhacks:picker'
import Wallets from 'api/collections/Wallets'
import bodyParser from 'body-parser'
import checkSignature from 'api/helpers/signatures/checkSignature'

Picker.middleware(bodyParser.json())
Picker.middleware(bodyParser.urlencoded({extended: false}))

Picker.route('/removeAddress', function(params, req, res, next) {
  if (!checkSignature(JSON.stringify(req.body), req.headers)) {
    res.end('Invalid Signature')
  }

  const {address} = req.body
  Wallets.remove({address})
  res.end('done')
})
