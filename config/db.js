const mongoose = require('mongoose');


async function connectDB() {
  await mongoose.connect('mongodb://127.0.0.1:27017/authuser').then(()=>{
      console.log("connection to db")
  }).catch((err)=>{
      console.log(err)
  })
}
module.exports = connectDB;







