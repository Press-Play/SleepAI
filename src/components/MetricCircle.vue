<template>
  <div class="w-36">
    <div class="absolute flex justify-center items-center w-36 h-36">
      <img class="mt-4 w-2/6 h-2/6" :src="require('@/assets/' + icon)">
    </div>
    <Doughnut
      :data="data"
      :options="options"
      :plugins="plugins"
    />
    <div v-if="loading">Loading...</div>
    <div v-else class="text-2xl font-medium">{{ label }}</div>
    <div>{{ name }}</div>
  </div>
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement } from 'chart.js'

ChartJS.register(ArcElement)

export default {
  name: 'MetricCircle',
  components: {
    Doughnut
  },
  props: {
    value: Number, // Value is how full the bar should be from 0..100.
    label: String, // Label is the number to be shown, including units.
    icon: String, // Path of the icon image.
    name: String, // Name is the metric is called.
  },
  data() {
    return {
      loading: true,
      data: this.updateData(),
      options: {
        responsive: true,
        maintainAspectRatio: true,
        rotation: -(300/2),
        circumference: 300,
        cutout: '85%',
        borderRadius: 100,
      },
      plugins: [],
    }
  },
  watch: {
    value() {
      this.updateData()
    },
  },
  methods: {
    updateData() {
      this.loading = !this.value ? true : false
      const display = this.value || 0
      this.data = {
        datasets: [{
          data: [display, 100 - display],
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(225, 225, 225)',
          ],
        }]
      }
      return this.data
    }
  },
}
</script>