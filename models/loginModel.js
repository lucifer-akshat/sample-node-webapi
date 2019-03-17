var mongoose = require('mongoose');

var LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
        trim:true
    },
    username: {
        type: String,
        required:true,
        trim:true
    },
    id: {
        type: String,
        required:true,
        unique:true
    },
    token: {
        type: String,
        required:true,
        unique:true
    }

});

var LoginModel = mongoose.model('LoginModel', LoginSchema);
module.exports = LoginModel;