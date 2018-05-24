import rp from 'request-promise'
import signRequest from 'api/helpers/signatures/signRequest'

export default function(body) {
  // Sign requests for better security (avoid fraudulent requests)
  const timestamp = new Date().getTime() / 1000
  const signature = signRequest(JSON.stringify(body), timestamp)
  return rp({
    uri: process.env.NOTIFY_URL,
    method: 'POST',
    headers: {
      'x-omniaudience-signature': signature,
      'x-omniaudience-timestamp': timestamp
    },
    json: true,
    body
  })
}
