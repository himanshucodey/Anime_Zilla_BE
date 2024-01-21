const mongoose = require('mongoose');

const connectDB = async ()=> {
    try {
       await mongoose.connect("mongodb+srv://Mintu3344:Mintu3344@cluster0.tgx9fmn.mongodb.net/Animezilla");
       console.log("DB connected successfully");
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectDB;