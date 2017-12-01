if (window.Notification) {
  Notification.requestPermission()
}

function notifacation (c) {
  if (window.Notification && Notification.permission === 'granted') {
    new Notification(c.title, {
      dir: 'auto',
      lang: 'zh-CN',
      tag: 'testNotice',
      icon: c.icon,
      body: c.body,
      renotify: false
    })
  }
}

export default notifacation
