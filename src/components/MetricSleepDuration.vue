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
import moment from 'moment'

export default {
  name: 'MetricSleepDuration',
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
      icon: '💧',
      name: 'Duration',
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
          return user.getSleepDuration(this.dateFrom, this.dateTo)
        }).then(duration => {
          this.score = parseInt((duration.score * 100).toFixed(2))
          // this.label = (duration.minutes / 60).toFixed(2) + 'hrs'
          this.label = moment.duration(duration.minutes, 'minutes').hours() + 'h '
            + moment.duration(duration.minutes, 'minutes').minutes() + 'm'
        })

    } catch(e) {
      console.log(e)
    }
  },
  methods: {
  },
}
</script>