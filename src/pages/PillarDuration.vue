<template>
  <div class="relative mt-20 mb-20 max-w-screen-sm left-1/2 -translate-x-1/2">
    <div class="px-12">
      <h2>Sleep duration</h2>
      <p>Sleep duration</p>
      <h3>Past 7 days</h3>
    </div>
    <div class="flex flex-row place-content-around justify-center gap-12 m-4">
      <MetricSleepDuration
        :initialDateFrom='dateFrom'
        :initialDateTo='dateTo'
      />
      <div class="flex flex-col place-content-around">
        Hello this is some text about duration.
      </div>
    </div>
    <div class="relative w-full h-96 border p-4">
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
  Title,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import MetricSleepDuration from '@/components/MetricSleepDuration'
import { getWeek } from '@/helpers/time'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Title,
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
      dateFrom: getWeek().start,
      dateTo: getWeek().end,
      data: this.updateData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        borderRadius: 50,
        datasets: {
          bar: {
            barThickness: 20,
            categoryPercentage: 1.0,
            // barPercentage: 0.5,
          }
        },
        // layout: {
        //     padding: 20
        // },
        scales: {
          x: {
            display: true,
            stacked: true,
            grid: {
              drawOnChartArea: false,
              offset: false,
            },
            border: {
              display: false,
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Hours',
            },
            // stacked: true,
            ticks: {
              stepSize: 4,
            },
            grid: {
              drawOnChartArea: false,
            },
            border: {
              display: false,
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
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'This week', //'13 – 19 Oct',
          },
          legend: {
            display: true,
            position: 'bottom',
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
            backgroundColor: 'rgba(235, 162, 54)',
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
            backgroundColor: 'rgba(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 2,
            // borderSkipped: 'top',
            // borderRadius: {bottomLeft: 50, bottomRight: 50},
            borderSkipped: false,
          },
          {
            label: 'Opportunity',
            // data: [0.4, 0.7, 1.1, 0.6, 0.5, 0.9, 0.8],
            data: [7.5+1, 7+1, 7.24+1, 6.01+1, 6.78+1, 7.1+1, 8.5+1],
            backgroundColor: 'rgba(162, 54, 235)',
            borderColor: 'rgb(162, 54, 235)',
            borderWidth: 2,
            // borderSkipped: 'bottom',
            borderSkipped: false,
          },
        ]
      }
      return this.data
    }
  },
}
</script>