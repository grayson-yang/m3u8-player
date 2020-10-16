/**
 * player.js
 * @dependency common.js, jquery-3.2.1.min.js
 */

//var video = document.getElementById('video');

function playTwitter(twitter_link){
  var host = 'http://10.154.10.111:5000';
  var path = '/1.1/videos/tweet/get_m3u8?twitter_link=' + twitter_link;
  var serverUrl =  host + path
  $.get(serverUrl).done(function(res){
    return new Promise(function(resolve, reject){
        if('errors' in res){
            reject(res);
        }
        m3u8_url = res["track"]["playbackUrl"];
        $.get(m3u8_url).done(function(res){
            resolve(res);
        }).fail(function(error){reject(error);});
    }).then(function(m3u8_res){
        m3u8_json = parseM3U8ToJson(m3u8_res);
        console.log(m3u8_json)
        quality = [];
        for(var key in m3u8_json){
            quality.push({
                name: m3u8_json[key].RESOLUTION,
                url: 'http://10.154.10.111:8081' + m3u8_json[key].url,
                type: 'hls'
            });
        }
        const dp = new DPlayer({
            container: document.getElementById('dplayer'),
            video: {
                quality: quality,
                defaultQuality: 0,
                pic: 'demo.png',
                thumbnails: 'thumbnails.jpg'
            }
        });
      }).catch(function(reason){
        $("body").html(reason.errors);
      })
  }).fail(function onRejected(error){
    console.log('Error: ' + error);
  }).always(function () {

  });
}

function playPause() {
    video.paused?video.play():video.pause();
}

function volumeUp() {
    if(video.volume <= 0.9) video.volume+=0.1;
}

function volumeDown() {
    if(video.volume >= 0.1) video.volume-=0.1;
}

function seekRight() {
    video.currentTime+=5;
}

function seekLeft() {
    video.currentTime-=5;
}

function vidFullscreen() {
    if (video.requestFullscreen) {
      video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    }
}

//playM3u8(window.location.href.split("#")[1])
requestURL = parseURL(window.location.href)
playTwitter(requestURL.params.twitter_link)
$(window).on('load', function () {
//    $('#video').on('click', function(){this.paused?this.play():this.pause();});
    Mousetrap.bind('space', playPause);
    Mousetrap.bind('up', volumeUp);
    Mousetrap.bind('down', volumeDown);
    Mousetrap.bind('right', seekRight);
    Mousetrap.bind('left', seekLeft);
    Mousetrap.bind('f', vidFullscreen);
});
