var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var async = require('async');

router.get('/', function (req, res) {
    if(req.user&&req.user.username==="admin"){
        res.redirect("/admin");
    }else if(req.user){
        res.redirect("/player");
    }else{
            res.render("index");
    }
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
    if(req.user&&req.user.username==="admin"){
        var deleted = req.body.deleted.split(',%,');
        if(deleted.length>0) deleted.pop();
        var approved = req.body.approved.split(',%,');
        if(approved.length>0) approved.pop();
        var toBeApproved = req.body.toBeApproved.split(',%,');
        if(toBeApproved.length>0) toBeApproved.pop();
        var calls = [];
        approved.forEach(function(username){
            calls.push(function(callback){
                Account.findOneAndUpdate({username:username},{$set:{approved:true}}, function(err,object){
                    if(err){
                        return callback(err);
                    }
                    callback(null,object);
                });
            });
        });


        toBeApproved.forEach(function(username){
            calls.push(function(callback){
                Account.findOneAndUpdate({username:username},{$set:{approved:false}}, function(err,object){
                    if(err){
                        return callback(err);
                    }
                    callback(null,object);
                });
            });
        });

        deleted.forEach(function(username){
            calls.push(function(callback){
                Account.remove({username:username}, function(err){
                    if(err){
                        return callback(err);
                    }
                    callback(null,null);
                });
            });
        });
        async.parallel(calls,function(error,result){
            if (error){
                res.send("Oops there was an error.!");
            }else{
                res.redirect('/admin');
            }            
        });
    }else{
        res.send("Not allowed");
    }
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


router.get('/player',function(req, res){
    if(!req.user){
        res.redirect('/');
    }else{
        var username = req.user.username;
        Account.find({username:username},function(err,users){
            if(users[0].approved){
                res.render('player');
            }else{
                res.send('Waiting approval from the admin');
            }
        });
    }
})


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

module.exports = router;

