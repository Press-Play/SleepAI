<template>
  <div class="w-36">
    <Doughnut
      :data="data"
      :options="options"
      :plugins="plugins"
    />
    <div v-if="loading">Loading...</div>
    <div v-else class="text-2xl font-medium">{{ data.datasets[0].data[0] }}%</div>
    <div>{{ label }}</div>
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
    value: Number,
    icon: String,
    label: String,
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
      plugins: [{
        beforeDraw: function(chart) {
          const {ctx} = chart
          const width = chart.width
          const height = chart.height
          const fontSize = (height / 80).toFixed(2)
          ctx.restore()
          ctx.font = fontSize + "em Avenir"
          ctx.textBaseline = "middle"

          const icon = chart.data.datasets[0].icon || ''
          const x = Math.round((width - ctx.measureText(icon).width) / 2)
          const y = (height / 2) + 5
          ctx.fillText(icon, x, y);
          ctx.save()
        }
      }],
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
          icon: this.icon,
        }]
      }
      return this.data
    }
  },
}
</script>