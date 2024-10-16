import { getFirestore, collection, doc, addDoc, getDocs, query, where } from 'firebase/firestore'
import { FitbitUserAPI } from '@/helpers/fitbit'
import User from "@/models/user"

export default class Goal {
  constructor(
    targetDuration,
    targetTimeBed,
    targetTimeWake,
    uuid,
    active = false,
    ) {
    this.targetDuration = targetDuration
    this.targetTimeBed = targetTimeBed
    this.targetTimeWake = targetTimeWake
    this.uuid = uuid
    this.active = active
  }

  static getFirestoreConverter() {
    return {
      toFirestore: (goal) => {
        console.log('toFirestore(goal):', goal)
        return {
          // id: goal.id,
          targetDuration: goal.targetDuration,
          targetTimeBed: goal.targetTimeBed,
          targetTimeWake: goal.targetTimeWake,
          uuid: doc(getFirestore(), 'users', goal.uuid),
          active: goal.active,
        }
      },
      fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options)

        return new Goal(
          data.uuid.path.split('/')[1],
          data.targetDuration,
          data.targetTimeBed.toDate(),
          data.targetTimeWake.toDate(),
          data.active,
        )
      }
    }
  }

  static async load() {
    const user = await User.getCurrentUser()
    const ref = collection(getFirestore(), 'goals').withConverter(Goal.getFirestoreConverter())
    const userRef = doc(getFirestore(), 'users', user.id)
    const q = query(ref, where('uuid', '==', userRef))
    const snap = await getDocs(q)
    let result = null
    snap.forEach((doc) => {
      result = doc.data()
    })
    return result
  }

  // static async save() {
  //   TODO: Save new goals to database and set to active.
  //   TODO: Sync goals from database to Fitbit?
  // }

  static async syncFitbit() {
    // TODO: Save sleep goal to database if it doesn't exist.
    const result = await Goal.load()
    if (result) {
      return result
    }

    const ref = collection(getFirestore(), 'goals').withConverter(Goal.getFirestoreConverter())
    const api = new FitbitUserAPI()
    const data = await api.getSleepGoal()
    const user = await User.getCurrentUser()
    
    if (!data.goal.minDuration || !data.goal.bedtime || !data.goal.wakeupTime) {
      throw new Error('Missing or no sleep goals in Fitbit found.')
    }

    const goal = new Goal(
      data.goal.minDuration / 60,
      data.goal.bedtime,
      data.goal.wakeupTime,
      user.id,
    )
    return await addDoc(ref, goal)
  }
}