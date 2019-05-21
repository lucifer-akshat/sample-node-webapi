var User = require('../models/user');
var LoginModel = require('../models/loginModel');
var SignInModel = require('../models/signInModel');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../config/jwtSecret');
var secret = config.secret;
// var http = require('http').Server(app);
// var socket = require('socket.io')(http);

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

function authenticateUser(request) {
    return new Promise(function (resolve, reject) {
        jwt.verify(request.headers.authorization, secret, function (error, decoded) {
            if(error) {
                return reject({
                    message: "Token expired",
                    error:error
                })
            } else {
                return resolve(decoded);
            }
        });
    })
}


function registerUser(request) {
    var user = request.body;
    return new Promise(function (resolve, reject) {
        console.log(user);
        if(!user.username || !user.email || !user.password) {
            return resolve({
                message: "Unproccessible Entity",
                code:400
            })
        }
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

function fetchRecords(request) {
    return new Promise(function (resolve, reject) {
        authenticateUser(request)
            .then(function (result) {
                console.log(result, 'result');
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
            .catch(function (error) {
                return resolve({
                    message: "Not authorized to fetch records."
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
                                //Create JSON Web Token
                                console.log(users, 'user details');
                                return resolve(createAuthenticatedWebToken(users));
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

function createAuthenticatedWebToken(userDetails) {
    return new Promise(function (resolve, reject) {
        var data = {};
        data.id = userDetails._id;
        data.username = userDetails.username;
        data.email = userDetails.email;
        data.token = createJsonWebToken(userDetails);

        //TODO: Add Logic to remove token for
        //TODO: logged-in user in case of login

        var loginDataDetails = {
            id: data.id,
            token: data.token
        };
        var signInModelData = new SignInModel(loginDataDetails);
        signInModelData.save()
            .then(function () {
                return resolve({
                    data: data
                })
            })
            .catch(function (error) {
                return reject({
                    error: error,
                    message: "Not able to login."
                })
            })
    });
}

function createJsonWebToken(userDetails) {
    var options = {
        expiresIn: 86400
    };

    var payload = {
        userInfo: userDetails._id
    };

    return jwt.sign(payload, secret, options)
}

function removeUser(deleteUsername) {
    return new Promise(function (resolve, reject) {
        User.deleteOne({username: deleteUsername.username})
            .then(function (result) {
                return resolve({
                    message:"User is deleted",
                    code:200,
                    result:result
                })
            })
            .catch(function (err) {
                return resolve({
                    message:"Unable to delete particular user",
                    error:err
                })
            })
    })
}

function fetchAllLoginUsers(request) {
    return new Promise(function (resolve, reject) {
        authenticateUser(request)
            .then(function (result) {
                LoginModel.find()
                    .then(function (loginUsers) {
                        return resolve({
                            message: "Fetched all login users",
                            data: loginUsers
                        })
                    })
                    .catch(function (error) {
                        return resolve({
                            message: "Unable to fetch the login users",
                            error: error
                        })
                    })
            })
            .catch(function (error) {
                return reject({
                    message: "Unable to authenticate the user",
                    error: error
                })
            })
    })
}

function sendMessages(request) {
    return new Promise(function (resolve , reject) {
        authenticateUser(request)
            .then(function () {
                LoginModel.findOne({
                    token: request.body.headers
                })
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    })

                // var message = new Message(request.body);
                // message.save()
                //     .then(function (result) {
                //
                //     })
            })
    })    
}

module.exports = {
    registerUser,
    fetchRecords,
    login,
    removeUser,
    fetchAllLoginUsers,
    sendMessages
};