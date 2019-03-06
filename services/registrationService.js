var User = require('../models/user');
var bcrypt = require('bcrypt');

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
    return new Promise(function (resolve, reject) {
        verifyEmailUniqueness(user)
            .then(function (user) {
                var userData = new User(user);
                bcrypt.hash(user.password, 10, function (error, hash) {
                    if(error) {
                        return reject({
                            message:"Unable to hash the password"
                        });
                    }
                    userData.password = hash;
                });
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
            .catch(function (err) {
                return resolve({
                    message:"Username or emailId already exist"
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

function encryptPassword(requestPassword) {
    return new Promise(function (resolve, reject) {
        bcrypt.hash(requestPassword, 10, function (error, response) {
            if(error){
                return reject({
                    message:"Unable to encrypt password"
                })
            } else {
                return resolve(response);
            }
        })
    })
}

function login(request) {
    return new Promise(function (resolve, reject) {
        User.findOne({
          email:request.email
        })
            .then(function (users) {
                if(users) {
                    encryptPassword(request.password)
                    .then(function (hashed) {
                        bcrypt.compare(request.password, hashed, function (error, response) {
                            if(error) {
                                return resolve({
                                    message:"Unable to login the user"
                                })
                            } else if(response) {
                                return resolve({
                                    message:"Login Successful",
                                    data:users
                                })
                            } else {
                                return resolve({
                                    message:"Invalid credentials"
                                })
                            }
                        })
                    })
                    .catch(function (error) {
                        return resolve({
                           message:"Unable to login the user",
                           error:error
                        })
                    });
                } else {
                    return resolve({
                        message:"User not found"
                    })
                }
            })
            .catch(function (err) {
               return reject({
                   message:err
               })
            })
    })
}

module.exports = {
    registerUser,
    verifyEmailUniqueness,
    fetchRecords,
    login
};