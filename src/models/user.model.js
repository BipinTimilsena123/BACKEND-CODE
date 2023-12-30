import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
const userSchema=new Schema({
    username:{
        type:string,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true
    }
    ,coverImage:{
        type:String
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"Password Is Required"]
    },
    refreshToken:{
        type:String
    }
},{
    timestamps:true
});
// Logic to encypt the password using third party becrypt middleware and it is a async function,
// here pre is a middleware which is helping to encrypting the password and save is functionality 
//beforewhich we have to perform a particular task:

//How to write custom hooks using mongo:
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    this.password=bcrypt.hash(this.password,10);
    next();
})


//how to write custom methods using mongo:
// to match whether the passsword is correct or not with initial and excrypted password:
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);

}
userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        //1.payload
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName

        },
        //2.access_token_secret:
        process.env.ACCESS_TOKEN_SECRET,
        //3.access_token_expiry comes under object always,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        //1.payload
        {
            _id:this._id
           

        },
        //2.refresh_token_secret:
        process.env.REFRESH_TOKEN_SECRET,
        //3.refresh_token_expiry comes under object always,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }

    )

}

export const User=mongoose.model("User",userSchema);