<template>
  <div class="relative mt-20 mb-20 max-w-screen-sm left-1/2 -translate-x-1/2">
    <div class="px-12">
      <h2><span class="font-bold">Khanh</span>, X</h2>
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
  <div class="fixed flex flex-row justify-between inset-x-0 bottom-0 px-8 py-4 rounded-full bg-gray-100 cursor-pointer">
    <input type="text" name="chat" placeholder="Chat with coach" class="grow placeholder:text-slate-500 bg-transparent active:none focus:outline-none focus:border-none">
    <div class="text-xl text-slate-500 cursor-pointer">&#8963;</div>
  </div>
</template>

<script>
export default {
  name: 'ProblemSelection',
  data() {
    return {
      sleepProfileProblems: "",
    }
  },
  beforeMount() {
    if (localStorage.getItem("sleepProfileProblems") !== null) {
      this.sleepProfileProblems = JSON.parse(localStorage.getItem("sleepProfileProblems"))
    }
  },
  methods: {},
}
</script>