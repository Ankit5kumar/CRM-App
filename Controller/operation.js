// only the user type admin should be able to accesss the operation

const {User} = require('../Model/user')
const ObjectConverter = require("../Utils/objectConverter")


const fetchAll = async (res) =>{
    let users
    try {
        users = await User.find()
        // res.status(200).send(users)
    } catch (error) {
        console.log('error while fetching users',error)
    res.status(404).send({msg:"some internal error"})
    }
    return users;
}

const fetchByName = async (userNameReq,res) =>{
    let users
    try {
        users = await User.find({
            name: userNameReq
        });
    } catch (error) {
        res.status(404).send({msg:"some internal error"})
    }
    return users;
}

const fetchByTypeandStatus = async (userTypeReq,userStatusReq,res) =>{
    let users
    try {
        users = await User.find({
            userType: userTypeReq,
            userStatus: userStatusReq
        })
    } catch (error) {
        console.log(error)
        res.status(404).send({msg:"some internal error from  fetchByTypeandStatus"})
    }
    return users;
}

const fetchByType = async (userTypeReq,res)=>{
    let users;
    try {
        users = await User.find({userType: userTypeReq})
    } catch (error) {
        console.log(error)
        res.status(404).send({msg:`some internal error ${error.message} from fetchBytype`})
    }
    return users;
}

const fetchByStatus = async (userStatusReq,res)=>{
    let users;
    try {
        users = await User.find({userStatus: userStatusReq})
    } catch (error) {
        console.log(error)
        res.status(404).send({msg:`some internal error from fetchByStatus`})
    }
    return users;
}

const findAll = async (req,res)=>{
    let users
    let userTypeReq = req.query.userType
    let userStatusReq = req.query.userStatus
    let userNameReq = req.query.userName
    if(userNameReq){
       users = await fetchByName(userNameReq,res)
    }else if(userTypeReq && userStatusReq){
        users = await fetchByTypeandStatus(userTypeReq,userStatusReq,res)
    }else if(userTypeReq){
        users = await fetchByType(userTypeReq,res)
    }else if(userStatusReq){
        users = await fetchByStatus(userStatusReq,res)
    }else{
        users = await fetchAll(res)
    }
    res.status(200).send(ObjectConverter.userResponse(users))
}

const findById = async (req,res) => {
    const userIdReq = req.params.userId
    let user
    try {
        
        user = await User.find({userId:userIdReq})
    } catch (error) {
        res.status(500).send({msg:"internal server error"})
    }
    if(user.length > 0){
        res.status(200).send(ObjectConverter.userResponse(user))
    }else{
        res.status(200).send({msg:`user with this id [${userIdReq}] is not present`})
    }
}

const update = async (req,res) => {
    const userIdReq = req.params.userId
    try {
        const user = await User.findOneAndUpdate({
            userId:userIdReq
        },{
            userStatus:req.body.userStatus
        }).exec()
        res.status(200).send({
            msg:'User record has been updated'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({msg:'some internal error occured'})
    }
}

module.exports = {
    fetchAll,
    fetchByName,
    fetchByTypeandStatus,
    fetchByType,
    fetchByStatus,
    findAll,
    findById,
    update
}
