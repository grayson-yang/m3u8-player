/**
 * list.js
 * @dependency common.js
 */
function addVideoPanel(tweet_url){
    var panel = '    <div style="width:300px; height:200px; margin:auto; background:black">'
    +'<iframe style="width:100%; height:100%"'
    +'        src="/player/?twitter_link=' + tweet_url + '">'
    +'</iframe>'
    +'</div>';
    var container = document.getElementById('container');
    container.innerHTML += panel;
}

function getTweets(screen_name){
  var host = 'http://10.154.10.111:5000';
  var path = '/2/timeline/media/' + screen_name + '.json';
  var serverUrl = host + path;
  httpGetAsync(serverUrl, function(result){
    for(i in result?.tweets){
        if(i > 10) break;
        tweet = result?.tweets[i]
        addVideoPanel(tweet.tweet_url);
    }
  });
}

requestURL = parseURL(window.location.href);
getTweets(requestURL.params.screen_name);