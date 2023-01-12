const express = require('express');
const route = express.Router();
const {signup,signin} = require('../Controller/Auth')


route.post("/api/register",signup)
route.post("/api/signin",signin)

// Users routes







module.exports = route
    

