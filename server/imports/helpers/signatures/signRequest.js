import JSSHA from 'jssha'

export default function(body, timestamp) {
  let shaObj = new JSSHA('SHA-512', 'TEXT')
  shaObj.setHMACKey(process.env.REQUEST_SECRET, 'TEXT')
  shaObj.update(timestamp + body)
  return shaObj.getHMAC('HEX')
}
