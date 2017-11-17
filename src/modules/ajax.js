let options = {
  type: 'get',
  url: '',
  cahce: false,
  success: null,
  error: null,
  beforeSend: null,
  timeout: 20000,
  headers: {},
  data: null
}
function ajax (opt = options) {
  opt = Object.assign({}, options, opt)
  if (opt.url) {
    let xhr = new XMLHttpRequest()
    // if (opt.type.toLowerCase() === 'get' && typeof opt.data === 'object') {
    //   let item = null
    //   let parms = ''
    //   for (item in opt.data) {
    //     parms += item + '=' opt.data[item] + '&'
    //   }
    //    opt.url += (opt.url.indexOf('?') > -1 ? '&' : '?') + parms.slice(0, parms.length -1)
    //    opt.data = null
    // } else if (opt.type.toLowerCase() === 'post' && typeof opt.data === 'string') {
    //   let obj = {}
    //   parms.split('&').forEach((item) => { const temp = item.split('='); obj[temp[0]] : obj[temp[0]]})
    //   opt.url += (opt.url.indexOf('?') > -1 ? '&' : '?') + parms.slice(0, parms.length -1)
    //    opt.data = null
    // }
    // if (!opt.cache) {
    //   opt.url += (opt.url.indexOf('?') > -1 ? '&' : '?') + (new Date()).getTime()
    // }
    let timeout
    let prop
    xhr.open(opt.type, opt.url, opt.async !== false)
    for (prop in opt.headers) {
      xhr.setRequestHeader(prop, opt.headers[prop])
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let status = xhr.status
        timeout && clearTimeout(timeout)
        if ((status >= 200 && status < 300) || status === 304) {
          (typeof opt.success === 'function') && opt.success(xhr.responseText)
        } else {
          (typeof opt.error === 'function') && opt.error(xhr)
        }
      }
    }
    if (opt.timeout) {
      timeout = setTimeout(() => {
        xhr.abort()
        typeof opt.error === 'function' && opt.error(xhr)
      }, opt.timeout)
    }
    opt.beforeSend && opt.beforeSend()
    xhr.send(opt.data)
  }
}

export default ajax
