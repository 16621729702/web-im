import ajax from 'module_path/ajax'

function receipt (f, t) {
  ajax({
    url: 'https://www.ziyadiaoyu.com/biz_im_message?from=' + f + '&to=' + t + '&random=' + new Date().getTime(),
    type: 'get'
  })
}

export default receipt
