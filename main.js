$(window).on('load', function () {
    $('#m3u8-placeholder')[0].value = localStorage.getItem('m3u8-link') || '';
    $('#play-btn').on('click', function () {
        localStorage.setItem('m3u8-link', $('#m3u8-placeholder')[0].value);
        console.log(encodeURI($('#m3u8-placeholder')[0].value))
        window.location.href = './player' + '?twitter_link=' + encodeURI($('#m3u8-placeholder')[0].value);
    });
});
