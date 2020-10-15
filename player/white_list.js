
getWhiteList();

function getWhiteList(){

  var host = 'http://10.154.10.111:5000';
  var path = '/1/twitter/white_list.json';
  var serverUrl =  host + path
  httpGetAsync(serverUrl, function(result){
    white_list_dict = result.white_list;
    for(var key in white_list_dict){
        generateUserElement(key, displayTweets);
    }
  });
}

function displayTweets(screen_name){
    console.log(screen_name + ' clicked');
    window.location = './list.html' + '?screen_name=' + screen_name;
}

function generateUserElement(screen_name, clickHandle){
    var ulObj = document.createElement("ul");
    $("#container")[0].appendChild(ulObj);
    var liObj = document.createElement("li");
    liObj.innerHTML = screen_name;
    ulObj.appendChild(liObj);
    liObj.onmouseover = function() {
        this.style.backgroundColor = "lightblue";
    };
    liObj.onmouseout = function() {
        this.style.backgroundColor = "";
    };
    liObj.setAttribute("class", screen_name);
    $("." + screen_name).click(function(){
        clickHandle($(this).attr("class"));
    });
}
