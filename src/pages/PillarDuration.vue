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
// TODO: Pull out bar chart into weekly graph that accepts datasets.
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
)
ChartJS.defaults.color = '#000';

export default {
  name: 'PillarDuration',
  components: {
    Bar
  },
  data() {
    return {
      data: this.updateData(),
      options: {
        responsive: true,
        maintainAspectRatio: true,
        // rotation: -(300/2),
        // circumference: 300,
        // cutout: '85%',
        borderRadius: 10,
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
            labels: {
              font: {
                family: 'Lexend',
                size: 14,
              }
            }
          },
          datalabels: {
            formatter: function(value, context) {
              console.log(context)
              const hours = Math.floor(value) ? Math.floor(value) + 'h ' : ''
              return hours + Math.round((value % 1) * 60) + 'm'
            }
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
            backgroundColor: 'rgb(235, 162, 54)',
            borderColor: 'rgb(235, 162, 54)',
            type: 'line',
            yAxisID: 'y1',
            datalabels: {
              formatter: function(value) {
                return Math.round(value * 100) + '%'
              }
            },
          },
          {
            label: 'Duration',
            data: [7.5, 7, 7.24, 6.01, 6.78, 7.1, 8.5],
            backgroundColor: 'rgb(54, 162, 235)',
          },
          {
            label: 'Opportunity',
            data: [0.4, 0.7, 1.1, 0.6, 0.5, 0.9, 0.8],
            backgroundColor: 'rgb(162, 54, 235)',
          },
        ]
      }
      return this.data
    }
  },
}
</script>