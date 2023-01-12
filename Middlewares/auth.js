const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.config')
const constants = require('../Utils/constants')
const {User} = require('../Model/user')

const verifyToken = (req,res,next) => {
    let token = req.headers['x-access-token']
    if(!token){
        return res.status(403).send({
            msg:"no token provided"
        })
    }
    jwt.verify(token,authConfig.secret,(err,decoded) => {
        if(err){
            return res.status(401).send({
                msg:"unauthorized",
            })
        }
        req.body.userId = decoded.userId
        next()
    })
}

const isAdmin = async (req, res, next) => {
    const user = await User.findOne({userId: req.body.userId})
    if(user && user.userType==constants.userType.admin){
        next();
    }else{
        res.status(403).send({
            msg:"Require admin Role"
        })
        return;
    }
}
module.exports = {
    verifyToken,
    isAdmin
}