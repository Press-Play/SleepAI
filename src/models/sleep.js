import { getFirestore, collection, doc, addDoc, getDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore'
import { FitbitUserAPI } from '@/helpers/fitbit'
import User from "@/models/user"
import moment from 'moment'

// TODO: Write functions to get calculated fields: latency, consistency.
export default class Sleep {
  constructor (
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
    this.uuid = doc(getFirestore(), 'users', uuid),
    this.date = Timestamp.fromDate(new Date(date)) //timestamp at 00:00:00 UTC+10 (user's local time)
    this.timeStart = Timestamp.fromDate(new Date(timeStart))
    this.timeEnd = Timestamp.fromDate(new Date(timeEnd))
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
          uuid: sleep.uuid,
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
        return new Sleep(
          data.id,
          data.uuid,
          data.date,
          data.timeStart,
          data.timeEnd,
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
    return (this.duration / this.opportunity).toFixed(2)
  }

  static async getSleep(id) {
    // If an id is given, get sleep log from the database.
    // If no id is given, create a new sleep log instance to be saved.
    const ref = doc(getFirestore(), 'sleeps', id).withConverter(Sleep.getFirestoreConverter())
    const sleep = await getDoc(ref)
    sleep._ref = ref
    return sleep
  }

  // static async getUserSleep(uuid, date) {

  // }

  static async getUserSleepLatest(uuid) {
    const ref = collection(getFirestore(), 'sleeps').withConverter(Sleep.getFirestoreConverter())
    const q = query(ref, where('uuid', '==', uuid), orderBy('date', 'desc'), limit(1))
    const snap = await getDocs(q)
    snap.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      return doc
    });
  }

  static async syncFitbit(dateFrom) {
    const ref = collection(getFirestore(), 'sleeps').withConverter(Sleep.getFirestoreConverter())
    const api = new FitbitUserAPI()
    const data = await api.getSleepLogList(dateFrom)
    console.log('sleep data:', data)
    for (const s of data) {
      const mapped = await Sleep.mapFitbitSleepLog(s)
      if (!mapped.uuid) {
        throw new Error('A uuid is required to save a sleep.')
      }
      console.log('Mapped sleep', mapped)
      const doc = await addDoc(ref, mapped)
      console.log('Added doc:', doc)
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
      // TODO: Add sleep stage data here.
      // data: {},
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
}