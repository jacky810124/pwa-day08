const PUBLIC_KEY = 'BCDMOxYAhVUZY1cXwkXsKuKztlqfOXjowcriucykb5qBmFq-8lVMVx3bJbFOmLSci1Jq_SPqBdFeWGi0jcHJfXM'
const NOTIFICATION_USABILITY = 'serviceWorker' in navigator && 'PushManager' in window

/**
 * initialization function
 */
const init = () => {
  const subscribeButton = document.querySelector('.user-profile__subscribe-button')

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
  // TODO: upload subscription data to server side
}
const subscribe = () => {
  // TODO: click event handler
}

init()