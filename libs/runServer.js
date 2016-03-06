"use strict";

//Global Variables
var driverG;

//Importing files used.
var conf = require('./conf.js');
var webdriverApi = require('./webdriverApi.js');
var constants = require('./constants.js');
//


// Importing modules used.
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//var webdriver = require('selenium-webdriver');
//

//Running server on localhost:PORT
server.listen(conf.PORT);
console.log('Server running on '+conf.PORT);
//

//Directory for serving static files
app.use(express.static('../static'));
//

//WebSockets
io.on('connection', function (socket){
    
    //console.log("Client connected to server on "+Date.now());
    
    function emitCurrentStats(){
        webdriverApi.getCurrentVideoStats(driverG,function(statusObject){
            socket.emit('currentVideoStats',statusObject);
        });
    }
    setInterval(emitCurrentStats,conf.frontEndUpdateTime);
    
    socket.on('playById',function(videoId){
        webdriverApi.playById(videoId,driverG,function(driver){
            driverG = driver;
            console.log("Played song "+videoId);
        });
    });

    socket.on('setVolume',function(currentVideoId,volume){
        webdriverApi.setVolume(driverG,currentVideoId,volume,function(driver){
            driverG = driver;
            console.log("Changed Volume to "+volume);
        });
    });

    socket.on('seekTo',function(currentVideoId,seekTime){
        webdriverApi.seekTo(driverG,currentVideoId,seekTime,function(driver){
            driverG = driver;
            console.log("Video seeked to "+seekTime);
        });
    });
    
    socket.on('play',function(currentVideoId){
        webdriverApi.play(driverG,currentVideoId,function(driver){
            driverG = driver;
            console.log("Video played.");
        });
    });  
    socket.on('pause',function(currentVideoId){
        webdriverApi.pause(driverG,currentVideoId,function(driver){
            driverG = driver;
            console.log("Video paused.");
        });
    });
    socket.on('stopStream',function(){
        driverG.quit();
    });
});
//

//Start webdriver when app is started for the first time.
webdriverApi.startWebdriver(function(returnedDriver){
    driverG = returnedDriver;
});
