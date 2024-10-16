<template>
  <MetricCircle
    :value='score'
    :icon='icon'
    :label='label'
  />
</template>

<script>
import User from '@/models/user'
import MetricCircle from '@/components/MetricCircle'

export default {
  name: 'MetricSleepConsistency',
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
      icon: '💤',
      label: 'Consistency',
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
          return user.getSleepConsistencyScore(this.dateFrom, this.dateTo)
        }).then(consistency => {
          console.log('consistency:', consistency)
          this.score = consistency.score * 100
          console.log('this.score', this.score)
        })

    } catch(e) {
      console.log(e)
    }
  },
  methods: {
    // TODO: Probably remove this and do formatting in MetricCircle.
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