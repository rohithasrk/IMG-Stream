var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/admin', function(req, res){
    if(!req.user){
        res.redirect('/login');
    }else if(req.user.username !== 'admin'){
        res.render('message',{ message:'Please Login as "admin".' });
    }else{
   	Account.find({}, function(err, users) {
        var users_approved = [];
        var users_toBeApproved = [];
        for(i=0, j=0, k=0;i<users.length;i++){
            if(users[i].approved){ 
                if(users[i].username!="admin"){
                    users_approved[j] = users[i].username;
                    j = j+1;
                }
            }else{
                users_toBeApproved[k] = users[i].username;
                k = k+1;
            }
        }
           res.render("admin",{users_approved:users_approved,users_toBeApproved:users_toBeApproved});
        });
    }
});

router.post('/admin', function(req, res){
    if(!req.user || req.user!=='admin'){
        res.send("Not allowed.");
    }else{
        res.send("User will be allowed");
    }
}); 

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    var approved = false;
    if(req.body.username === "admin"){ 
        approved = true;
    }
    Account.register(new Account({ username : req.body.username, approved:approved }), req.body.password, function(err, account) {
        if (err) {
          return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;

