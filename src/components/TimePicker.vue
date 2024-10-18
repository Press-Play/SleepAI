<template>
  <div v-if="small" class="flex flex-row justify-center items-center my-2 font-normal">
    <select name="time-hour" v-model="timeHour" class="w-8 h-10 mt-0 p-0 text-xl bg-gray-100 rounded-lg text-center">
      <option v-for="n in 12" :key="n" :value="formatTime(n)">{{ formatTime(n) }}</option>
    </select>
    <div class="w-2 h-full text-xl text-center">:</div>
    <select name="time-minutes" v-model="timeMinute" class="w-8 h-10 mt-0 p-0 text-xl bg-gray-100 rounded-lg text-center">
      <option v-for="n in 4" :key="n" :value="formatTime((n-1)*15)">{{ formatTime((n-1)*15) }}</option>
    </select>
    <select name="time-meridiem" v-model="timeMeridiem" class="w-10 h-10 ml-2 mt-0 p-0 text-xl bg-gray-100 rounded-lg text-center">
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
  </div>
  <div v-else class="flex flex-row justify-center items-center my-4 font-medium">
    <select name="time-hour" v-model="timeHour" class="w-24 h-20 mt-0 p-0 text-6xl bg-gray-100 rounded-lg text-center">
      <option v-for="n in 12" :key="n" :value="formatTime(n)">{{ formatTime(n) }}</option>
    </select>
    <span class="w-6 h-full text-6xl text-center">:</span>
    <select name="time-minutes" v-model="timeMinute" class="w-24 h-20 mt-0 p-0 text-6xl bg-gray-100 rounded-lg text-center">
      <option v-for="n in 4" :key="n" :value="formatTime((n-1)*15)">{{ formatTime((n-1)*15) }}</option>
    </select>
    <select name="time-meridiem" v-model="timeMeridiem" class="w-36 h-20 ml-4 mt-0 p-0 text-6xl bg-gray-100 rounded-lg text-center">
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'TimePicker',
  props: {
    initialTime: String,
    small: Boolean,
  },
  data() {
    return {
      time: this.initialTime,
      timeHour: undefined,
      timeMinute: undefined,
      timeMeridiem: undefined,
    }
  },
  beforeMount() {
    this.updateTimeComponents()
  },
  watch: {
    timeHour() {
      this.updateTime()
    },
    timeMinute() {
      this.updateTime()
    },
    timeMeridiem() {
      this.updateTime()
    },
    time(newTime) {
      console.log('Emitting time changed event.')
      this.$emit('getTime', newTime)
    },
    initialTime(t) {
      console.log('Time value from parent changed')
      this.time = t 
      this.updateTimeComponents()
    }
  },
  methods: {
    formatTime(i) {
      const s = i.toString()
      return s.length === 1 ? ('0' + s) : s
    },
    updateTime() {
      try {
        if (!this.timeHour || !this.timeMinute || !this.timeMeridiem) {
          return
        }
        this.time = this.timeHour + ':' + this.timeMinute + ' ' + this.timeMeridiem
      } catch (e) {
        console.log(e)
      }
    },
    updateTimeComponents() {
      try {
        if (!this.time) {
          return
        }
        this.timeHour = this.formatTime(this.time.split(':')[0])
        this.timeMinute = this.formatTime(this.time.split(':')[1].split(' ')[0])
        this.timeMeridiem = this.time.split(' ')[1]
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>
