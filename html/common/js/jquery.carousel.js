/* =========================================================*/
// jquery.carousel.js / ver.1.2

// Copyright (c) 2015 CoolWebWindow
// This code is released under the MIT License
// https://osdn.jp/projects/opensource/wiki/licenses%2FMIT_license

// Date: 2015-12-28
// Author: CoolWebWindow
// Mail: info@coolwebwindow.com
// Web: http://www.coolwebwindow.com

// Used jquery.js
// http://jquery.com/
/* =========================================================*/

$(function($){
    $.fn.carousel = function (options) {
        // オプション初期値
        var o = $.extend({
            touch         : true,
            touchDistance : '80',
            autoSlide     : true,
            repeat        : true,
            imgHoverStop  : true,
            navHoverStop  : true,
            interval      : 3000,
            duration      : 500,
            easing        : 'swing',
            viewSlide     : 1,
            skip          : true,
            responsive    : true,
            breakpoint    : [{'width':479, 'viewSlide':1}]
        }, options);

        // セレクタ設定
        var $slideWrap  = $(this),
            $slider     = $slideWrap.children('.slide'),
            $container  = $slider.children('.slideInner'),
            $element    = $container.children(),
            $prevNav    = $slider.children('.slidePrev'),
            $nextNav    = $slider.children('.slideNext'),
            $controlNav = $slider.children('.controlNav');

        // 初期設定
        var count = 1,
            imgNum = 1,
            slideCount = 1,
            stopFlag = false,
            hoverFlag = false,
            viewSlide = o.viewSlide,
            slideUnit = 1,
            initialEle = $element.length;
        if(o.skip) {
            slideUnit = o.viewSlide;
        }

        // 変数設定
        var windowWidth,
            elementWidth,
            initialWidth,
            slideWrapWidth,
            slideViewWidth,
            slideWidth,
            totalWidth,
            slideWidthPadding,
            slidePosition,
            maxGroupCount,
            lastGroupEle,
            lastWidth;

        // スライド部分の囲み枠作成
        $container.wrap('<div class="slideInnerWrap"></div>');
        var $slideInnerWrap = $slider.find('.slideInnerWrap');
        $slideInnerWrap.css({'overflow' : 'hidden'});

        // スライド画像複製
        $('li', $container).clone().prependTo($container);
        $('li', $container).clone().appendTo($container);

        // 初期設定
        var initialize = function () {
            elementWidth = $slider.find('li').outerWidth(true);
            slideWidth = elementWidth * slideUnit;
            slideViewWidth = elementWidth * viewSlide;
            $slider.css({
                'width' : slideViewWidth + 'px'
            });
            $slideWrap.css({
                'width' : slideViewWidth + 'px'
            });
            slideWrapWidth = $slideWrap.outerWidth(true);
            slideWidthPadding = slideWrapWidth - slideViewWidth;
            initialWidth = slideWrapWidth;
            // ナビゲーション設定
            windowWidth = $(window).width();
            if(o.responsive && (windowWidth >= initialWidth)) {
                navigation(slideUnit);
            }
             if(!o.responsive) {
                navigation(slideUnit);
            }
           // サイズ設定
            resize();
        }

        // リサイズ
        var resize = function () {
            windowWidth = $(window).width();
            if(windowWidth < initialWidth){
                slideWrapWidth = windowWidth - slideWidthPadding;
            } else {
                slideWrapWidth = initialWidth - slideWidthPadding;
                viewSlide = o.viewSlide;
            }
            if(o.responsive) {
                breakPoints();
            }
            slideViewWidth = slideWrapWidth;
            elementWidth = slideViewWidth / viewSlide;
            slideWidth = elementWidth * slideUnit;
            totalWidth = $slider.find('li').length * elementWidth;
            slidePosition = elementWidth * $element.length;
            maxGroupCount = Math.ceil(initialEle / slideUnit);
            lastGroupEle = initialEle % slideUnit;
            lastWidth = elementWidth * lastGroupEle;
            $slider.find('li').css({width : elementWidth});
            $slider.css({
                'width' : slideViewWidth + 'px'
            });
            $slideWrap.css({
                'width' : slideViewWidth + 'px'
            });
            $container.css({
                'width' : totalWidth + 'px',
                'margin-left' : -slidePosition + 'px'
            });
        }

        // ブレークポイント
        var breakPoints = function () {
            o.breakpoint.unshift({'width':initialWidth, 'viewSlide':o.viewSlide});
            o.breakpoint.sort(function(a, b){
                var x = a.width;
                var y = b.width;
                if (x < y) return 1;
                if (x > y) return -1;
                return 0;
            });
            for (var i in o.breakpoint) {
                var breakpointWidth = o.breakpoint[i].width;
                if(windowWidth <= breakpointWidth) {
                    if(count != 1) {
                        var slideCount = count -1;
                        prevSlide(slideCount);
                        count = 1;
                    }
                    viewSlide = o.breakpoint[i].viewSlide;
                    if(o.skip) {
                        slideUnit = o.breakpoint[i].viewSlide;
                    } else {
                        slideUnit = 1;
                    }
                    $controlNav.empty();
                    navigation(slideUnit);
                }
                if(windowWidth >= initialWidth) {
                    if(count != 1) {
                        var slideCount = count -1;
                        prevSlide(slideCount);
                        count = 1;
                    }
                    viewSlide = o.breakpoint[0].viewSlide;
                    if(o.skip) {
                        slideUnit = o.breakpoint[0].viewSlide;
                    } else {
                        slideUnit = 1;
                    }
                    $controlNav.empty();
                    navigation(slideUnit);
                }
            }
        }

        // 自動切り替えスタート
        var start;
        var startTimer = function () {
            start = setInterval(function(){
                nextSlide(slideCount);
            },o.interval);
        };

        // 自動切り替えストップ
        var stopTimer = function () {
             clearInterval(start);
        };

        // ストップ機能
        var slideStop = function () {
            if (!o.repeat) {
                if(count >= maxGroupCount){
                    $nextNav.addClass('hidden');
                    stopTimer();
                    stopFlag = true;
                }else{
                    $nextNav.removeClass('hidden');
                    $nextNav.show();
                }
                if(count == 1){
                    $prevNav.addClass('hidden');
                }else{
                    $prevNav.removeClass('hidden');
                }
            }
        };

        // コントールナビデザイン
        var controlNavDesign = function () {
            $controlNav.children('span').removeClass('current');
            $controlNav.children('span').eq(count -1).addClass('current')
        };
        if (!o.repeat) {
            $prevNav.addClass('hidden');
        }

        // カウンター
         var counter = function () {
            if(count > 0) {
                count = count % $controlNav.children('span').length;
            }
            if(count < 1) {
                count = (count % $controlNav.children('span').length) + $controlNav.children('span').length;
            }
        };

        // 左方向スライド
        var prevSlide = function (slideCount) {
            stopTimer();
            // スライドに余りがある場合
            if(lastGroupEle >0) {
                if(count == maxGroupCount){
                    var moveWidth = lastWidth + (slideWidth * (slideCount - 1));
                    var moveImg = (slideUnit * (slideCount - 1)) + lastGroupEle;
                }else{
                    var moveWidth = slideWidth * slideCount;
                    var moveImg = slideUnit * slideCount;
                }
            // スライドに余りがない場合
            }else{
                var moveWidth = slideWidth * slideCount;
                var moveImg = slideUnit * slideCount;
            }
            // スライド実行
            $container.not(':animated').animate({
                marginLeft:parseInt($container.css('margin-left')) + moveWidth + 'px'
            },o.duration,o.easing,
            function(){
                for(i=0; i < moveImg; i++){
                    $('li:last-child', $container).prependTo($container);
                }
                $container.css('margin-left',-slidePosition + 'px');
            });
            count -= slideCount;
            counter();
            controlNavDesign();
            slideStop();
            if(!stopFlag && o.autoSlide && !hoverFlag) {
                startTimer();
            }
        }

        // 右方向スライド
        var nextSlide = function (slideCount) {
            stopTimer();
           // スライドに余りがある場合
            if(lastGroupEle >0) {
                if((count + slideCount) == maxGroupCount){
                    var moveWidth = lastWidth + (slideWidth * (slideCount - 1));
                    var moveImg = (slideUnit * (slideCount - 1)) + lastGroupEle;
                }else{
                    var moveWidth = slideWidth * slideCount;
                    var moveImg = slideUnit * slideCount;
                }
            // スライドに余りがない場合
            }else{
                var moveWidth = slideWidth * slideCount;
                var moveImg = slideUnit * slideCount;
            }

            // スライド実行
            $container.not(':animated').animate({
                marginLeft:parseInt($container.css('margin-left')) - moveWidth + 'px'
            },o.duration,o.easing,
            function(){
                for(i=0; i < moveImg; i++){
                    $('li:first-child', $container).appendTo($container);
                }
                $container.css('margin-left',-slidePosition + 'px');
            });
            count += slideCount;
            counter();
            controlNavDesign();
            slideStop();
            if(!stopFlag && o.autoSlide && !hoverFlag) {
                startTimer();
            }
        }

        // ナビゲーション生成
        var navigation = function (slideUnit) {
            maxGroupCount = Math.ceil(initialEle / slideUnit);
            for(e=0; e < maxGroupCount; e++) {
                $('<span/>').text(e + 1).appendTo($controlNav).click(function () {
                    if($container.is(':animated')){
                        return false;
                    }
                    var select = $controlNav.children('span').index(this);
                    var current = $controlNav.children('span.current').index();
                    // スライドなし
                    if(select == current) {
                        return false;
                    }
                    // 左方向スライド
                    if(select < current) {
                        var slideCount = current - select;
                        prevSlide(slideCount);
                    }
                    // 右方向スライド
                    if(select > current) {
                        var slideCount = select - current;
                        nextSlide(slideCount);
                    }
                });
                $controlNav.children('span:first-child').addClass('current');
            };
        }

        // タッチパネルはホバー動作無効
        if(!('ontouchstart' in document)) {
            // 画像にホバーした際の動作
            if(o.imgHoverStop){
                $container.hover(function() {
                    stopTimer();
                },function() {
                    if(!stopFlag && o.autoSlide) {
                        startTimer();
                    }
                });
            }

            // ナビゲーションにホバーした際の動作
            if(o.navHoverStop){
                $prevNav.hover(function() {
                    hoverFlag = true;
                    stopTimer();
                },function() {
                    hoverFlag = false;
                    if(!stopFlag && o.autoSlide) {
                        startTimer();
                    }
                });

                $nextNav.hover(function() {
                    hoverFlag = true;
                    stopTimer();
                },function() {
                    hoverFlag = false;
                    if(!stopFlag && o.autoSlide) {
                        startTimer();
                   }
                });

                $controlNav.hover(function() {
                    hoverFlag = true;
                    stopTimer();
                },function() {
                    hoverFlag = false;
                    if(!stopFlag && o.autoSlide) {
                        startTimer();
                    }
                });
            }
        }

        // タップした位置をメモリーする
        function touchStart(e) {
            var pos = Position(e);
            $slider.find('li').data('memoryS',pos.x);
        }

        // タップを離した位置をメモリーする
        function touchMove(e) {
            // 位置情報を取得
            var pos = Position(e);
            $slider.find('li').data('memoryE',pos.x);
        }

        // スワイプ（タップした位置からプラスかマイナスかで左右移動を判断）
        function touchEnd(e) {
            var startX = $slider.find('li').data('memoryS');
            var endX = $slider.find('li').data('memoryE');

            // 左から右へスワイプ
            if(startX < endX) {
                if(endX - startX > o.touchDistance){
                    if($container.is(':animated')) {
                        return false;
                    }
                    prevSlide(slideCount);
                }

            // 右から左へスワイプ
            }else{
                if(startX - endX > o.touchDistance){
                    if($container.is(':animated')) {
                        return false;
                    }
                    nextSlide(slideCount);
                }
            }
        }

        // 現在位置を取得
        function Position(e){
            var x = Math.floor(e.originalEvent.touches[0].pageX)
            var y = Math.floor(e.originalEvent.touches[0].pageY);
            var pos = {'x' : x , 'y' : y};
            return pos;
        }

        // 初期設定
        initialize();

        // リサイズ
        var resizeTimer = false;
        $(window).on('resize', function(){
            if(o.responsive){
                stopTimer();
            }
            if (resizeTimer != false) {
                clearTimeout(resizeTimer);
            }
            resizeTimer = setTimeout(function() {
                resize();
            }, 50);
            if(o.responsive && !stopFlag && o.autoSlide) {
                startTimer();
            }
        });

        // 自動スタート設定
        if(o.autoSlide){
            startTimer();
        }

        // 戻るボタン
        $prevNav.click(function(){
            if($container.is(':animated') || (!o.repeat) && (count == 1)){
                return false;
            }
            slideCount = 1;
            prevSlide(slideCount);
       });

        // 進むボタン
        $nextNav.click(function(){
            if($container.is(':animated') || (!o.repeat) && (count >= maxGroupCount)){
                return false;
            }
            slideCount = 1;
            nextSlide(slideCount);
        });

        // タッチパネル対応
        if(o.touch) {
            $slider.find('li').on('touchstart', touchStart);
            $slider.find('li').on('touchmove' , touchMove);
            $slider.find('li').on('touchend' , touchEnd);
        }

    };
});
