import JSSHA from 'jssha'

export default function(body, headers) {
  const timestamp = new Date(headers['x-omniaudience-timestamp'] * 1000)
  const maxDiffInMs = 1000 * 30 // 30s
  const dateDiff = new Date().getTime() - timestamp
  if (dateDiff > maxDiffInMs) {
    return false
  }
  const signature = headers['x-omniaudience-signature']

  var shaObj = new JSSHA('SHA-512', 'TEXT')
  shaObj.setHMACKey(process.env.REQUEST_SECRET, 'TEXT')
  shaObj.update(headers['x-omniaudience-timestamp'] + body)
  const calculatedSignature = shaObj.getHMAC('HEX')
  if (signature !== calculatedSignature) {
    return false
  }
  return true
}
