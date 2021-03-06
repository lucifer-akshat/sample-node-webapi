var registrationService = require('../services/registrationService');

exports.register = function (req, res) {
    registrationService
        .registerUser(req)
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.send(err);
        })

};

exports.fetchRecords = function (req, res) {
    registrationService
        .fetchRecords(req)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.send(err);
        })
};

exports.removeUser = function (req, res) {
    registrationService
        .removeUser(req.query)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.send(err);
        })

}

exports.login = function (req, res) {
    registrationService
        .login(req.body)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.send(err);
        })
};

exports.fetchLoginUsers = function (req, res) {
    registrationService
        .fetchAllLoginUsers(req)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.send(err);
        })
};

exports.pushMessages = function (req, res) {
  registrationService
      .sendMessages(req)
      .then(function (result) {
          res.send(result);
      })
      .catch(function (err) {
          res.send(err)
      })
};

exports.logout = function (req, res) {
    registrationService
        .logoutUser(req)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.send(err)
        })
};

exports.getLoginDetails = function (req, res) {
    registrationService
        .getLoginDetailsUser(req)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.send(err);
        })
};