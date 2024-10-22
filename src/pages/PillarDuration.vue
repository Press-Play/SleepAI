<template>
  <div class="relative mt-20 mb-20 max-w-screen-sm left-1/2 -translate-x-1/2">
    <div class="px-12">
      <h2>Sleep duration</h2>
      <p>Sleep duration</p>
    </div>
    <div>
      <Bar
        :data="data"
        :options="options"
        :plugins="plugins"
      />
    </div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement)

export default {
  name: 'PillarDuration',
  components: {
    Bar
  },
  data() {
    return {
      data: this.updateData(),
      options: {
        // responsive: true,
        // maintainAspectRatio: true,
        // rotation: -(300/2),
        // circumference: 300,
        // cutout: '85%',
        // borderRadius: 100,
      },
      plugins: [{
      }],
    }
  },
  methods: {
    updateData() {
      this.data = {
        labels: [
          'M',
          'T',
          'W',
          'T',
          'F',
          'S',
          'S',
        ],
        datasets: [{
          label: 'Data One',
          data: [100, 200, 300, 50, 50, 100, 200],
          backgroundColor: 'rgb(54, 162, 235)',
        }]
      }
      return this.data
    }
  },
}
</script>