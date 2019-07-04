;$(function () {
    $('.pagetop a').on('click', function () {
        $('html,body').animate({
            scrollTop : $('#pagetop').offset().top
        });
        return false;
    });

    $('.menu-trigger').on('click', function(){
        $(this).toggleClass('active');
        $(this).parent('.hamburger').toggleClass('active');
        $('.drawer-nav').slideToggle();
        return false;
    });
});