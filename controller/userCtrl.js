
const User = require("../models/usermodels"); 
const asyncHandler = require("express-async-handler");
const createUser = asyncHandler (async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email:email}); 
    if (!findUser) {
        // Create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        // User already exists
       throw new Error("User Alredy Exixt");
    }
});
const loginUserCtrl=asyncHandler(async(req,res)=>{
    const{ email, password} =req.body;
   // check if user exist or not
   const findUser=await User.findOne({email});
   if (findUser && await findUser.isPasswordMatched(password)){
    res.json(findUser);
   }
   else{
    throw new Error("Invalid Credentials")
   }

});
module.exports = { createUser, loginUserCtrl };
