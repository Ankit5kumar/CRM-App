const {User} = require('../Model/user.js')
const {ticket} = require('../Model/ticket.model')
const constants = require('../Utils/constants')
const objectConverter = require('../Utils/objectConverter')

const createTicket = async (req, res) => {
    const ticketObject = {
        title:req.body.title,
        ticketPriority:req.body.ticketPriority,
        description:req.body.description,
        status:req.body.status,
        
        reporter:req.body.userId,
    }

    const engineer = await User.findOne({
        userType:constants.userType.engineer,
        userStatus:constants.userStatus.approved
    })
    
     ticketObject.assignee = engineer.userId;

    try {
        const Ticket = await ticket.create(ticketObject)
        if(Ticket){
            const user = await User.findOne({userId:req.body.userId})

            user.ticketsCreated.push(ticket._id)
            await user.save()

            engineer.ticketsAssigned.push(ticket._id)
            await engineer.save()

            res.status(201).send(objectConverter.ticketresponse(Ticket))
        }
    } catch (error) {
        console.log("some error happened while created", error)
        res.status(500).send({msg:"some internal error"})
    }
}

const canUpdate = (user,Ticket)=>{
return user.userId == ticket.reporter || 
user.userId == ticket.assignee || 
user.userType == constants.userType.admin
}

const updateTicket = async (req, res) =>{
    const Ticket = await ticket.findOne({_id: req.params.id})

    const savedUser = await User.findOne({userId: req.body.userId})

    if(canUpdate(savedUser,Ticket)){
        Ticket.title = req.body.title!=undefined 
        ? req.body.title
        : Ticket.title

        Ticket.description = req.body.description!=undefined 
        ? req.body.description
        :Ticket.description

        Ticket.ticketPriority = req.body.ticketPriority!=undefined
        ? req.body.ticketPriority
        : Ticket.ticketPriority

        Ticket.status = req.body.status!=undefined
        ? req.body.status
        : Ticket.status

        Ticket.assignee = req.body.assignee!=undefined
        ? req.body.assignee
        : Ticket.assignee

        await Ticket.save()

        res.status(200).send(objectConverter.ticketresponse(Ticket))
    }else{
        console.log("Ticket update was attempted by someone without access to the ticket")
        res.status(401).send({msg:"Ticket can be updated only by the customer who created it"})
    }
}

const getAllTicket = async (req, res) => {
     /**
     * Use cases:
     *  - ADMIN : should get the list of all the tickets
     *  - CUSTOMER : should get all the tickets created by him/her
     *  - ENGINEER : should get all the tickets assigned to him/her
     */
     const queryObj = {}
     if(req.query.status!=undefined){
        queryObj.status = req.query.status
     }  
     const savedUser = await User.findOne({userId:req.body.userId})
     if(savedUser.userType == constants.userType.admin){
          
     }else if(savedUser.userType == constants.userType.customer){
        queryObj.assignee = savedUser.userId
        console.log("queryObj from assignee",queryObj)
     }else{
        queryObj.reporter = savedUser.userId
        console.log("queryObj from reporter",queryObj)
     }
     const Ticket = await ticket.find(queryObj)
    console.log("Ticket",Ticket)
    res.status(200).send(objectConverter.ticketListResponse(Ticket))
     
}
// const getAllTicket = async (req, res) =>{
//     const queryObj = {
//         reporter:req.userId
//     }

//     if(req.query.status!=undefined){
//         queryObj.status = req.query.status;
//     }
//     const tickets = await ticket.find(queryObj);
//     console.log(tickets)
//     res.status(200).send(ObjectConverter.ticketListResponse(tickets))
// }

const getOneTicket = async (req, res) =>{
    const Ticket = await ticket.find({_id:req.params.id})
    console.log("Ticket",Ticket)
    res.status(200).send(Ticket)
    // res.status(200).send(ObjectConverter.ticketresponse(Ticket)
}


module.exports = {
    createTicket,
    updateTicket,
    getAllTicket,
    getOneTicket
}
        
        

