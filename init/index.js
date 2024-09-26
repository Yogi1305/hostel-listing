const mongoose=require('mongoose');
const initdata=require("../init/data.js");
const Listing =require("../models/listing.js");

main().then(()=>{
    console.log("donot worry no error is there");
}).catch(err=>{
    console.log("hi err");
});
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb")
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data is init");
}
initDB();