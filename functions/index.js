const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
const webpush = require('web-push')

admin.initializeApp({
  databaseURL: 'https://pwa-day08.firebaseio.com/'
})

webpush.setVapidDetails(
  'mailto:kang810124@gmail.com',
  'BCDMOxYAhVUZY1cXwkXsKuKztlqfOXjowcriucykb5qBmFq-8lVMVx3bJbFOmLSci1Jq_SPqBdFeWGi0jcHJfXM',
  '1jwNoayXn3XGHqYPib37COkGXpu91FyFxJMfHGcAzJk'
)

const db = admin.database()
const app = express()

app.use(cors())

app.put('/subscriptions', (req, res) => {
  const ref = db.ref(`/subscriptions/${req.body.fingerprint}`)
  const callback = error => {
    if (error) {
      res.json({
        ok: false,
        message: '更新訂閱資訊失敗'
      })
    } else {
      res.json({
        ok: true
      })
    }
  }

  ref.set({ subscription: req.body.subscription }, callback)
})

app.post('/messages', (req, res) => {
  const ref = db.ref(`/subscriptions`)
  const callback = (snapshot) => {
    const subscriptions = snapshot.val()
    const tasks = Object
      .keys(subscriptions)
      .map(key => {
        const subscription = subscriptions[key].subscription
        return webpush.sendNotification(
          subscription,
          JSON.stringify(req.body)
        )
      })
    Promise
      .all(tasks)
      .then(result => {
        res.json({
          ok: true
        })
      })
      .catch(error => {
        res.json({
          ok: false
        })
      })
  }
  ref.once('value', callback)
})

exports['api'] = functions.https.onRequest(app)