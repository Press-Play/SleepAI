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
      label: undefined,
      icon: '🐥',
      name: 'Consistency',
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
          this.score = Math.round(consistency.score * 100)
          this.label = Math.round(consistency.score * 100) + '%'
        })

    } catch(e) {
      console.log(e)
    }
  },
  methods: {
  },
}
</script>