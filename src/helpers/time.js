// TODO: Import moment.js here and use this helper file for everything date, duration, and time related.
// TODO: Yes, fix the shit out of this.
import moment from 'moment'

Date.prototype.format = function() {
  const m = this.getMonth() + 1
  const d = this.getDate()

  return [
    this.getFullYear(),
    m.toString().padStart(2,'0'),
    d.toString().padStart(2,'0'),
  ].join('-')
}

// Returns date of the Monday and Sunday of:
// () -> the current week
// (date) -> the week that date falls in
export function getWeek(date) {
  const d = (typeof date === 'object') ? date : new Date()
  const startDate = new Date(d)
  startDate.setDate(d.getDate() - d.getDay())
  const endDate = new Date(d)
  endDate.setDate(d.getDate() - d.getDay() + 7)

  return {
    start: startDate.format(),
    end: endDate.format(),
  }
}

// Returns date for 7 days ago.
// () -> from today
// (date) -> from the specified date
export function get7DaysAgo(date) {
  const d = (typeof date === 'object') ? date : new Date()
  const startDate = new Date(d)
  startDate.setDate(d.getDate() - 7)
  return {
    start: startDate.format(),
    end: d.format(),
  }
}

export function time24To12(t) {
  if (!t) {
    return null
  } else {
    return moment(t, 'HH:mm').format('hh:mm A')
  }
}

export function time12To24(t) {
  if (!t) {
    return null
  } else {
    return moment(t, 'hh:mm A').format('HH:mm')
  }
}

export function roundUp15Minutes(t) {
  const start = moment(t, 'hh:mm A');
  const remainder = 15 - (start.minute() % 15);
  const finish = moment(start)
    .add(remainder, 'minutes')
    .format('hh:mm A')
  return finish
}

// Takes a time in the format 'hh:mm A'.
// Takes duration as a number in minutes.
// Returns a time in the format 'hh:mm A'.
export function subtractDurationFromTime(time, duration) {
  return moment(time, 'hh:mm A')
    .subtract(moment.duration(duration, 'minutes'))
    .format('hh:mm A')
}