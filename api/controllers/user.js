const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const hlfModule = require('./hlf-panel/registerUser.js');

const User = require('../models/user');

exports.create_user = (req, res, next) => {
    User.find({nickName: req.body.nickName})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'existing nickName'
                })
            } else {
                bcrypt.hash(req.body.password, 10, async (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            err
                        })
                    } else {

                        try {
                            await hlfModule.registerUser(req.body.nickName);
                        } catch (err) {
                            console.log(err);
                            return res.status(500).json({
                                err
                            })
                        }

                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            nickName: req.body.nickName,
                            password: hash
                        });

                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User Created'
                                });
                                console.log(result);
                            })
                            .catch(err => {
                                res.status(500).json({
                                    err
                                })
                            })
                    }

                });
            }
        })
        .catch(err => {
            res.status(200).json({
                err
            })
        });

};

exports.login_user = (req, res, next) => {
    User.find({nickName: req.body.nickName})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed 1'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Login Error'
                    });
                }

                if (result) {
                    const token = jwt.sign({
                        nickName: user[0].nickName,
                        id: user[0]._id
                    }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    });

                    return res.status(200).json({
                        message: 'Auth success',
                        token
                    });
                } else {
                    return res.status(401).json({
                        message: 'Auth failed 2'
                    });
                }
            })
        })
        .catch(err => {
            res.status(401).json({
                err
            })
        })
};

exports.get_all_users = (req, res, next) => {
    User.find().exec().then(result => {
        res.status(200).json({
            result
        })
    }).catch();
};

exports.delete_user = (req, res, next) => {
    User.deleteOne({_id: req.params.userID})
        .exec()
        .then(result => {
            res.status(200).json({
                result
            })
        })
        .catch(err => {
            res.status(500).json({
                err
            })
        });
};
