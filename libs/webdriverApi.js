"use strict";

var constants = require('./constants.js');
var webdriver = require('selenium-webdriver'),
        By = require('selenium-webdriver').By,
        until = require('selenium-webdriver').until;
    
//Launches a Mozilla Firefox window using selenium webdriver and returns the driver object
exports.startWebdriver = function(callback){
    
    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();
    callback(driver);
}


//
exports.streamById = function(driver,myEE,callback,videoId,count){
    driver.get(constants.youtubeWatchUrl+videoId).then(callback(null),function(err){
        if(count==1){
            count++;
            myEE.emit('updatingG',true);
            exports.startWebdriver(function(newDriver){
                myEE.emit('updateDriverG',newDriver);
                exports.streamById(newDriver,myEE,callback,videoId,count);
            }); 
        }else{
            callback(false);
        }
    });
}

exports.getVideoStats = function(driver,myEE,callback){
    var statusObj = {};
    statusObj.driverUp = false;
    driver.getCurrentUrl().then(function(url){
        statusObj.driverUp = true;
        if(!url){
            statusObj.youtubeOpen = false;
            myEE.emit('youtubeOpen',false);
        }else{
            var substring = constants.youtubeWatchUrl;
            if(url.indexOf(substring) == -1){
                statusObj.youtubeOpen = false;
                myEE.emit('youtubeOpen',false);
                callback(statusObj);
            }else{
                myEE.emit('youtubeOpen',true);
                statusObj.youtubeOpen = true;
                driver.executeScript(constants.getVideoStatsScript).then(function(s){
                    if(s){
                        statusObj.videoStats = s;
                    }
                    callback(statusObj);
                },function(err){
                    console.log(err);
                    statusObj.youtubeOpen = false;
                    callback(statusObj);
                });
            }
        }
    },function(err){
        myEE.emit('youtubeOpen',false);
        console.log(err);
        myEE.emit('webdriverOpen',false)
        statusObj.driverUp = false;
        callback(statusObj);
    })//.thenCatch(function(err){
      //  console.log(err);
      //  myEE.emit('webdriverOpen',false);
    //});
}

exports.setVolume = function(driver,myEE,volume,callback){
    driver.executeScript(constants.volumeScript(volume)).then(function(){
            callback();
    },function(err){
        myEE.emit('youtubeOpen',false);
        console.log(err);
    });
}

exports.seekTo = function(driver,myEE,seekTime,callback){
    driver.executeScript(constants.seekScript(seekTime)).then(function(){
            callback();
        },function(err){
            myEE.emit('youtubeOpen',false);
            console.log(err);
    });
}

exports.play = function(driver,myEE,callback){
    driver.executeScript(constants.playScript).then(function(){
            callback();
    },function(err){
        myEE.emit('youtubeOpen',false);
        console.log(err);
    });
}

exports.pause = function(driver,myEE,callback){
    driver.executeScript(constants.pauseScript).then(function(){
        callback();
    },function(err){
        myEE.emit('youtubeOpen',false);
        console.log(err);
    });
}
