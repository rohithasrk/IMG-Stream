//Constants used in whole project are defined here.

exports.youtubeWatchUrl = "https://www.youtube.com/watch?v=";
exports.youtubePlayerId = "movie_player";

var getPlayerScript = "myP = document.getElementById('"+exports.youtubePlayerId+"');";
exports.playScript = getPlayerScript + " myP.playVideo()";
exports.pauseScript = getPlayerScript + " myP.pauseVideo()";
exports.getVideoStatsScript = getPlayerScript + " videoData = myP.getVideoData(); "+ " statusObj = {'videoData':videoData,'isMuted':myP.isMuted(),'currentTime':myP.getCurrentTime(),'duration':myP.getDuration(),'playerState':myP.getPlayerState(),'volume':myP.getVolume()}; return statusObj";
exports.volumeScript = function(volume){
    return getPlayerScript + " myP.setVolume("+volume+");";
}
exports.seekScript = function(seekTime){
    return getPlayerScript + " myP.seekTo("+seekTime+");";
}



