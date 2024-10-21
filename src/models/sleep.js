import { getFirestore, collection, doc, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { FitbitUserAPI } from '@/helpers/fitbit'
import User from "@/models/user"
import Goal from "@/models/goal"
import moment from 'moment'

// TODO: Write functions to get calculated fields: latency, consistency.
export default class Sleep {
  constructor(
    id,
    uuid,
    date,
    timeStart,
    timeEnd,
    main,
    duration,
    breakdown,
    ) {
    this.id = id 
    this.uuid = uuid
    this.date = new Date(date) //timestamp at 00:00:00 UTC+10 (user's local time)
    this.timeStart = new Date(timeStart)
    this.timeEnd = new Date(timeEnd)
    this.main = main //boolean
    this.duration = duration //number
    this.breakdown = breakdown //map
    this._ref = undefined
  }

  static getFirestoreConverter() {
    return {
      toFirestore: (sleep) => {
        return {
          id: sleep.id,
          uuid: doc(getFirestore(), 'users', sleep.uuid),
          date: sleep.date,
          timeStart: sleep.timeStart,
          timeEnd: sleep.timeEnd,
          main: sleep.main,
          duration: sleep.duration,
          breakdown: sleep.breakdown,
        }
      },
      fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options)
        data.breakdown.data.map((period) => period.time = period.time.toDate())

        return new Sleep(
          snapshot.id,
          data.uuid.path.split('/')[1],
          data.date.toDate(),
          data.timeStart.toDate(),
          data.timeEnd.toDate(),
          data.main,
          data.duration,
          data.breakdown,
        )
      }
    }
  }

  get opportunity() {
    const start = moment(this.timeStart)
    const end = moment(this.timeEnd)
    return moment.duration(end.diff(start)).as('minutes')
  }

  get efficiency() {
    return Math.round(this.duration / this.opportunity * 1e2) / 1e2
  }

  get latency() {
    // Get the first sleep stage and return as latency (minutes) if is it a 'wake stage'.
    for (const period of this.breakdown.data) {
      if (this.timeStart.getTime() === period.time.getTime() && period.stage === 'wake') {
        return period.seconds / 60
      }
    }
    // If the first sleep stage recorded is not 'wake', then latency is 0.
    return 0
  }

  get consistency() {
    return Goal.load()
      .then(goal => {
        let bed = moment(goal.targetTimeBed, 'HH:mm')
        let wake = moment(goal.targetTimeWake, 'HH:mm')

        // Set the target bedtime date to the date of the sleep.
        const sleepDate = moment(this.date.getTime())
        bed.set({
          'year': sleepDate.year(),
          'month': sleepDate.month(),
          'date': sleepDate.date(),
        })
        wake.set({
          'year': sleepDate.year(),
          'month': sleepDate.month(),
          'date': sleepDate.date(),
        })
        if (wake.isBefore(bed)) {
          bed.subtract(1, 'd')
        }

        // Get the absolute difference between target and actual for both bed time and wake time.
        const sum =
          Math.abs(moment(this.timeStart.getTime()).diff(bed, 'minutes')) +
          Math.abs(moment(this.timeEnd.getTime()).diff(wake, 'minutes'))

        // Normalise, and flip to create a percentage score.
        let score = 1 - (Math.round(sum / 3) / 100)
        if (score < 0) {
          score = 0
        }
        return score
      })
  }

  // TODO: This will be a complex calculation that takes into account
  //         1. The different proportion of the sleep stages.
  //         2. ?
  // For now just return efficiency.
  get quality() { return this.efficiency }

  // static async getSleepDate(date) {
  //   const ref = doc(getFirestore(), 'sleeps', id).withConverter(Sleep.getFirestoreConverter())
  //   const sleep = await getDoc(ref)
  //   sleep._ref = ref
  //   return sleep
  // }

  static async getUserSleepLatest() {
    const user = await User.getCurrentUser()
    console.log('Getting latest sleep data for user:', user.id)
    const ref = collection(getFirestore(), 'sleeps').withConverter(Sleep.getFirestoreConverter())
    const userRef = doc(getFirestore(), 'users', user.id)
    const q = query(ref, where('uuid', '==', userRef), orderBy('date', 'desc'), limit(1))
    const snap = await getDocs(q)
    let result = null
    snap.forEach((doc) => {
      result = doc.data()
    })
    return result
  }

  static async getSleeps(dateFrom, dateTo) {
    const user = await User.getCurrentUser()
    console.log('Getting latest sleep data for user:', user.id)
    const ref = collection(getFirestore(), 'sleeps').withConverter(Sleep.getFirestoreConverter())
    const userRef = doc(getFirestore(), 'users', user.id)
    const q = query(
      ref,
      where('uuid', '==', userRef),
      where('date', '>=', new Date(dateFrom)),
      where('date', '<=', new Date(dateTo)),
      orderBy('date', 'desc'),
    )
    const snap = await getDocs(q)
    let result = []
    snap.forEach((doc) => {
      result.push(doc.data())
    })
    return result
  }

  // static async saveSleepGoal() {
  //   TODO: Call the Goal model to save.
  // }

  static async syncFitbit(dateFrom) {
    // Get latest sleep date from database.
    const latest = await Sleep.getUserSleepLatest()

    // If there is no sleeps available, sync the last 2 weeks before sign up
    // until today. Otherwise, query Fitbit for sleep log list from that date
    // until today.
    console.log('latest:', latest)
    if (latest) {
      let dateCalc = new Date(latest.date)
      dateCalc.setDate(dateCalc.getDate() + 1)
      dateFrom = dateCalc.toISOString().slice(0, 10)
    }

    const ref = collection(getFirestore(), 'sleeps').withConverter(Sleep.getFirestoreConverter())
    const api = new FitbitUserAPI()
    const data = await api.getSleepLogList(dateFrom)
    for (const s of data) {
      const mapped = await Sleep.mapFitbitSleepLog(s)
      if (!mapped.uuid) {
        throw new Error('A uuid is required to save a sleep.')
      }
      await addDoc(ref, mapped)
    }
  }

  static async mapFitbitSleepLog(log) {
    const breakdown = {
      // Fitbit also supports 'asleep', 'awake', 'restless' for naps.
      summary: {
        minutesAwake: log.levels.summary.wake ? log.levels.summary.wake.minutes : 0,
        minutesCore: log.levels.summary.light ? log.levels.summary.light.minutes : 0,
        minutesDeep: log.levels.summary.deep ? log.levels.summary.deep.minutes : 0,
        minutesREM: log.levels.summary.rem ? log.levels.summary.rem.minutes : 0,
      },
      data: Sleep.mapFitbitSleepLogLevelsData(log.levels.data),
    }
    console.log('breakdown:', breakdown)
    const user = await User.getCurrentUser()
    return new Sleep(
      null,
      user.id,
      log.dateOfSleep,
      log.startTime,
      log.endTime,
      log.isMainSleep,
      log.minutesAsleep,
      breakdown,
    )
  }

  static mapFitbitSleepLogLevelsData(data) {
    let result = []
    for (const level of data) {
      result.push({
        time: new Date(level.dateTime),
        stage: level.level,
        seconds: level.seconds,
      })
    }
    return result
  }
}