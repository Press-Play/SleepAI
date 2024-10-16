<template>
  <div class="relative mt-20 mb-20 max-w-screen-sm left-1/2 -translate-x-1/2">
    <div class="px-12">
      <h2>Hi <span class="font-bold">{{ name }}</span>!</h2>
      <p>See your sleep insights and recommendations here! 😇</p>
    </div>
    <div>
      <h3>Past 7 days</h3>
      <div class="flex flex-row gap-8 m-4 justify-center">
        <MetricSleepConsistency
          :initialDateFrom='dateFrom'
          :initialDateTo='dateTo'
        />
        <MetricSleepConsistency
          :initialDateFrom='dateFrom'
          :initialDateTo='dateTo'
        />
        <MetricSleepConsistency
          :initialDateFrom='dateFrom'
          :initialDateTo='dateTo'
        />
      </div>
    </div>
    <!-- TODO: Only show if goal is active -->
<!--     <div class="flex flex-row gap-4 items-center m-4 p-4 rounded-lg bg-green-100 text-left">
      <div class="text-2xl pt-2">🎯</div>
      <div>
        <div>1. Be in bed 10:30PM – 11:00PM</div>
        <div>2. Wake up around 7:00AM</div>
      </div>
    </div> -->
    <div class="flex flex-row gap-4 items-top m-4 p-4 rounded-lg bg-yellow-100 text-left">
      <div class="text-2xl pt-2">🔍</div>
      <div>
        <h3>Insights</h3>
        <p><span class="font-medium">Sleep consistency</span>: There is a really high variation in the time you get to bed (the time window is 10 hours!). This is they area you should focus on first (that’s why it’s your goal). The average time you go to bed is around 1:15AM.</p>
      </div>
    </div>
    <div class="flex flex-row gap-4 items-top m-4 p-4 rounded-lg bg-sky-100 text-left">
      <div class="text-2xl pt-2">💡</div>
      <div class="flex flex-col grow">
        <h3>Recommendations</h3>
        <p>Your top priority should be to focus on sleep consistency.</p>
        <p>Consistency is the most important part of getting good sleep every night. When you go to bed at the same time every night, your body learns to anticipate sleep, which helps you get better quality sleep.</p>
        <div class="p-4 mr-10 rounded-lg bg-green-100">
          <p class="font-medium">🎯 Your recommended goal:</p>
          <ol>
            <li>1. Be in bed 10:30PM – 11:00PM</li>
            <li>2. Wake up around 7:00AM</li>
          </ol>
          <button>Commit to goal</button>
        </div>
      </div>
    </div>


    <button @click="getSleeps()" class="mb-10">Get sleeps</button>
  </div>
  <div class="fixed inset-x-0 bottom-0 w-full max-w-screen-sm left-1/2 -translate-x-1/2 px-4">
    <div class="flex flex-row justify-between px-8 pt-4 pb-8 rounded-t-3xl bg-gray-100 cursor-pointer">
      <input type="text" name="chat" placeholder="Chat with coach" class="grow placeholder:text-slate-500 bg-transparent ring-0 active:none focus:outline-none focus:border-none">
      <div class="text-xl text-slate-500 cursor-pointer">&#8963;</div>
    </div>
  </div>
</template>

<script>
import { getCurrentUser } from 'vuefire'
import Sleep from '@/models/sleep'
import MetricSleepConsistency from '@/components/MetricSleepConsistency'

export default {
  name: 'HomePage',
  components: {
    MetricSleepConsistency
  },
  data() {
    return {
      sleepProfileProblems: "",
      name: undefined,
      dateFrom: '2024-10-06',
      dateTo: '2024-10-12',
    }
  },
  beforeMount() {
    this.name = this.getName()
    if (localStorage.getItem("sleepProfileProblems") !== null) {
      this.sleepProfileProblems = JSON.parse(localStorage.getItem("sleepProfileProblems"))
    }
  },
  methods: {
    async getName() {
      const user = await getCurrentUser()
      this.name = user.displayName
    },
    async getSleeps() {
      return await Sleep.getSleeps('2024-10-01', '2024-10-17')
    }
  },
}
</script>