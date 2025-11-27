const mongoose = require('mongoose');

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
},{ timestamps:true}
);

// //Middleware to hash the password before saving it.
// userSchema.pre('save',async function(next){
//     try{
//         if(!this.isModified('password')){
//              next();
//         }

//         const salt=await bcrypt.genSalt(10);
//         this.password=await bcrypt.hash(this.password,salt);

//         next();
//     }catch(err){
//         return next(err);
//     }
// });

// userSchema.methods.matchPassword=async function(enteredPassword){
//     return await bcrypt.compare(enteredPassword,thispassword);
// }

const User=mongoose.model('User',userSchema);

module.exports=User;