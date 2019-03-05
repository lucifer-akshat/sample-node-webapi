var registrationService = require('../services/registrationService');

exports.register = function (req, res) {
    registrationService
        .registerUser(req.body)
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.send(err);
        })

};