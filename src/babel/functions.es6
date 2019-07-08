;$(function(){
    let $setElm = $('.viewer'),
        fadeSpeed = 1500,
        switchDelay = 5000;

    $setElm.each(function(){
        let targetObj = $(this);
        let findUl = targetObj.find('ul');
        let findLi = targetObj.find('li');
        let findLiFirst = targetObj.find('li:first');

        findLi.css({display:'block',opacity:'0',zIndex:'99'});
        findLiFirst.css({zIndex:'100'}).stop().animate({opacity:'1'},fadeSpeed);

        setInterval(function(){
            findUl.find('li:first-child').animate({opacity:'0'},fadeSpeed).next('li').css({zIndex:'100'}).animate({opacity:'1'},fadeSpeed).end().appendTo(findUl).css({zIndex:'99'});
        },switchDelay);
    });

    // #で始まるリンクをクリックしたら実行されます
    $('a[href="#index"]').click(function() {
        // スクロールの速度
        let speed = 900; // ミリ秒で記述
        let href= $(this).attr("href");
        let target = $(href == "#" || href == "" ? 'html' : href);
        let position = target.offset().top;
        $('body,html').animate({scrollTop:position}, speed, 'swing');
        return false;
    });
});