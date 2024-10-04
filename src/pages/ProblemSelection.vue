<template>
  <div class="relative mt-20 mb-20">
    <div class="px-12">
      <h2><span class="font-bold">Khanh</span>, build your sleep profile</h2>
      <p>This will help us make personalised recommendations. Tell me what you have trouble with...</p>
    </div>
    <div class="flex flex-col gap-0 py-4">
      <div class="grid grid-cols-1 gap-4">
        <div class="relative flex flex-col align-center justify-center cursor-pointer text-xl border-gray-300 bg-sky-300 text-slate-900 p-4 hover:border-slate-400 hover:bg-sky-300/75">
          <div class="font-normal hover:text-slate-800">Getting to sleep</div>
          <div>
            <div class="text-sm">Because I...</div>
            <div class="flex flex-wrap justify-center gap-2 mt-2">
              <span v-for="problem in sleepProblems.beforeSleep" :key="problem" class="inline-flex align-center items-center gap-x-2 rounded-full cursor-pointer text-sm text-sky-900 px-4 ring-1 ring-inset ring-sky-100 bg-sky-200 hover:bg-sky-200/75">
                <div>{{ problem }}</div>
                <div class="text-2xl">+</div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4">
        <div class="relative flex flex-col align-center justify-center cursor-pointer text-xl border-gray-300 bg-indigo-300 text-slate-900 p-4 hover:border-slate-400 hover:bg-indigo-300/75 hover:text-slate-800">Sleeping
          <div>
            <div class="text-sm">Because I...</div>
            <div class="flex flex-wrap justify-center gap-2 mt-2">
              <span v-for="problem in sleepProblems.duringSleep" :key="problem" class="inline-flex align-center items-center gap-x-2 rounded-full cursor-pointer text-sm text-indigo-900 px-4 ring-1 ring-inset ring-indigo-100 bg-indigo-200 hover:bg-indigo-200/75">
                <div>{{ problem }}</div>
                <div class="text-2xl">+</div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4">
        <div class="relative flex flex-col align-center justify-center cursor-pointer text-xl border-gray-300 bg-orange-300 text-slate-900 p-4 hover:border-slate-400 hover:bg-orange-300/75 hover:text-slate-800">Waking up
          <div>
            <div class="text-sm">Because I...</div>
            <div class="flex flex-wrap justify-center gap-2 mt-2">
              <span v-for="problem in sleepProblems.afterSleep" :key="problem" class="inline-flex align-center items-center gap-x-2 rounded-full cursor-pointer text-sm text-orange-900 px-4 ring-1 ring-inset ring-orange-100 bg-orange-200 hover:bg-orange-200/75">
                <div>{{ problem }}</div>
                <div class="text-2xl">+</div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4">
        <div class="relative flex flex-col align-center justify-center cursor-pointer text-xl border-gray-300 bg-amber-200 text-slate-900 p-4 hover:border-slate-400 hover:bg-amber-200/75 hover:text-slate-800">During the day
          <div>
            <div class="text-sm">I...</div>
            <div class="flex flex-wrap justify-center gap-2 mt-2">
              <span v-for="problem in sleepProblems.duringDay" :key="problem" class="inline-flex align-center items-center gap-x-2 rounded-full cursor-pointer text-sm text-amber-900 px-4 ring-1 ring-inset ring-amber-50 bg-amber-100 hover:bg-amber-100/75">
                <div>{{ problem }}</div>
                <div class="text-2xl">+</div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mx-12">
      I have trouble with <span class="decoration-dotted">getting to sleep within 20 minutes</span> and <span class="decoration-dotted">because I snore</span>.
    </div>
    <button>Submit</button>
  </div>
</template>

<script>
export default {
  name: 'ProblemSelection',
  data() {
    return {
      sleepProblems: {
        beforeSleep: [
          'Can\'t fall asleep quickly',
          'Have difficulty breathing',
          'Other...',
        ],
        duringSleep: [
          'Snore',
          'Wake up a lot',
          'Gasp for air',
          'Stop breathing',
          'Other...',
        ],
        afterSleep: [
          'Don\'t feel rested',
          'Wake up late',
          'Sleep through my alarms',
          'Get a headache',
          'Have a dry mouth',
          'Wake too early and can\'t sleep again',
          'Find it hard to get out of bed',
          'Other...',
        ],
        duringDay: [
          'Feel tired',
          'Experience microsleeps',
          'Find it hard to focus',
          'Causing accidents',
          'Have sleep anxiety',
          'Am stressed',
          'Other...',
        ],
      }
    }
  },
  methods: {},
}
</script>