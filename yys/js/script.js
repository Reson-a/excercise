var gallery = new Gallery({
    container: $('.gallery-container'),
    /*images: ['http://res.yys.netease.com/pc/fab/20160829095101/img/tese-pic-1_766f012.jpg',
        'http://res.yys.netease.com/pc/fab/20160829095101/img/tese-pic-2_dbbe4a6.jpg',
        'http://res.yys.netease.com/pc/fab/20160829095101/img/tese-pic-3_f3d43ab.jpg',
        'http://res.yys.netease.com/pc/fab/20160829095101/img/tese-pic-4_eb592d7.jpg',
        'http://res.yys.netease.com/pc/fab/20160829095101/img/tese-pic-5_75fa5be.jpg',
    ]*/
    images: ['img/gallery-1.jpg',
        'img/gallery-2.jpg',
        'img/gallery-3.jpg',
        'img/gallery-4.jpg',
        'img/gallery-5.jpg',
    ]
});

//资源加载完成时显示loading及出场特效
window.onload = function() {
    $('.loading').css('display', 'none');
    $('.show').css({ opacity: 1, transform: 'translate(0,0) scale(1)' });
};


//元素随鼠标滚轮移动
(function() {
    var topHeight = 55,
        triggerHeight = 300,
        sandTop = $('.sand-t'),
        sandLeft = $('.sand-l'),
        sandRight = $('.sand-r'),
        sandSpeed = 1 / 50,
        moveDelay = $('.move-delay'),
        delaySpeed = 1 / 3;

    function setAbs() {
        sandTop.css({ marginTop: topHeight, position: 'absolute' });
    }

    function setFixed() {
        sandTop.css({ marginTop: 0, position: 'fixed' });
    }
    setAbs();

    $(window).scroll(function(event) {
        var y = window.pageYOffset; //document.documentElement.scrollTop window.pageYOffset window.scrollY
        if (y < topHeight) setAbs();
        else setFixed();
        if (y > triggerHeight) $('.show-later').css({ opacity: 1, transform: 'translate(0,0) scale(1)' });
        sandLeft.css('margin-left', -y * sandSpeed + 'px');
        sandRight.css('margin-right', -y * sandSpeed + 'px');
        moveDelay.css('margin-top', -y * delaySpeed + 'px');
    });
}());