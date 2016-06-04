var mongoose    = require('mongoose');
var bcrypt      = require("bcryptjs");


var usersSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String,
    eMail: String,
    password: String,
    userPic: String
});

usersSchema.pre("save", function(next){
    var user= this;
    if(!user.isModified("password")){
        return next();
    }
    user.password= bcrypt.hashSync(user.password, 8);
    next();
});

usersSchema.method.comparePassword = function(password){
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', usersSchema);