const express = require('express'); 
const routes = express.Router();
const auth = require('../Middlewares/auth');
const userController = require('../Controller/operation');

routes.get('/crm/api/users/',[auth.verifyToken,auth.isAdmin],userController.findAll)
routes.get('/crm/api/users/:userId',[auth.verifyToken,auth.isAdmin],userController.findById)
routes.put('/crm/api/users/:userId',[auth.verifyToken,auth.isAdmin],userController.update)

module.exports = routes;