<template>
  <div class="relative mt-20 mb-20 max-w-screen-sm left-1/2 -translate-x-1/2">
    <div class="flex flex-col flex-wrap align-center">
      <div class="px-12">
        <h2><span class="font-bold">{{ name }}</span>, consistency is the foundation of sleep</h2>
        <p>Getting to bed at the same time is the <span class="font-bold">best</span> way to improve your sleep.</p>
      </div>
      <h3 class="mt-6">When do you need to wake up by?</h3>
      <!-- <p>Your current goal for sleep is {{ sleepDurationGoal }} hours per night.</p> -->
      <TimePicker :initialTime='timeWake' @get-time="handleGetTime"/>
      <p class="mx-12">Based on your sleep data, your bedtime should be no later than {{ timeBed }}.</p>
      <button @click="goToNext()">
        <span>Next →</span>
      </button>
    </div>
  </div>
</template>

<script>
import { getCurrentUser } from 'vuefire'
import TimePicker from '@/components/TimePicker'
import { get7DaysAgo, time24To12, time12To24, roundUp15Minutes, subtractDurationFromTime } from "@/helpers/time"
import User from "@/models/user"
import Goal from "@/models/goal"

export default {
  name: 'OnboardingGoals',
  components: {
    TimePicker
  },
  data() {
    return {
      name: undefined,
      timeBed: undefined,
      timeWake: undefined,
      sleepDurationGoal: undefined,
      sleepEfficiency: undefined,
    }
  },
  beforeMount() {
    this.name = this.getName()
    this.getSleepGoal()
  },
  methods: {
    async getName() {
      const user = await getCurrentUser()
      this.name = user.displayName
    },
    async getSleepGoal() {
      const user = await User.getCurrentUser()
      const dates = get7DaysAgo()

      user.getSleepEfficiency(dates.start, dates.end)
        .then(efficiency => {
          this.sleepEfficiency = efficiency
          return user.getSleepGoal()
        })
        .then(goal => {
          if (goal) {
            this.sleepDurationGoal = goal.targetDuration
            this.timeBed = this.time24To12(goal.targetTimeBed)
            this.timeWake = this.time24To12(goal.targetTimeWake)
          } else {
            // Set defaults.
            this.sleepDurationGoal = 7 * 60
            this.timeBed = this.time24To12('22:15')
            this.timeWake = '7:00 AM'
          }
        })
    },
    time24To12(t) {
      return time24To12(t)
    },
    time12To24(t) {
      return time12To24(t)
    },
    handleGetTime(t) {
      // When the time is updated, consume the emitted event to calculate the
      // bed time based on sleep duration goal and past 7d efficiency.
      this.timeWake = t
      // this.timeBed = moment(this.timeWake, 'hh:mm A').subtract(
      //   moment.duration(this.sleepDurationGoal / this.sleepEfficiency, 'minutes'))
      //   .format('hh:mm A')
      this.timeBed = subtractDurationFromTime(this.timeWake, this.sleepDurationGoal / this.sleepEfficiency)
      this.timeBed = this.roundUp15Minutes(this.timeBed)
    },
    roundUp15Minutes(t) {
      return roundUp15Minutes(t)
    },
    async goToNext() {
      // TODO: Save goal, but set as inactive.
      const user = await User.getCurrentUser()
      const goal = new Goal(
        this.sleepDurationGoal,
        this.time12To24(this.timeBed),
        this.time12To24(this.timeWake),
        user.id,
      )
      goal.save()
      this.$router.push('/')
    },
  },
}
</script>