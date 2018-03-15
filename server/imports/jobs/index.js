import {Meteor} from 'meteor/meteor'
import runJob from './runJob'
import watchBlocks from './watchBlocks'
const isLocal = false

const jobs = [
  {
    job: watchBlocks,
    waitTime: 10000,
    timeout: 10 * 60 * 1000, // muchos minutos
    name: 'watchBlocks',
    should: 'watchBlocks'
  }
]

Meteor.setTimeout(() => {
  console.log('Starting jobs...')
  for (const job of jobs) {
    runJob(job)
  }
}, isLocal ? 100 : 10 * 1000)
