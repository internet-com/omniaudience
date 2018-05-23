# Omniaudience

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Blockchain block listener for transaction notifications

### ¿How it works?

Omniaudience works by getting every block your node receives and checks if there's a transaction for a saved wallet address and then notifies to your desired endpoint.

### Installation.

This is a [Meteor](https://www.meteor.com) project. So it basically is installed the same way as any meteor project. [Orion Hosting](https://orion.hosting) recommended for faster deploying.
A Mongo Server is required for production usage. You have to set the `MONGO_URL` Environment Variable

    MONGO_URL=mongodb://username:password@your-mongo-server-here.example.com:27015/database

### Adding currencies

Adding currencies is easy. You must add a currency file in /server/imports/currencies/newCurrency.js and add it to the index.js file. Then add a document in the currencies collection with the parameters descried in /server/imports/collections/Currencies/Schema.js

### Request signature

All Request have to be signed for Security Reasons. A signature is a hash sent in the header of the requests which has the encrypted body and timestamp with a secret key you specify in the `REQUEST_SECRET` Environment Variable. All incoming request (addAddress, removeAddress) have to be signed. This is to prevent external people to add addresses to your database. Also, you should check the signature of the notification request sent to your endpoint to prevent malicious users trying to add balance to their accounts. You can see the [Sign](https://github.com/orionsoft/omniaudience/blob/master/server/imports/helpers/signatures/signRequest.js) and [Check](https://github.com/orionsoft/omniaudience/blob/master/server/imports/helpers/signatures/checkSignature.js) algorithms in the code.

Signature and timestamp have to be sent by `x-omniaudience-signature` and `x-omniaudience-timestamp` headers respectively.

### Subscribe address

To start watching and address, POST data to your server, sending an address, notifyUrl and currency code.

#### Example

```json
{
  "address": "1v5oc8QTdz4GUrvvWxGd1FaXDU62nkvRY",
  "currencyCode": "BTC"
}
```

Response is simple: "done"

### Delete subscription

To delete a subscription, POST data to your server, sending an address to delete.

#### Example

```json
{
  "address": "1v5oc8QTdz4GUrvvWxGd1FaXDU62nkvRY"
}
```

Again, response is simple: "done"

### Notifications

Notifications will send you a POST request to the endpoint specified to the wallet with the following information:

```json
{
  "address": "1v5oc8QTdz4GUrvvWxGd1FaXDU62nkvRY",
  "amount": 998919,
  "confirmations": 2,
  "confirmed": false,
  "txid": "39340d16ca69a6f904b666b93...",
  "outs": [
    {
      "value": 2507787653.0,
      "index": 0
    }
  ]
}
```

##### About notifications

* "amount" is in satoshis format.
* You will get several notifications for every transaction. The first one is when a transactions appears on the first block, then when new confirmations appear and lastly when the transaction has been confirmed.
* Outs are for storing incoming amounts to your wallet, so you can use them to create transactions.
