const express = require('express');
const app = express();
 require("./config/db.config")
const SignAndSignUproutes = require('./Routes/Route');
const userRoute = require('./Routes/user.route');
const TicketRouter = require('./Routes/ticket.Route')



app.get('/',(req,res)=>{
    res.send("hello,welcome to CRM app")
})


app.use(express.json());
// console.log(route)
app.use(SignAndSignUproutes)
app.use(userRoute)
app.use(TicketRouter)
app.listen(3000,() => {
    console.log("listening on http://localhost:3000")
})