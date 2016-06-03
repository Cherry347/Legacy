var mongoose = require('mongoose');


var usersSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String,
    eMail: String,
    password: String
});

module.exports = mongoose.model('User', usersSchema);