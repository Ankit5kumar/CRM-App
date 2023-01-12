const nodemailer=require('nodemailer')

module.exports = nodemailer.createTransport({
    port:465,
    host:"smtp.gmail.com",
    auth:{
        user:'ak8068716@gmail.com',
        pass:'wfwkjsgfvionqjjb'
    },
    secure:true
})
 