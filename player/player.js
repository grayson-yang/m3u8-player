/**
 * player.js
 * @dependency common.js, jquery-3.2.1.min.js
 */

var video = document.getElementById('video');

function playTwitter(twitter_link){
  var host = 'http://10.154.10.111:5000';
  var path = '/1.1/videos/tweet/get_m3u8?twitter_link=' + twitter_link;
  var serverUrl =  host + path
  httpGetAsync(serverUrl, function(result){
    m3u8_url = result?.track?.playbackUrl
    playM3u8(m3u8_url)
  });
}

function playM3u8(url){
  if(Hls.isSupported()) {
      video.volume = 0.3;
      var hls = new Hls();
      var m3u8Url = decodeURIComponent(url)
      hls.loadSource(m3u8Url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED,function() {
		  /* auto play the video */
          // video.play();
      });
      document.title = url
    }
	else if (video.canPlayType('application/vnd.apple.mpegurl')) {
		video.src = url;
		video.addEventListener('canplay',function() {
		  /* auto play the video */
		  // video.play();
		});
		video.volume = 0.3;
		document.title = url;
  	}
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
