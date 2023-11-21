// we have to use this thing again and again in our code so we make this file in utils 
const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise
        .resolve(requestHandler(req,res,next))
        .catch((error)=>next(error))
    }
}



export {asyncHandler};


// // using try catch syntax same thing
// const asyncHandler=(fn)=>async(req,res,next)=>{
//     try{
//         await fn(req,res,next);

//     }
//     catch(error){
//         res.status((err.code || 500).json({
//            success:false,
//            message:err.message
//         }))

//     }
// }