//顶部通知条是否显示
if (!getCookies().topbar) {
    var topbar = new Topbar({
        content: '网易云课堂微专业，帮助你掌握专业技能，令你求职或加薪多一份独特优势！',
        href: "#"
    });

    //注册自定义事件。关闭同时设置cookie
    topbar.on('ignore', function () {
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

addEvent(followBtn, 'click', function () {
    if (!getCookies().loginSuc) popLogin();
    else follow();
});

addEvent(unfollow, 'click', function () {
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
        moveX: 10000
    }
});


//视频弹窗模块
var videoTrigger = $('#video-trigger');
addEvent(videoTrigger, 'click', popVideo);

function popVideo() {
    var videoModal = new VideoModal({
        src: 'http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4',
        poster: 'img/video.jpg',
        controls: true,
        autoplay: false,
        preload: 'auto',
        loop: false
    });
}


//课程模块
var tabContainer = $('.m-tabbox');
var courseContainer = $('.m-coursebox ul');
var pageSize = 20; //每页课程的数量
var typeList = ['10', '20']; //产品设计类型为10 编程语言20
var typeIndex = 0; //初始状态为产品设计
var pageIndex = 1; //当前页码
var courseList = []; //课程列表
var detailCourseList = []; //课程详细信息列表
var courseDataList = [
    [],
    []
];


//获取课程数据，每次点击时触发，防止一次性请求数据量过大
function getCourse(pageNo, psize, typeIndex) {
    //回调方法
    function courseCallback(responseText) {
        var data = JSON.parse(responseText);
        var newCourseData = [].slice.call(data.list);
        var start = pageNo * psize;
        for (var i = 0; i < psize; i++) {
            courseDataList[typeIndex][start + i] = newCourseData[i]
        }
        addCourse(pageNo, psize, typeIndex);
        if (!pageNo) createPager(data.totalPage);
    }
    get('http://study.163.com/webDev/couresByCategory.htm', {
        pageNo: pageNo + 1,
        psize: psize,
        type: typeList[typeIndex]
    }, courseCallback);
}

//添加课程的方法
function addCourse(pageNo, psize, typeIndex) {
    var start = pageNo * psize;
    for (var i = 0; i < psize; i++) {
        var options = courseDataList[typeIndex][start + i];
        var course = courseList[i];
        var detailCourse = detailCourseList[i];
        if (!course) { //课程不存在则添加课程
            var course = createCourse(courseContainer);
            var detailCourse = createDetail(course.course);
            bindDetail(course, detailCourse);
            courseList.push(course);
            detailCourseList.push(detailCourse);
        }
        var courseNode = course.course;
        if (!options) courseNode.style.display = 'none'; //无数据的course暂时隐藏
        else {
            courseNode.style.display = 'block'; //恢复隐藏的course
            utils.rewrite(course.contentOptions, options); //改写内容属性
            course.init(); //课程数据初始化
            utils.rewrite(detailCourse.contentOptions, options); //浮动层操作
            detailCourse.init();
        }

    }
}

function createCourse(container) {
    return new Course({
        container: container,
        baseLink: 'http://study.163.com/course/introduction/',
        contentOptions: {
            id: '', //这里声明的键表示要从数据中取得对应的值，否则则不会，以最小化数据量
            name: '',
            provider: '',
            learnerCount: '',
            price: '',
            bigPhotoUrl: ''
        }
    });
}


function createDetail(container) {
    var detailCourse = new Course({
        container: container,
        baseLink: 'http://study.163.com/course/introduction/',
        template: 'detailTemplate',
        contentOptions: {
            id: '', //这里声明的键表示要从数据中取得对应的值，否则则不会，以最小化数据量
            name: '',
            provider: '',
            learnerCount: '',
            bigPhotoUrl: '',
            categoryName: '',
            description: '',
        }
    });
    detailCourse.course.style.display = 'none';
    return detailCourse;
}

function bindDetail(course, detailCourse) {

    function enterEvent() {
        if (detailCourse.timeoutId === undefined) {
            course._name.style.color = '#39A030';
            detailCourse.timeoutId = setTimeout(hover, 1000);
        }
    }

    function hover() {
        detailCourse.course.style.display = 'block';
    }

    function leaveEvent() {
        if (detailCourse.timeoutId) {
            clearTimeout(detailCourse.timeoutId);
            detailCourse.timeoutId = undefined;
            detailCourse.course.style.display = 'none';
            course._name.style.color = '#333';
        }
    }
    addEvent(course.course, 'mouseenter', enterEvent);
    addEvent(course.course, 'mouseleave', leaveEvent);
};




//列表点击切换事件
function tabClick(index) {
    //更新数据状态,切换后回到初始页
    pageIndex = 0;
    typeIndex = index;
    //如果数据不存在，则发起数据请求
    if (!courseDataList[index].length) getCourse(pageIndex, pageSize, typeIndex);
    else {
        pager.click(0);
        addCourse(pageIndex, pageSize, typeIndex);
    }
}

var tab = new Tab({
    container: tabContainer,
    tabNum: 2,
    tabIndex: 0,
    tabOptions: ['产品设计', '编程语言']
});

tab.on('tabClick', tabClick);
tab.emit('tabClick', 0);


//课程数据列表
var hotContainer = $('.m-hot ul');
var hotSize = 10; //每页课程的数量
var hotIndex = 0;
var hotList = [];
var hotDataList = [];


//获取热门排行数据
function getHot() {
    //回调方法
    function hotCallback(responseText) {
        var newHotData = [].slice.call(JSON.parse(responseText));
        hotDataList = hotDataList.concat(newHotData);
        addHot(hotIndex, hotSize, 0);
    }
    get('http://study.163.com/webDev/hotcouresByCategory.htm', null, hotCallback);
}


function addHot(pageNo, psize, index) {
    var start = pageNo * psize + index;
    for (var i = 0; i < psize; i++) {
        var index = start + i;
        if (index >= hotDataList.length) index -= hotDataList.length;
        var options = hotDataList[index];
        var hot = hotList[i];
        if (!hot) { //课程不存在则添加课程
            var hot = createHot();
            hotList.push(hot);
        }
        var hotNode = hot.course;
        if (!options) hotNode.style.display = 'none'; //无数据的course暂时隐藏
        else {
            hotNode.style.display = 'block'; //恢复隐藏的course
            utils.rewrite(hot.contentOptions, options); //改写内容属性
            hot.init(); //课程数据初始化
        }
    }
}

function createHot() {
    return new Course({
        container: hotContainer,
        baseLink: 'http://study.163.com/course/introduction/',
        template: 'hotTemplate',
        contentOptions: {
            id: '',
            name: '',
            learnerCount: '',
            smallPhotoUrl: ''
        }
    });
}
getHot();

var pagerContainer = $('.m-pagerbox');



function createPager(totalNum) {
    pagerContainer.innerText = '';
    var pager = new Pager({
        container: pagerContainer,
        pageNum: totalNum,
        showNum: 8
    });
    window.pager = pager;
    pager.on('pageClick', pageClick)

    function pageClick(index) {
        //更新数据状态,切换后回到初始页
        pageIndex = index;
        //如果数据不存在，则发起数据请求
        if (courseDataList[typeIndex][index * pageSize] === undefined) getCourse(pageIndex, pageSize, typeIndex);
        else addCourse(pageIndex, pageSize, typeIndex);
    }
}

function updateHot() {
    var index = 0;
    setInterval(showNewHot, 5000);

    function showNewHot() {
        index++;
        if (index == 20) index = 0;
        addHot(0, 10, index);
    }
}
updateHot();