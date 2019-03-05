var express = require('express');
// var mongoose = require('mongoose');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcrypt');
var registerController = require('../controllers/registrationController');
// var User = mongoose.model('Users');

//GET route for reading data
// router.get('/', function (req, res, next) {
//     return res.sendFile(path.join(_dirname + '/templateLogReg/index.html'));
// });

// //POST route for updating data
// router.post('/', function(req, res, next) {
// //    confirm that user typed same password twice
//     if(req.body.password !== req.body.passwordConf) {
//         var err = new Error('Passwords do not match');
//         err.status = 400;
//         res.send("passwords do not match");
//         return next(err);
//     }
//
//     if(req.body.email && req.body.username && req.body.password && req.body.passwordConf) {
//         var userData = {
//             email: req.body.email,
//             username: req.body.username,
//             password: req.body.password,
//         };
//
//         User.create(userData, function (error, user) {
//             if(error) {
//                 return next(error);
//             } else {
//                 req.session.userId = user._id;
//                 return res.redirect('/profile');
//             }
//         });
//     } else if(req.body.logemail && req.body.logpassword) {
//         User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
//             if(error || !user) {
//                 var err = new Error("Wrong email or password");
//                 err.status = 401;
//                 return next(err);
//             } else {
//                 req.session.userId = user._id;
//                 return res.redirect('/profile');
//             }
//         });
//     } else {
//         var err = new Error('All fields are mandatory');
//         console.log(err,'coming here');
//         err.status = 400;
//         return next(err);
//     }
// });
//
// //GET route after registering
// router.get('/profile', function (req, res, next) {
//     User.findById(req.session.userId)
//         .exec(function (error, user) {
//             if(error) {
//                 return next(error);
//             } else {
//                 if(user === null) {
//                     var err = new Error("Not authorised!");
//                     err.status = 400;
//                     return next(err);
//                 } else {
//                     return res.send('<h1>Name:</h1>'+user.username+'<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
//                 }
//             }
//         })
// });
//
// //GET route for logout
// router.get('/logout', function(req, res, next) {
//     if(req.session) {
//     //    delete session object
//         req.session.destroy(function (err) {
//             if(err) {
//                 return next(err);
//             } else {
//                 return res.redirect('/');
//             }
//         })
//     }
// });

// router.post('/register', function (req, res) {
//     function registration() {
//         return new Promise(function (resolve, reject) {
//             console.log('coming here');
//             var userData = {
//                 username: req.body.username,
//                 email: req.body.email,
//                 password: req.body.password
//             };
//             bcrypt.hash(req.body.password, 10, function (error, hash) {
//                 if(error) {
//                     return;
//                 }
//                 console.log(hash);
//                 userData.password = hash;
//             });
//             var user = new User(userData);
//             user.save()
//             //     function (error, response) {
//             //     console.log(response, 'response');
//             //     console.log(error, 'error');
//             //     console.log(user);
//             //     if(error) {
//             //         return reject(error);
//             //     } else {
//             //         return resolve(response);
//             //     }
//             // })
//                 .then(function (response) {
//                     console.log(response);
//                 })
//                 .catch(function (err) {
//                     console.log(err, 'in catch');
//                 })
//         })
//     }
//     if(req.body.username && req.body.email && req.body.password){
//         registration().then(function (data) {
//             res.json({
//                 data: data,
//                 message: "User Succesfully added",
//                 status: "Success"
//             })
//         })
//             .catch(function (err) {
//                 res.json({
//                     error: err
//                 })
//             })
//     } else {
//         res.json({
//             message: "Unproccessible request",
//         })
//     }
// });

router.post('/register', registerController.register);

router.get('/getAllRecords', function (req, res) {
    User.find()
        .then(function (response) {
            console.log(response);
            return res.send(response);
        })
        .catch(function (err) {
            console.log(err);
        })
});

router.post('/login', function (req, res) {
   User.findOne({username: req.body.username})
       .then(function (response) {
           console.log(req.body);
            if(response === null) {
                return res.json({
                    message: "User not found"
                })
            } else {
                if(response.username === req.body.username) {
                    return res.json({
                        message:"Login successful"
                    })
                }
            }

       })
});




module.exports = router;