function setCookie (name, value, expires) {
  var d = new Date()
  d.setTime(d.getTime() + (expires * 24 * 60 * 60 * 1000))
  document.cookie = name + '=' + value + '; expires=' + d.toUTCString() + ';domain=' + document.domain + '; path=/'
}
function analysisCookie () {
  let parms = {}
  document.cookie.split(';').forEach((item) => {
    const temp = item.split('=')
    parms[temp[0].trim()] = temp[1].trim()
  })
  return parms
}
export { setCookie, analysisCookie }
