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

exports['api'] = functions.https.onRequest(app)