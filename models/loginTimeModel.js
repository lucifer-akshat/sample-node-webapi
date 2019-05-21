var mongoose = require('mongoose');

var LoginTimeSchema = new mongoose.Schema({
    id: {
        type: String,
        required:true,
    },
    loginTime: {
        type: String,
        required:true
    }

});

var LoginTimeModel = mongoose.model('LoginTimeModel', LoginTimeSchema);
module.exports = LoginTimeModel;