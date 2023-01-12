const express = require('express')
const Route = express.Router()
const ticketController = require('../Controller/ticket.controller')
const AuthJwt = require('../Middlewares/auth')

Route.post("/crm/api/tickets/",[AuthJwt.verifyToken],ticketController.createTicket)
Route.put("/crm/api/tickets/:id", ticketController.updateTicket)
Route.get("/crm/api/tickets",[AuthJwt.verifyToken],ticketController.getAllTicket)
Route.get("/crm/api/tickets/:id",[AuthJwt.verifyToken],ticketController.getOneTicket)


module.exports = Route
