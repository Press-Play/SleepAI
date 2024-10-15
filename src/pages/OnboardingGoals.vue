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
      <p>Based on your sleep data, your bedtime should be no later than {{ timeBed }}.</p>
      <button @click="goToNext()">
        <span>Next →</span>
      </button>
    </div>
  </div>
</template>

<script>
import { getCurrentUser } from 'vuefire'
import { FitbitUserAPI } from '@/helpers/fitbit.js'
import TimePicker from '@/components/TimePicker.vue'
import moment from 'moment';

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
      // TODO: Need to calculate based on sleep data.
      sleepEfficiency: 0.8,
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
    getSleepGoal() {
      const api = new FitbitUserAPI()
      api.getSleepGoal().then(data => {
        console.log('sleepGoal:', data)
        this.sleepDurationGoal = data.goal.minDuration / 60
        this.timeBed = this.time24To12(data.goal.bedtime)
        this.timeWake = this.time24To12(data.goal.wakeupTime)
        return data
      }).catch(error => {
        console.log(error)
        // Set to defaults.
        this.sleepDurationGoal = 7
        this.timeBed = this.time24To12('22:15')
        this.timeWake = '7:00 AM'
      })
    },
    time24To12(t) {
      // const hour = t.split(':')[0]
      // return hour > 12 ? hour + ':' + t.split(':')[1] + ' PM' : t + ' AM'
      return moment(t, 'HH:mm').format('hh:mm A')
    },
    handleGetTime(t) {
      this.timeWake = t
      this.timeBed = moment(this.timeWake, 'hh:mm A').subtract(
        moment.duration(this.sleepDurationGoal / this.sleepEfficiency, 'hours'))
        .format('hh:mm A')
      this.timeBed = this.roundUp15Minutes(this.timeBed)
      console.log('this.timeWake:', this.timeWake)
      console.log('this.timeBed:', this.timeBed)
    },
    roundUp15Minutes(t) {
      const start = moment(t, 'hh:mm A');
      const remainder = 15 - (start.minute() % 15);
      const finish = moment(start)
        .add(remainder, 'minutes')
        .format('hh:mm A')
      return finish
    },
    goToNext() {
      this.$router.push('/')
    },
  },
}
</script>