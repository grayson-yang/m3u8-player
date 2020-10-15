
parseM3U8ToJson = function parseM3U8ToJson(m3u8Context){
    var lines = m3u8Context.split('\n');
    if(lines.length > 1 && lines[1].indexOf("#EXT-X-INDEPENDENT-SEGMENTS") >= 0){
        media = {}
        for(var i = 0; i < lines.length; i ++){
            if(lines[i].indexOf('#EXT-X-STREAM-INF') >= 0){
                stream_inf = parseStreamInf(lines[i]);
                stream_inf['url'] = lines[i + 1]
                media[stream_inf.RESOLUTION] = stream_inf;
            }
        }
        return media;
    }
    return null;
}

/**
 * from:
 * #EXT-X-STREAM-INF:BANDWIDTH=288000,RESOLUTION=320x180,CODECS="mp4a.40.2,avc1.4d0015",SUBTITLES="subs"
 * to:
 * {BANDWIDTH: "288000", RESOLUTION: "320x180", CODECS: "mp4a.40.2,avc1.4d0015", SUBTITLES: "subs"}
 */
function parseStreamInf(streamInf){
    if(streamInf.indexOf("#EXT-X-STREAM-INF") > 0)
        return null;

    content = streamInf.substring(streamInf.lastIndexOf(':') + 1)
    lockContent = []
    regExpArray = []
    // "mp4a.40.2,avc1.4d0015" and "subs"
    pattern = /"[a-zA-Z0-9]+"|"[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+\,[a-zA-Z0-9]+\.[a-zA-Z0-9]+"/;

    while(regExpArray != null){
        regExpArray = pattern.exec(content)
        if(regExpArray != null){
            lockContent.push(regExpArray[0]);
            content = content.replace(regExpArray[0], '${}')
        }
    }
    array = content.split(',');
    obj = {}
    lockIndex = 0;
    for(var i in array){
        key = array[i].split('=')[0];
        value = array[i].split('=')[1];
        if(value.indexOf('${}') >= 0){
            value = lockContent[lockIndex].replaceAll('"', '');
            lockIndex ++;
        }
        obj[key] = value;
    }
    return obj;
}
