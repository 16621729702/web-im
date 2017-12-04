import typeDetection from 'module_path/typeDetection'
import ajax from 'module_path/ajax'

const baseUrl = 'https://s.ziyadiaoyu.com/'
const exp = /data:image\/[a-z]+;base64,/

function upload (file, resolve, reject) {
  if (file) {
    file = file.replace(exp, '')
    ajax({
      url: 'http://upload.qiniu.com/putb64/-1',
      type: 'post',
      headers: {
        'Content-Type': 'application/octet-stream',
        Authorization: 'UpToken j5j3fml1xwWY4ebo6z9S1EBYat3v5qBmMHHXZU6P:39RiV6I4HhdQPBi7Lq0a0p1DRPE=:eyJzY29wZSI6ImNvbW1vbnMiLCJkZWFkbGluZSI6NTExMTU5NjY3OX0='
      },
      data: file,
      success: function (data) {
        var d = JSON.parse(data).key
        if (d && typeDetection(resolve) === 'function') {
          resolve(baseUrl + d)
        }
      },
      error: function () {
        typeDetection(reject) === 'function' && reject()
      }
    })
  }
}

export default upload
