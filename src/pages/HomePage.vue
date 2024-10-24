<template>
  <div class="relative mt-20 mb-28 max-w-screen-sm left-1/2 -translate-x-1/2">
    <div class="px-12">
      <h2>Hi <span class="font-bold">{{ name }}</span>!</h2>
      <p>See your sleep insights and recommendations here! 😇</p>
    </div>
    <div>
      <h3>Past 7 days</h3>
      <div class="flex flex-row m-4 justify-between">
        <div class="min-w-2"></div>
        <MetricSleepConsistency
          :initialDateFrom='dateFrom'
          :initialDateTo='dateTo'
        />
        <div class="min-w-2"></div>
        <MetricSleepDuration
          :initialDateFrom='dateFrom'
          :initialDateTo='dateTo'
        />
        <div class="min-w-2"></div>
        <MetricSleepQuality
          :initialDateFrom='dateFrom'
          :initialDateTo='dateTo'
        />
        <div class="min-w-2"></div>
      </div>
    </div>
    <!-- TODO: Only show if goal is active -->
    <div class="flex flex-row gap-4 items-center m-4 p-4 rounded-lg bg-green-100 text-left">
      <div class="text-2xl pt-2">🎯</div>
      <div>
        <h3>Goal</h3>
            <div class="flex flex-row gap-10">
              <div>
                <div>🛏️ Bed time</div>
                <!-- initialTime='timeWake' @get-time="handleGetTime" -->
                <TimePicker :small="true" :initialTime='timeBed'/>
              </div>
              <div>
                <div>⏰ Wake up</div>
                <TimePicker :small="true" :initialTime='timeWake'/>
              </div>
            </div>
      </div>
    </div>
    <div class="flex flex-row gap-4 items-top m-4 p-4 rounded-lg bg-yellow-100 text-left">
      <div class="text-2xl pt-2">🔍</div>
      <div>
        <h3>Insights</h3>
        <p><span class="font-medium">Sleep consistency</span>: There is a really high variation in the time you get to bed (the time window is 10 hours!). This is they area you should focus on first (that’s why it’s your goal). The average time you go to bed is around 1:15AM.</p>
      </div>
    </div>
    <div class="flex flex-row gap-4 items-top m-4 p-4 rounded-lg bg-sky-100 text-left">
      <div class="text-2xl pt-2">💡</div>
      <div>
      <!-- <div class="flex flex-col grow"> -->
        <h3>Recommendations</h3>
        <p>Your top priority should be to focus on sleep consistency.</p>
        <p>Consistency is the most important part of getting good sleep every night. When you go to bed at the same time every night, your body learns to anticipate sleep, which helps you get better quality sleep.</p>
        <!-- <div class="flex flex-row gap-4 p-4 mr-10 rounded-lg bg-green-100">
          <div class="text-2xl pt-2">🎯</div>
          <div class="flex flex-col grow">
            <h3>Your recommended goal</h3>
            <div class="flex flex-row gap-x-10 gap-y-0 flex-wrap">
              <div>
                <div>🛏️ Bed time</div>
                <TimePicker :small="true" :initialTime='timeBed'/>
              </div>
              <div>
                <div>⏰ Wake up</div>
                <TimePicker :small="true" :initialTime='timeWake'/>
              </div>
            </div>
            <button class="self-start">Commit to goal</button>
          </div>
        </div> -->
      </div>
    </div>
  </div>
  <div class="fixed inset-x-0 bottom-0 w-full max-w-screen-sm left-1/2 -translate-x-1/2 px-4">
    <div class="flex flex-row justify-between px-8 pt-4 pb-8 rounded-t-3xl bg-gray-100 cursor-pointer">
      <input type="text" name="chat" placeholder="Chat with coach" class="grow placeholder:text-slate-500 bg-transparent ring-0 active:none focus:outline-none focus:border-none">
      <div class="text-xl text-slate-500 cursor-pointer">&#8963;</div>
    </div>
  </div>
</template>

<script>
// TODO: Remove vuefire and just get auth'ed user from User model.
import { getCurrentUser } from 'vuefire'
import { get7DaysAgo, time24To12 } from '@/helpers/time'
import MetricSleepConsistency from '@/components/MetricSleepConsistency'
import MetricSleepDuration from '@/components/MetricSleepDuration'
import MetricSleepQuality from '@/components/MetricSleepQuality'
import TimePicker from '@/components/TimePicker'
import User from "@/models/user"

export default {
  name: 'HomePage',
  components: {
    MetricSleepConsistency,
    MetricSleepDuration,
    MetricSleepQuality,
    TimePicker,
  },
  data() {
    const dates = get7DaysAgo()

    return {
      sleepProfileProblems: "",
      name: undefined,
      dateFrom: dates.start,
      dateTo: dates.end,
      // TODO: Set these times properly.
      timeBed: '10:15 PM',
      timeWake: '7:00 AM',
    }
  },
  beforeMount() {
    this.name = this.getName()
    if (localStorage.getItem("sleepProfileProblems") !== null) {
      this.sleepProfileProblems = JSON.parse(localStorage.getItem("sleepProfileProblems"))
    }

    User.getCurrentUser()
      .then(user => {
        return user.getSleepGoal()
      })
      .then(goal => {
        if (goal) {
          // this.sleepDurationGoal = goal.targetDuration
          this.timeBed = time24To12(goal.targetTimeBed)
          this.timeWake = time24To12(goal.targetTimeWake)
        }
      })
  },
  methods: {
    async getName() {
      const user = await getCurrentUser()
      this.name = user.displayName
    },
    // TODO: Handle emit event for time selectors.
  },
}
</script>