const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nickName: {type: String, required: true, useCreateIndex: true},
    password: {type: String, required: true}

});

module.exports = mongoose.model('User', userSchema);
