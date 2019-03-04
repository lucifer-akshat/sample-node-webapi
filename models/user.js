var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique:true,
        required:true,
        trim:true
    },
    username: {
        type: String,
        unique:true,
        required:true,
        trim:true
    },
    password: {
        type: String,
        required:true
    }
});

// UserSchema.statics.authenticate = function (email, username, callback) {
//     User.findOne({email: email})
//         .exec(function (err,user) {
//             if(err) {
//                 return callback(err)
//             } else if(!user) {
//                 var err = new Error('User not Found');
//                 err.status = 401;
//                 return callback(err);
//             }
//             bcrypt.compare(password, user.password, function (err, result) {
//                 if(result === true) {
//                     return callback(null, user);
//                 } else {
//                     return callback();
//                 }
//             })
//         });
// }

// UserSchema.statics.getAllRecords = function () {
//     User.find()
//         .then(function (res) {
//             return res
//         })
//         .catch(function (err) {
//             console.log(err);
//         })
// }

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if(err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

var User = mongoose.model('User', UserSchema);
module.exports = User;