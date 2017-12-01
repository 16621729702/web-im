function detection (obj) {
  return Object.prototype.toString.call(obj).split(/\s+/)[1].toLowerCase().replace(/[^a-z]+/, '')
}
export default detection
