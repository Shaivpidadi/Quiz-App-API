const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required : true
    },
    password: {
        type : String,
        min: 6,
        max : 15,
        required : true
    },
    role:{
        type: String
    }
});

module.exports = mongoose.model('Users', userSchema);