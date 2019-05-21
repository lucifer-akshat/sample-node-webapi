var mongoose = require('mongoose');

var SignInSchema = new mongoose.Schema({
    id: {
        type: String,
        required:true,
        unique:true
    },
    token: {
        type: String,
        required:true
    }

});

var SignInModel = mongoose.model('SignInModel', SignInSchema);
module.exports = SignInModel;