# Omniaudience

\[!\[npm version\](https://badge.fury.io/js/react-apollo-decorators.svg)\](https://badge.fury.io/js/react-apollo-decorators)
\[!\[js-standard-style\](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)\](http://standardjs.com/)

Blockchain block listener for transaction notifications

### ¿How it works?

Omniaudience works by getting every block your node receives and checks if there's a transaction for a saved wallet address and then notifies to your desired endpoint.

### Subscribe address

To start watching and address, POST data to your server, sending an address, notifyUrl and currency code.

#### Example

```json
{
  "address": "1v5oc8QTdz4GUrvvWxGd1FaXDU62nkvRY",
  "notifyUrl": "http://omniaudience.requestcatcher.com/test",
  "currencyCode": "BTC"
}
```

Response is simple: "done"

### Delete Subscription

To delete a suscription, POST data to your server, sending an address to delete.

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
  "amount": 998919, // amount in satoshis
  "confirmed": false // true if the transaction is confirmed
}
```

Basically you will get 2 notifications for every transaction. The first one is when a transactions appears on a block and a second one when the transaction has been confirmed.
