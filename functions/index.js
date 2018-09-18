const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')

admin.initializeApp({
  databaseURL: 'https://pwa-day08.firebaseio.com/'
})

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

exports['api'] = functions.https.onRequest(app)