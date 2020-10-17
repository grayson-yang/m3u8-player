/**
 * list.js
 * @dependency common.js
 */

localStorage.setItem('cursor', 0);
localStorage.setItem('__cache_tweets', JSON.stringify([]));

requestURL = parseURL(window.location.href);
screen_name = requestURL.params.screen_name;
getTweets(screen_name);

function addVideoPanel(tweet_url){
    var divObj = document.createElement("div");
    divObj.setAttribute("style", "width:478px; height:360px; margin:auto; background:black");
    var iframeObj = document.createElement("iframe");
    iframeObj.setAttribute("style", "width:100%; height:100%");
    iframeObj.setAttribute("src", "/player/?twitter_link=" + tweet_url);
    divObj.appendChild(iframeObj);
    $("#container")[0].appendChild(divObj);
}

function getTweets(screen_name, cursor, count){
  var host = 'http://10.154.10.111:5000';
  var path = '/2/timeline/media/' + screen_name + '.json';
  var serverUrl = host + path;

  return new Promise(function(resolve, reject){
    cursor = localStorage.getItem('cursor');
    if(cursor != null) cursor = parseInt(cursor); else cursor = 0;
    if(cursor == -1){
      reject('page end!');
      return;
    }
    count = 10;
    $.ajax({
        type: "GET",
        url: serverUrl,
        data: { cursor: cursor, count: count },
        success: function(data, textStatus, request){
          resolve(data);
        },
        complete: function(xhr, data){},
        error:function(error){ reject(error); }
    });
  }).then(function(res){
    localStorage.setItem('cursor', res?.cursor);
    __cache_tweets = localStorage.getItem('__cache_tweets');
    if(__cache_tweets != null) __cache_tweets = JSON.parse(__cache_tweets); else __cache_tweets = [];
    is_cache_changed = false;
    for(key in res?.tweets){
        if(__cache_tweets.indexOf(key) < 0){
            is_cache_changed = true;
            tweet = res?.tweets[key];
            __cache_tweets.push(key);
            addVideoPanel(tweet.tweet_url);
        }
    }
    if(is_cache_changed == true) localStorage.setItem('__cache_tweets', JSON.stringify(__cache_tweets));
  }).catch(function(error){
    console.log('Error: ' + error);
  });
}

$(window).scroll(function(){
    var wScrollY = window.scrollY;
    var wInnerH = window.innerHeight;
    var bScrollH = document.body.scrollHeight;
    if (wScrollY + wInnerH >= bScrollH-10) {
        getTweets(screen_name)
    }
});
