//轮播图展示
var sliderContainer = $('.m-sliderbox');

var slider = new Slider({
    container: sliderContainer,
    images: ['img/banner1.jpg', 'img/banner2.jpg', 'img/banner3.jpg'],
    isCursor: true,
    isDrag: false,
    isAutoPlay: true
});

//滚动图片展示，展示数量为5
var scrollContainer = $('.m-scrollbox');
var scoll = new Slider({
    container: scrollContainer,
    showNum: 5,
    images: ['img/workplace1.jpg', 'img/workplace2.jpg', 'img/workplace3.jpg', 'img/workplace4.jpg', 'img/workplace5.jpg'],
    isCursor: false,
    isDrag: false,
    isAutoPlay: true,
    autoPlayTime: 10000,
    animeDuration: 10000
});