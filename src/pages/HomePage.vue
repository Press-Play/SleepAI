<template>
  <div class="relative mt-20 mb-20 max-w-screen-sm left-1/2 -translate-x-1/2">
    <div class="px-12">
      <h2>Hi <span class="font-bold">{{ name }}</span>!</h2>
      <p>See your sleep insights and recommendations here! 😇</p>
    </div>
    <div class="flex flex-row gap-4 items-center m-4 p-4 rounded-lg bg-green-100 text-left">
      <div>🎯</div>
      <div>
        <div>1. Be in bed 10:30PM – 11:00PM</div>
        <div>2. Wake up around 7:00AM</div>
      </div>
    </div>
    <div class="flex flex-row gap-4 items-center m-4 p-4 rounded-lg bg-gray-100 text-left">
      <div>🔍</div>
      <div>
        <MetricSleepConsistency
          :initialDateFrom='dateFrom'
          :initialDateTo='dateTo'
        />
        <div>It looks like you have trouble sleeping at the same time every day.</div>
        <div>Learn more.</div>
      </div>
    </div>
    <div class="flex flex-row gap-4 items-center m-4 p-4 rounded-lg bg-gray-100 text-left">
      <div>💡</div>
      <div class="flex flex-col grow">
        <h3 class="text-center">Your personalised recommendations</h3>
        <p>Focus on sleep consistency.</p>
        <p>Consistency is the most important part of getting good sleep every night. When you go to bed at the same time every night, your body learns to anticipate sleep, which helps you sleep better and longer.</p>
        <div class="text-2xl">
          Be in be by 10:30PM to 11:00PM, waking up around 7:00AM
        </div>
        <p>Find out how to build a consistent sleep habit.</p>
        <button>Set goal 🎯</button>
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
import { getCurrentUser } from 'vuefire'
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
    }
  },
}
</script>