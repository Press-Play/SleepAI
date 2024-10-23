<template>
  <div class="relative mt-20 mb-20 max-w-screen-sm left-1/2 -translate-x-1/2">
    <div class="px-12">
      <h2>Sleep duration</h2>
      <p>Sleep duration</p>
      <h3>Past 7 days</h3>
    </div>
    <div class="flex flex-row place-content-around justify-center">
      <MetricSleepDuration
        :initialDateFrom='dateFrom'
        :initialDateTo='dateTo'
      />
      <div class="flex flex-col place-content-around">
        Hello this is some text about duration.
      </div>
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
// TODO: Pull out bar chart into weekly graph that accepts datasets.
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import MetricSleepDuration from '@/components/MetricSleepDuration'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Legend
)
ChartJS.defaults.color = '#000'
// ChartJS.defaults.font.family = 'Lexend'

export default {
  name: 'PillarDuration',
  components: {
    MetricSleepDuration,
    Bar,
  },
  data() {
    return {
      dateFrom: '2024-10-06',
      dateTo: '2024-10-12',
      data: this.updateData(),
      options: {
        responsive: true,
        maintainAspectRatio: true,
        // rotation: -(300/2),
        // circumference: 300,
        // cutout: '85%',
        borderRadius: 5,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Hours',
            },
            stacked: true,
            ticks: {
              stepSize: 4
            },
          },
          y1: {
            display: false,
            title: {
              display: false,
            },
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            // suggestedMin: 0,
            // suggestedMax: 1,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          datalabels: {
            formatter: function(value) {
              const hours = Math.floor(value) ? Math.floor(value) + 'h ' : ''
              return hours + Math.round((value % 1) * 60) + 'm'
            },
          }
        }
      },
      plugins: [
        ChartDataLabels
      ],
    }
  },
  methods: {
    updateData() {
      this.data = {
        labels: [
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
          'Sun',
        ],
        datasets: [
          {
            label: 'Efficiency',
            data: [0.8, 0.81, 0.82, 0.76, 0.8, 0.85, 0.79],
            backgroundColor: 'rgba(235, 162, 54, 0.5)',
            borderColor: 'rgb(235, 162, 54)',
            borderWidth: 2,
            type: 'line',
            yAxisID: 'y1',
            datalabels: {
              formatter: function(value) {
                return Math.round(value * 100) + '%'
              },
              align: 'top',
            },
          },
          {
            label: 'Duration',
            data: [7.5, 7, 7.24, 6.01, 6.78, 7.1, 8.5],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 2,
            borderSkipped: 'top',
            borderRadius: {bottomLeft: 5, bottomRight: 5},
          },
          {
            label: 'Opportunity',
            data: [0.4, 0.7, 1.1, 0.6, 0.5, 0.9, 0.8],
            backgroundColor: 'rgba(162, 54, 235, 0.5)',
            borderColor: 'rgb(162, 54, 235)',
            borderWidth: 2,
            borderSkipped: 'bottom',
          },
        ]
      }
      return this.data
    }
  },
}
</script>