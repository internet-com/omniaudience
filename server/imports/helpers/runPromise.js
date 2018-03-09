import {Meteor} from 'meteor/meteor'

export default function(promise, ...params) {
  const syncFunc = Meteor.wrapAsync(async callback => {
    try {
      const result = await promise(...params)
      callback(null, result)
    } catch (error) {
      callback(error)
    }
  })
  return syncFunc()
}
