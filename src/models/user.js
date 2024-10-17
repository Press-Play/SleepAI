import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { getAuth } from "firebase/auth"
import { FitbitUserAPI } from '@/helpers/fitbit'
import Sleep from '@/models/sleep'
import Goal from '@/models/goal'

export default class User {
  constructor (id, name, email) {
    // TODO: Really need to fix this class.
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
    const user = new User(auth.currentUser.uid, auth.currentUser.displayName, auth.currentUser.email)
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

  async syncFitbit() {
    // TODO: Update this to be 2 weeks before sign up date.
    // Both of these functions don't return anything except a promise each.
    return Sleep.syncFitbit('2024-10-01')
      .then(() => {
        return Goal.syncFitbit()
      })
  }

  async getSleepGoal() {
    return await Goal.load()
  }

  async getSleepConsistencyScore(dateFrom, dateTo) {
    // Get the average consistency across date range.
    const dailys = await Sleep.getSleeps(dateFrom, dateTo)

    // Extract out just the scores asynchronously.
    let scores = []
    for (const daily of dailys) {
      let score = await daily.consistency
      scores.push(score)
    }

    const average = array => array.reduce((a, b) => a + b) / array.length
    return {
      score: await average(scores),
      range: null, // (Math.max(...sum) - Math.min(...sum)) / 60
    }
  }

  async getSleepDuration(dateFrom, dateTo) {
    // Get the average duration across date range.
    const dailys = await Sleep.getSleeps(dateFrom, dateTo)
    const goal = await Goal.load()

    // Extract out just the duration.
    let durations = []
    for (const daily of dailys) {
      let duration = daily.duration
      durations.push(duration)
    }

    const average = array => array.reduce((a, b) => a + b) / array.length
    return {
      score: average(durations) / goal.targetDuration,
      minutes: average(durations),
      range: null,
    }
  }

  async getSleepQualityScore(dateFrom, dateTo) {
    // Get the average quality across date range.
    const dailys = await Sleep.getSleeps(dateFrom, dateTo)

    // Extract out just the quality.
    let qualities = []
    for (const daily of dailys) {
      let quality = daily.quality
      qualities.push(quality)
    }

    const average = array => array.reduce((a, b) => a + b) / array.length
    return {
      score: average(qualities),
      range: null,
    }
  }
}
