var searchService = require('../services/searchService');

exports.searchUser = function (req, res) {
    searchService
        .searchUser(req.query)
        .then(function (result) {
            res.send(result);
        })
        .catch(function (err) {
            res.send(err);
        })
};