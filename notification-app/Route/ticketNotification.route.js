const express = require('express')
const route = express.Router()
const notificationController = require('../controllers/ticketNotification.controller')

route.post("/notifiServ/api/notifications/",notificationController.acceptNotificationRequest)
route.get("/notifiServ/api/notifications/:id",notificationController.getNotificationStatus)

module.exports = route