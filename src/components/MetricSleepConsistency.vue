<template>
  <div>
    <div>ICON</div>
    <div>{{ formatScore(score) }}</div>
    <div>CONSISTENCY</div>
  </div>
</template>

<script>
import User from '@/models/user'

export default {
  name: 'MetricSleepConsistency',
  props: {
    initialDateFrom: String,
    initialDateTo: String,
  },
  data() {
    return {
      score: undefined,
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
          // Query their consistency score for the past 7 days.
          return user.getMetricSleepConsistency(this.dateFrom, this.dateTo)
        }).then(consistency => {
          console.log('consistency:', consistency)
          this.score = consistency.score
        })

    } catch(e) {
      console.log(e)
    }
  },
  methods: {
    formatScore(s) {
      if (!s) {
        return 'Loading...'
      } else {
        return s * 100 + '%'
      }
    },
  },
}
</script>