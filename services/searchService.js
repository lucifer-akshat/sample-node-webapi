var User = require('../models/user');

function searchUser(request) {
    console.log(request.searchTerm, 'request');
    return new Promise(function (resolve, reject) {
            User.find({
                username:request.searchTerm
            })
                .then(function (result) {
                    console.log(result.length,'coming here');
                    if(result.length >= 1) {
                        return resolve({
                            message:"Found the data",
                            data: result
                        })
                    } else {
                        return resolve({
                            message:"No search results found."
                        })
                    }
                })
                .catch(function (err) {
                    return resolve({
                        message:"Unable to fetch the data",
                        error:err
                    })
                })
    })
}

module.exports = ({
    searchUser
});