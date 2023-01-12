const dbConfig = require('./configs/db.config')
require('./crons/cron')
const route = require('./Route/ticketNotification.route')
const mongoose = require('mongoose')
const express = require('express')

const app = express()
app.use(express.json())

mongoose.connect(dbConfig.DB_URL,
    () => { console.log("Connected to Mongo DB") },
    err => { console.log("Error: ", err.message) }
)
app.use(route)

app.listen(3030, () => {
    console.log("server is listening on port http//:localhost:3030")
})