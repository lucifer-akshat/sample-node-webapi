var User = require('../models/user');

function verifyEmailUniqueness(user) {
    return new Promise(function (resolve, reject) {
        User.find({
            $or: [{username: user.username}, {email: user.email}]
        }).then(function (users) {
            if(users.length) {
                return reject({
                    code:400,
                    message: "Email or name already exist"
                })
            } else {
                return resolve(user);
            }
        })
            .catch(function (error) {
              return reject(error);
            })
    })
}


function registerUser(user) {
    console.log('coming in controller');
    return new Promise(function (resolve, reject) {
        verifyEmailUniqueness(user)
            .then(function (user) {
                var userData = new User(user);
                userData
                    .save()
                    .then(function (data) {
                        console.log(data);
                        return resolve({
                            message:"Registration successful",
                            data:data,
                            code:200

                        })
                    })
                    .catch(function (err) {
                        return reject({
                            message: "Unable to save to database"
                        })
                    })
            })
    })
}

function fetchRecords() {
    return new Promise(function (resolve, reject) {
        User.find()
            .then(function (data) {
                return resolve({
                    message:"Fetched All Records",
                    data:data,
                    code:200
                })
            })
            .catch(function (err) {
                return reject({
                    message:"Unable to fetch records"
                })
            })
    })
}

module.exports = {
    registerUser,
    verifyEmailUniqueness,
    fetchRecords
};