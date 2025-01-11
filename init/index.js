const mongoose=require('mongoose');
const initData=require('./data.js');
const Listing=require('../models/listing.js');

// connecting to database-------------------------------------
main().then((res)=>{
    console.log("Connect to Mongo DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB = async ()=>{
    await Listing.deleteMany({});
    // we adding owner in our data using map Function
    initData.data=initData.data.map((obj)=>({...obj,owner:'6772efa1787ff692c895fa70'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
initDB();