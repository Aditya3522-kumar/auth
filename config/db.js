const mongoose = require('mongoose');

//mongodb://127.0.0.1:27017/authuser
async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI).then(()=>{
      console.log("connection to db")
  }).catch((err)=>{
      console.log(err)
  })
}
module.exports = connectDB;







