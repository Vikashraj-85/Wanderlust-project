
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');


const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
});

// given line , will automatically create  username and password with hashing and salting...
userSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model('User',userSchema);