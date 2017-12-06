let model = {
  save: function (name, value) {
    if (window.localStorage) {
      window.localStorage.setItem(name, value)
    }
  },
  read: function (name) {
    if (window.localStorage) {
      return window.localStorage.getItem(name)
    }
  }
}

export default model
