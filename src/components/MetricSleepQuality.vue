<template>
  <MetricCircle
    :value='score'
    :label='label'
    :icon='icon'
    :name='name'
  />
</template>

<script>
import User from '@/models/user'
import MetricCircle from '@/components/MetricCircle'

export default {
  name: 'MetricSleepQuality',
  props: {
    initialDateFrom: String,
    initialDateTo: String,
  },
  components: {
    MetricCircle
  },
  data() {
    return {
      score: undefined,
      label: undefined,
      icon: 'metric_quality.png', //'🌟',
      name: 'Efficiency',
      // TODO: Default to today - 7 days.
      dateFrom: this.initialDateFrom,
      // TODO: Default to today.
      dateTo: this.initialDateTo,
    }
  },
  beforeMount() {
    try {
      // Get current user.
      User.getCurrentUser()
        .then(user => {
          // Query their quality score for the date range.
          return user.getSleepQualityScore(this.dateFrom, this.dateTo)
        }).then(duration => {
          this.score = Math.round(duration.score * 100)
          this.label = Math.round(duration.score * 100) + '%'
        })
    } catch(e) {
      console.log(e)
    }
  },
  methods: {
  },
}
</script>