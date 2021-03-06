require('../models/User');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const express = require('express');
const { route } = require('../routes/uploads');

const User = mongoose.model('Users');
const router = express.Router();

module.exports.register = (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt,(err, hash) => {
            if (err) throw err;
            req.body.password = hash;
            var user = new User();
            user.fullName = req.body.fullName;
            user.email = req.body.email;
            user.phone = req.body.phone;
            user.dept = req.body.dept;
            user.rollno = req.body.rollno;
            user.password = req.body.password;
            var n=user.email;
            if(n.match(/.cse/i)){
                user.role = 'faculty';
            }
            user.save((err, doc) => {
                if (!err){
                    req.flash('success_msg', 'Registered');
                    res.redirect('/');
                }
                else {
                    if (err.name == 'ValidationError') {
                        console.log(err);
                        res.redirect('back');
                    }
                    else
                        console.log('Error during record insertion : ' + err);        
                }
            });
        });
    });
}

module.exports.update = (req, res) => {
    User.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { 
            req.flash('message', "Changes Saved!");
            res.redirect('back'); 
        }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                req.flash('message', err);
                res.redirect('back');
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
};

module.exports.updatePwd = (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt,(err, hash) => {
            let hashP = hash;
            User.findOneAndUpdate({ _id: req.body._id }, {password: hashP}, (err, doc) => {
                if (!err) { 
                    req.flash('message', "Password Updated!");
                    res.redirect(`/${doc.role}/profile`); 
                }
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        res.redirect('Back');
                    }
                    else
                        console.log('Error during record update : ' + err);
                }
            });
        });
    });
}