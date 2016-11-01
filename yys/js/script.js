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

(function () { //沙子移动
    var topHeight = 55,
        sandTop = $('.sand-t'),
        sandLeft = $('.sand-l'),
        sandRight = $('.sand-r'),
        speed = 1 / 50;

    function setAbs() {
        sandTop.css({ marginTop: topHeight, position: 'absolute' });
    }

    function setFixed() {
        sandTop.css({ marginTop: 0, position: 'fixed' });
    }
    setAbs();

    $(window).scroll(function (event) {
        var y = window.scrollY;
        if (y < topHeight) setAbs();
        else setFixed();
        sandLeft.css('margin-left', -y * speed + 'px');
        sandRight.css('margin-right', -y * speed + 'px');
    });
} ());