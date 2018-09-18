self.addEventListener('push', event => {
  const message = JSON.parse(event.data.text())
  const title = message.title
  const options = {
    body: message.content
  }

  event.waitUntil(self.registration.showNotification(title, options))
})