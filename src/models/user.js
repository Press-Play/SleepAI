import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { getAuth } from "firebase/auth"
import { FitbitUserAPI } from '@/helpers/fitbit'
import moment from 'moment'

export default class User {
  constructor (id, name, email) {
    // TODO: Get all user fields from database.
    if (!id) {
      throw new Error('User requires an id.')
    }
    this.id = id
    this.name = name
    this.email = email
    this._ref = this.ref
    this._apiFitbit = new FitbitUserAPI()
    //fitbitUserId
  }

  static firestoreConverter() {
    return {
      toFirestore: (user) => {
        return {
          name: user.name,
          email: user.email,
        }
      },
      fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options)
        return new User(data.id, data.name, data.email)
      }
    }
  }

  static async getCurrentUser() {
    const auth = getAuth()
    const user = new User(auth.currentUser.uid, auth.currentUser.name, auth.currentUser.email)
    user.load()
    return user
  }

  get ref() {
    if (!this._ref) {
      this._ref = doc(getFirestore(), 'users', this.id).withConverter(User.firestoreConverter)
    }
    return this._ref
  }

  async load() {
    const user = await getDoc(this.ref)
    this.name = user.name
    this.email = user.email
  }

  save() {
    return setDoc(this._ref, this, {merge: true})
  }

  async getSleepGoal() {
    // TODO: Get sleep goal from database if exists.
    return this._apiFitbit.getSleepGoal()
      .then(data => {
        // Target times are formatted as HH:mm (24-hour time).
        return {
          targetBedTime: data.goal.bedtime,
          targetWakeTime: data.goal.wakeupTime,
          targetSleepDuration: data.goal.minDuration / 60,
        }
      })
  }

  async getMetricSleepConsistency(dateFrom, dateTo) {
    // TODO: Get these from the database instead of Fitbit API.
    // Query sleep goals to get targetBedTime and targetWakeTime.
    const sleepGoal = await this.getSleepGoal()

    // Query sleep data for the user over the date range.
    return this._apiFitbit.getSleepLogList(dateFrom, dateTo)
      .then(data => {
        console.log(dateFrom, dateTo)
        console.log('sleepGoal:', sleepGoal)
        console.log('data:', data)
        let targetBedTime = moment(sleepGoal.targetBedTime, 'HH:mm')
        let targetWakeTime = moment(sleepGoal.targetWakeTime, 'HH:mm')
        let diffBed = []
        let diffWake = []
        for (const session of data) {
          const sleepDate = moment(session.dateOfSleep)
          targetBedTime.set({
            'year': sleepDate.year(),
            'month': sleepDate.month(),
            'date': sleepDate.date(),
          })
          targetWakeTime.set({
            'year': sleepDate.year(),
            'month': sleepDate.month(),
            'date': sleepDate.date(),
          })
          if (targetWakeTime.isBefore(targetBedTime)) {
            targetBedTime.subtract(1, 'd')
          }
          diffBed.push(Math.abs(moment(session.startTime, moment.ISO_8601).diff(targetBedTime, 'minutes')))
          diffWake.push(Math.abs(moment(session.endTime, moment.ISO_8601).diff(targetWakeTime, 'minutes')))
        }
        let sum = diffBed.map(function (num, i) {
          return num + diffWake[i];
        })
        const average = array => array.reduce((a, b) => a + b) / array.length

        // console.log('diffBed:', diffBed)
        // console.log('diffWake:', diffWake)
        // console.log('sum:', sum)
        // console.log('average:', average(sum))
        return {
          score: 1 - (Math.round(average(sum) / 3) / 100),
          range: (Math.max(...sum) - Math.min(...sum)) / 60
        }
      })

    // Get the diffs.

    // Calculate and return the score.
    // return Math.mean()
    // return {score: 0.8, range: '0:30'}
  }
}
