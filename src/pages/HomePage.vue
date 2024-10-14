<template>
  <div class="relative mt-20 mb-20 max-w-screen-sm left-1/2 -translate-x-1/2">
    <div class="px-12">
      <h2><span class="font-bold">{{ name }}</span>, X</h2>
      <p>Lorum ipsum.</p>
    </div>
    <div class="flex flex-row gap-4 items-center m-4 p-4 rounded-lg bg-gray-100 text-left">
      <div>💡</div>
      <div>{{ sleepProfileProblems }}</div>
    </div>
    <div class="flex flex-row gap-4 items-center m-4 p-4 rounded-lg bg-gray-100 text-left">
      <div>🎯</div>
      <div class="flex flex-col grow">
        <h3 class="text-center">Your personalised recommendations</h3>
        <ol class="list-decimal pl-4">
          <li>hello</li>
          <li>hello</li>
          <li>hello</li>
        </ol>
      </div>
    </div>
  </div>
  <div class="fixed inset-x-0 bottom-0 w-full max-w-screen-sm left-1/2 -translate-x-1/2 px-4">
    <div class="flex flex-row justify-between px-8 pt-4 pb-8 rounded-t-3xl bg-gray-100 cursor-pointer">
      <input type="text" name="chat" placeholder="Chat with coach" class="grow placeholder:text-slate-500 bg-transparent active:none focus:outline-none focus:border-none">
      <div class="text-xl text-slate-500 cursor-pointer">&#8963;</div>
    </div>
  </div>
</template>

<script>
import { getCurrentUser } from 'vuefire'

export default {
  name: 'ProblemSelection',
  data() {
    return {
      sleepProfileProblems: "",
      name: undefined,
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