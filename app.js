const PUBLIC_KEY = 'BCDMOxYAhVUZY1cXwkXsKuKztlqfOXjowcriucykb5qBmFq-8lVMVx3bJbFOmLSci1Jq_SPqBdFeWGi0jcHJfXM'
const NOTIFICATION_USABILITY = 'serviceWorker' in navigator && 'PushManager' in window
const HAS_FINGERPRINT = !(localStorage.getItem('fingerprint') == null && localStorage.getItem('fingerprint') === '')
const API_HOST = ''

/**
 * initialization function
 */
const init = () => {
  const subscribeButton = document.querySelector('.user-profile__subscribe-button')

  if (HAS_FINGERPRINT) {
    generateFingerprint()
      .then(fingerprint => {
        localStorage.setItem('fingerprint', fingerprint)
      })
  }

  if (!NOTIFICATION_USABILITY) {
    console.log('Service Worker and Push is supported')

    // Disable subscribe button when user device is not support
    subscribeButton.innerHTML = '未支援訂閱'
    subscribeButton.disabled = true
  } else {
    navigator
      .serviceWorker
      .register('sw.js')
      .then((registration) => {
        console.log('Service Worker is registered')

        return getSubscription(registration)
      })
      .then(subscription => {
        const isSubscribed = subscription !== null

        if (isSubscribed) {
          saveSubscription(subscription)

          subscribeButton.innerHTML = '已訂閱'
          subscribeButton.disabled = true
        }
      })
      .catch(error => {
        console.error('Service Worker Error', error)
      })
  }
}
const getSubscription = (registration) => {
  return registration
    .pushManager
    .getSubscription()
}
const saveSubscription = (subscription) => {
  const options = {
    method: 'PUT',
    body: JSON.stringify({
      fingerprint: localStorage.getItem('fingerprint'),
      subscription
    }),
    headers: new Headers({
      'Content-Type': 'Application/json'
    })
  }

  return fetch(`${API_HOST}/subscriptions`, options)
    .then(response => response.json())
}
const requestSubscription = (registration) => {
  const result = confirm('是否要訂閱 Jacky ？')

  if (result) {
    return registration
      .pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(PUBLIC_KEY)
      })
  }

  return Promise.reject(new Error('Failed to request push notification permission'))
}
const subscribe = () => {
  let swRegistration

  const subscribeButton = document.querySelector('.user-profile__subscribe-button')

  navigator
    .serviceWorker
    .ready
    .then(registration => {
      swRegistration = registration

      return getSubscription(registration)
    })
    .then(subscription => {
      const isSubscribed = subscription !== null

      if (isSubscribed) {
        return subscription
      }

      return requestSubscription(swRegistration)
    })
    .then(subscription => saveSubscription(subscription))
    .then(response => {
      if (response.ok) {
        alert('已訂閱')

        subscribeButton.innerHTML = '已訂閱'
        subscribeButton.disabled = true
      } else {
        alert(response.message)
      }
    })
    .catch(error => {
      subscribeButton.disabled = false

      console.error('Failed to subscribe user ', error)
    })
}

init()