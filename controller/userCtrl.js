
const { generateToken } = require("../config/jwtToken");
const User = require("../models/usermodels"); 
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt=require("jsonwebtoken");
//Create a user
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
//login a user
const loginUserCtrl=asyncHandler(async(req,res)=>{
    const{ email, password} =req.body;
   // check if user exist or not
   const findUser=await User.findOne({email});
   if (findUser && await findUser.isPasswordMatched(password)){
   const refreshToken= await generateRefreshToken(findUser?.id);
   const updateuser=await User.findByIdAndUpdate(findUser.id,{
    refreshToken: refreshToken,
   },
    {new: true}
);
res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    maxAge: 72 * 60 * 60 *1000,
});
    res.json({ 
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname:findUser?.lastname,
        email:findUser?.email,
        mobile:findUser?.mobile,
        token:generateToken(findUser?._id),
    } );
   }
   else{
    throw new Error("Invalid Credentials")
   }
});
//get all user
const getallUser = asyncHandler(async(req,res) => {
    try{
        const getUsers = await User.find();
        res.json(getUsers);
    }catch(error){
        throw new error(error);
    }
   
});
// get a single user
const getaUser = asyncHandler(async(req,res)=>{
    
    const {id}=req.params;
    validateMongoDbId(id);
    try {
        const getaUser=await User.findById(id);
        res.json({
            getaUser,
        });
    } catch (error) {
        throw new Error(error)
    }
});

//handle referesh token
const handleRefreshToken= asyncHandler(async(req,res)=>{
    const cookie= req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh Token in cookies");
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({refreshToken});
    if(!user) throw new Error ("No Referesh token in db on not matched");
    jwt.verify
    (refreshToken, 
    process.env.JWT_SECRET, 
    (err,
    decoded) => {
        if(err || user.id !==decoded.id) {
            throw new Error("there is something wrong with refresh token ");
            }
        const accessToken = generateToken(user?._id)
        res.json({accessToken});
    });
});
//logiout funnctionality
const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) throw new Error("No refresh token in cookies");

    const refreshToken = cookies.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // No Content
    }

    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });

    res.sendStatus(204); // No Content
});

//update a user
const updatedUser= asyncHandler(async(req,res)=>{
console.log();
const{id}=req.params;
validateMongoDbId(_id);
try {
    const updatedUser=await User.findByIdAndUpdate(id,
        {
        firstname:req?.body?.firstname,
        lastname:req?.body?.lastname,
        email:req?.body?.email,
        mobile:req?.body?.mobile,
    },
{
    new: true,
}
);
res.json(updatedUser);
} catch (error) {
    res.status(400).json({ message: error.message });
}
});

// delete a single user
const deleteaUser = asyncHandler(async(req,res)=>{
    console.log(req.params);
    const {id}=req.params;
    
    try {
        const deleteaUser=await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        });
    } catch (error) {
        throw new Error(error)
    }
});
//block a user
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        res.json({ message: "User Blocked" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Unblock a user
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        res.json({ message: "User Unblocked" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
module.exports = { createUser, 
    loginUserCtrl, 
    getallUser,
    getaUser,
    deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
 };
