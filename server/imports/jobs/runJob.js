import {Meteor} from 'meteor/meteor'
import env from 'api/helpers/env'
import runPromise from 'api/helpers/runPromise'
import range from 'lodash/range'
import includes from 'lodash/includes'

const stoppedJobs = []

global.stopJob = name => stoppedJobs.push(name)

const runJob = Meteor.bindEnvironment(function({job, name, waitTime, timeout: timeoutTime}) {
  if (includes(stoppedJobs, name)) return

  let didActivateTimeout = false
  const timeout = Meteor.setTimeout(() => {
    didActivateTimeout = true
    console.log('timeout, will run again', name)
    Meteor.defer(() => runJob({job, name, waitTime, timeout: timeoutTime}))
  }, timeoutTime)

  try {
    let nextWaitTime = waitTime
    // measure(name)
    const result = runPromise(async () => await job(nextWaitTime))
    // measure(name)
    const multiplier = env === 'local' ? 10 : 1
    nextWaitTime = result * multiplier || waitTime * multiplier
    clearTimeout(timeout)
    Meteor._sleepForMs(nextWaitTime)
  } catch (error) {
    console.error('Error in job', name, error)
    console.error(error.stack)
    clearTimeout(timeout)
    Meteor._sleepForMs(waitTime)
  }

  if (!didActivateTimeout) {
    Meteor.defer(() => runJob({job, name, waitTime, timeout: timeoutTime}))
  }
})

export default function({job, waitTime, concurrency, timeout, cron, name, should}) {
  concurrency = concurrency || 1
  for (const index of range(concurrency)) {
    console.log('Starting', name, index)
    Meteor._sleepForMs(100)
    Meteor.defer(() => runJob({job, name, waitTime, timeout}))
  }
}
