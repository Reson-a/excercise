//顶部通知条是否显示
if (!getCookies().topbar) {
    var topbar = new Topbar({
        content: '网易云课堂微专业，帮助你掌握专业技能，令你求职或加薪多一份独特优势！',
        href: "#"
    });

    //注册自定义事件。关闭同时设置cookie
    topbar.on('ignore', function() {
        setCookie('topbar', true, getFutureDate(7)); //设置cookie 7天后过期
    });
}



//关注及登录模块
//获取关注及取消按钮
var followBtn = $('#btn-follow');
var unfollowBtn = $('#btn-unfollow'),
    unfollow = $('#unfollow');

//已关注按钮状态
function hasFollowed() {
    followBtn.style.display = 'none';
    unfollowBtn.style.display = 'block';
    unfollowBtn.disabled = true;
}

//未关注按钮状态
function notFollowed() {
    followBtn.style.display = 'block';
    unfollowBtn.style.display = 'none';
}

//关注功能
function follow() {
    get('http://study.163.com/webDev/attention.htm', null, followCallback);
    //关注成功回调
    function followCallback(responseText) {
        if (responseText == 1) {
            setCookie('followSuc', true, getFutureDate(7));
            hasFollowed();
        } else alert('关注失败，请重新尝试');
    }
}

//登录功能
function popLogin() {
    //弹出登录Modal
    var loginModal = new LoginModal({
        action: 'http://study.163.com/webDev/login.htm',
        method: 'get',
        titleName: '登录网易云课堂',
        placeholder: {
            userName: '账号',
            password: '密码'
        },
        pattern: {
            userName: '^\\w{5,12}$',
            password: '^\\S{5,20}$' //(?![^a-zA-Z]+$)(?!\D+$).{6,20}
        },
        sucCallback: loginCallback //登录成功设置关注回调
    });
    //登录成功回调
    function loginCallback() {
        setCookie('loginSuc', true, getFutureDate(7));
        follow();
    }
}

addEvent(followBtn, 'click', function() {
    if (!getCookies().loginSuc) popLogin();
    else follow();
});

addEvent(unfollow, 'click', function() {
    removeCookie('followSuc');
    notFollowed();
});

if (getCookies().followSuc) hasFollowed();
else notFollowed();



//轮播图模块
var sliderContainer = $('.m-sliderbox');

var slider = new Slider({
    container: sliderContainer,
    images: ['img/banner1.jpg', 'img/banner2.jpg', 'img/banner3.jpg'],
    links: ['http://open.163.com/', 'http://study.163.com/', 'http://www.icourse163.org/'],
    isCursor: true,
    isAutoPlay: true,
    animeOptions: {
        fadeIn: 500
    }
});



//滚动图模块，展示数量为5
var scrollContainer = $('.m-scrollbox');
var scroll = new Slider({
    container: scrollContainer,
    showNum: 5,
    images: ['img/workplace1.jpg', 'img/workplace2.jpg', 'img/workplace3.jpg', 'img/workplace4.jpg', 'img/workplace5.jpg'],
    isScroll: true,
    animeOptions: {
        moveX: 8000
    }
});