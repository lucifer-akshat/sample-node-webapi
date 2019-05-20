var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
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
    nessage: {
        type: String,
        required:true
    }

});

var MessageSchema = mongoose.model('messageModel', MessageSchema);
module.exports = MessageSchema
;