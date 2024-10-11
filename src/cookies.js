export function setCookie(name, value = '', days = 0) {
  let date = new Date()
  date.setDate(date.getDate() + days)
  const expires = days ? date.toUTCString() : ''
  document.cookie = name + '=' + value.toString() + '; expires=' + expires + '; path=/;'
}

export function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name+'='))
    ?.split("=")[1]
}

export function eraseCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}