const {User} = require('../Model/user')
const {userType} = require("../Utils/constants")
const constants = require("../Utils/constants")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("../config/auth.config")




async function signup(req, res){
    
    let userStatus 
    if(req.userType == userType.engineer || req.userType == userType.admin) {
     userStatus = constants.userStatus.pending;
    }else{
        userStatus = constants.userStatus.approved;
    }
    // console.log(req)
    
    const userObj = {
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        userType:req.body.userType,
        password: bcrypt.hashSync(req.body.password,8),
        userStatus:userStatus
    }

    try {
        const userCreated = await User.create(userObj)
        const postReponse = {
            name: userCreated.name,
            userId: userCreated.userId,
            email: userCreated.email,
            userType: userCreated.userType,
            userStatus: userCreated.userStatus,
            createdAt: userCreated.createdAt,
            updatedAt: userCreated.updatedAt
        }
        res.status(201).send({msg:"user created successfully",postReponse})
        console.log(postReponse)
      
    } catch (err) {
        console.log("Something went wrong while saving to DB", err.message)
        res.status(500).send({
            message: "Some internal error while inserting the element"
        })
    }
    
}

// signIn
async function signin(req, res){
   const user = await User.findOne({userId: req.body.userId})
   console.log("Signin req for",user)
   
   if (!user){
    res.status(400).send({msg:"userid does not exist"})
    return 
   }
   
   if(user.userStatus != constants.userStatus.approved){
    res.status(403).send({
        message: `Can't allow login as user is in status : [${user.userStatus}]`
    })
    return;
   }

   let passwordIValid = bcrypt.compareSync(
    req.body.password,
    user.password
   )

   if(!passwordIValid){
    res.status(401).send({msg:"Invalid password"})
    return
   }

   let token = jwt.sign({userId:user.userId},config.secret,{expiresIn:86400})

   res.status(200).send({
    name:user.name,
    userId:user.userId,
    email:user.email,
    userType:user.userType,
    userStatus:user.userStatus,
    accessToken:token
   })
   
    
}



module.exports =  {signup,signin}
   

          

        

 
