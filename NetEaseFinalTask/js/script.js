//加载顶部通知条
(function(cookie) {
    if (!cookie.getCookies().topbar) {
        var topbar = new Topbar({
            content: '网易云课堂微专业，帮助你掌握专业技能，令你求职或加薪多一份独特优势！',
            href: "http://study.163.com/smartSpec/intro.htm#/smartSpecIntro"
        });

        //注册自定义事件。关闭通知条同时设置cookie
        topbar.on('ignore', function() {
            cookie.setCookie('topbar', true, cookie.getFutureDate(7)); //设置cookie 7天后过期
        });
    }
}(utils.cookie));



//关注及登录模块
(function(cookie, ajax) {
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

    //发起关注请求
    function follow() {
        ajax.get('https://study.163.com/webDev/attention.htm', null, followCallback);
        //关注成功回调
        function followCallback(responseText) {
            if (responseText == 1) {
                cookie.setCookie('followSuc', true, cookie.getFutureDate(7));
                hasFollowed();
            } else alert('关注失败，请重新尝试');
        }
    }

    //登录功能
    function createLogin() {
        //创建登录弹窗
        var loginModal = new LoginModal({
            action: 'https://study.163.com/webDev/login.htm',
            method: 'get',
            titleName: '登录网易云课堂',
            placeholder: { userName: '账号', password: '密码' },
            sucCallback: loginCallback //回调函数
        });
        //登录成功回调
        function loginCallback() {
            cookie.setCookie('loginSuc', true, cookie.getFutureDate(7));
            follow();
        }
        return loginModal;
    }

    //添加点击事件
    addEvent(followBtn, 'click', function() {
        if (!cookie.getCookies().loginSuc) createLogin();
        else follow();
    });

    addEvent(unfollow, 'click', function() {
        cookie.removeCookie('followSuc');
        notFollowed();
    });

    //状态初始化
    if (cookie.getCookies().followSuc) hasFollowed();
    else notFollowed();
}(utils.cookie, utils.ajax));



//轮播图模块
(function() {
    var sliderContainer = $('.m-sliderbox');
    var slider = new Slider({
        container: sliderContainer,
        images: ['img/banner1.jpg', 'img/banner2.jpg', 'img/banner3.jpg'],
        links: ['http://open.163.com/', 'http://study.163.com/', 'http://www.icourse163.org/'],
        isCursor: true,
        isAutoPlay: true,
        animeOptions: { fadeIn: 500 }
    });
}());



//滚动图模块，图片展示数量为5，与slider复用同一组件
(function() {
    var scrollContainer = $('.m-scrollbox');
    var scroll = new Slider({
        container: scrollContainer,
        showNum: 5,
        images: ['img/workplace1.jpg', 'img/workplace2.jpg', 'img/workplace3.jpg', 'img/workplace4.jpg', 'img/workplace5.jpg'],
        isScroll: true,
        animeOptions: { moveX: 10000 }
    });
}());



//视频弹窗模块
(function(_) {
    var videoTrigger = $('#video-trigger');
    addEvent(videoTrigger, 'click', createVideo);
    var template = '<video src="http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4" poster="img/video.jpg" \
            controls preload="auto">您的浏览器不支持H5视频</video>';

    function createVideo() {
        return new Modal({
            titleName: '请观看下面的视频',
            modalClassName: 'm-video',
            content: _.html2node(template)
        });
    }
}(utils));



//课程模块
(function(ajax) {
    var tabContainer = $('.m-tabbox');
    var courseContainer = $('.m-coursebox ul');
    var pagerContainer = $('.m-pagerbox');
    var pageSize = 15; //每页课程的数量
    var pageMaxSize = 20; //每页课程的最大数量
    var typeList = ['10', '20']; //产品设计类型为10 编程语言20
    var typeIndex = 0; //初始状态为产品设计
    var pageIndex = 0; //当前页码
    var courseList = []; //课程列表
    var detailCourseList = []; //课程详细信息列表
    var tab = null; //tab切换
    var pager = null; //分页器

    //获取课程数据，每次点击时触发，防止一次性请求数据量过大
    function getCourse(pageNo, psize, typeIndex) {
        //回调方法
        function courseCallback(responseText) {
            var data = JSON.parse(responseText);
            var newCourseData = [].slice.call(data.list);
            addCourse(pageNo, pageSize, typeIndex, newCourseData);
            pager = createPager(pageNo, data.totalPage);
        }
        ajax.get('https://study.163.com/webDev/couresByCategory.htm', {
            pageNo: pageNo + 1,
            psize: psize,
            type: typeList[typeIndex]
        }, courseCallback);
    }

    //添加课程的方法
    function addCourse(pageNo, psize, typeIndex, data) {
        for (var i = 0; i < pageMaxSize; i++) {
            var options = data[i];
            var course = courseList[i];
            var detailCourse = detailCourseList[i];
            if (!course) { //课程不存在则添加课程
                course = createCourse(courseContainer);
                detailCourse = createDetail(course.course);
                bindDetail(course, detailCourse);
                courseList.push(course);
                detailCourseList.push(detailCourse);
            }
            var courseNode = course.course; //course的对应节点
            if (!options) courseNode.style.display = 'none'; //无数据的course暂时隐藏
            else {
                courseNode.style.display = 'block'; //恢复隐藏的course
                course.update(options); //更新课程数据
                detailCourse.update(options);
            }
        }
    }

    //创建课程
    function createCourse(container) {
        return new Course({
            container: container,
            //这里声明的键表示该属性值存在并会从json中数据取值，否则不会
            contentOptions: { id: '', name: '', provider: '', learnerCount: '', price: '', bigPhotoUrl: '' }
        });
    }

    //创建课程详细信息浮层
    function createDetail(container) {
        var detailCourse = new Course({
            container: container,
            template: 'detailTemplate',
            contentOptions: { id: '', name: '', provider: '', learnerCount: '', bigPhotoUrl: '', categoryName: '', description: '', }
        });
        detailCourse.course.style.display = 'none';
        return detailCourse;
    }

    //绑定浮层事件
    function bindDetail(course, detailCourse) {
        //鼠标悬停1s后出现浮层
        function enterEvent() {
            if (detailCourse.timeoutId === undefined) {
                course._name.style.color = '#39A030';
                detailCourse.timeoutId = setTimeout(function() {
                    detailCourse.course.style.display = 'block';
                }, 1000);
            }
        }

        //鼠标离开后浮层消失
        function leaveEvent() {
            if (detailCourse.timeoutId) {
                clearTimeout(detailCourse.timeoutId);
                detailCourse.timeoutId = undefined;
                detailCourse.course.style.display = 'none';
                course._name.style.color = '#333';
            }
        }
        //添加事件监听
        addEvent(course.course, 'mouseenter', enterEvent);
        addEvent(course.course, 'mouseleave', leaveEvent);
    }

    //创建tab
    function createTab() {
        var tab = new Tab({
            container: tabContainer,
            tabNum: 2,
            tabIndex: 0,
            tabOptions: ['产品设计', '编程语言']
        });
        tab.on('tabClick', tabClick);
        return tab;
    }

    //tab点击切换事件
    function tabClick(index) {
        pageIndex = 0;
        typeIndex = index;
        getCourse(pageIndex, pageSize, typeIndex);
    }

    //创建分页器
    function createPager(pageIndex, totalNum) {
        pagerContainer.innerText = '';
        var pager = new Pager({
            container: pagerContainer,
            pageIndex: pageIndex,
            pageNum: totalNum,
            showNum: 8
        });
        pager.on('pageClick', pageClick);
        return pager;
    }

    //分页器点击事件
    function pageClick(index) {
        pageIndex = index;
        //考虑到作业中响应式的需求，每次点击所需要的size是不确定的，不同pageIndex情况下抓取数据的情况比较复杂，因此在这里统一发送请求
        getCourse(pageIndex, pageSize, typeIndex);
    }

    //获取样式表
    var mediaStyle = $('#media-style');
    //检测布局是否发生改变
    function checkSize() {
        var changed = false;
        //使用innerwidth配合媒体查询，与@media中查询值相等,如果不存在则采用clientWidth模拟（有些许误差）
        var checkWidth = window.innerWidth || document.documentElement.clientWidth;
        if (parseFloat(checkWidth) >= 1205) {
            if (pageSize == 15) changed = true;
            if (mediaStyle) mediaStyle.href = '';
            pageSize = 20;
        } else {
            if (pageSize == 20) changed = true;
            if (mediaStyle) mediaStyle.href = 'css/mediaStyle.css';
            pageSize = 15;
        }
        return changed;
    }

    //初始化操作
    checkSize();
    tab = createTab();
    tab.emit('tabClick', 0);

    //监听resize事件实现响应布局
    window.onresize = function() {
        if (checkSize()) { //通过boolean值判断以实现函数节流，避免无意义的getCourse执行
            getCourse(pageIndex, pageSize, typeIndex);
        }
    };
}(utils.ajax));



//热门排行模块
(function(ajax) {
    var hotContainer = $('.m-hot ul');
    var hotSize = 10; //每页课程的数量
    var hotIndex = 0;
    var hotList = [];
    var hotDataList = [];


    //获取热门排行数据
    function getHot() {
        //回调方法
        function hotCallback(responseText) {
            hotDataList = [].slice.call(JSON.parse(responseText));
            addHot(hotIndex, hotSize, 0, hotDataList);
        }
        ajax.get('https://study.163.com/webDev/hotcouresByCategory.htm', null, hotCallback);
    }

    //添加热门排行
    function addHot(pageNo, psize, startIndex, data) {
        for (var i = 0; i < psize; i++) {
            var index = startIndex + i;
            if (index >= data.length) index -= data.length;
            var options = data[index];
            var hot = hotList[i];
            if (!hot) { //课程不存在则添加课程
                hot = createHot();
                hotList.push(hot);
            }
            var hotNode = hot.course;
            if (!options) hotNode.style.display = 'none'; //无数据的course暂时隐藏
            else {
                hotNode.style.display = 'block'; //恢复隐藏的course
                hot.update(options); //课程数据更新
            }
        }
    }

    //创建热门
    function createHot() {
        return new Course({
            container: hotContainer,
            template: 'hotTemplate',
            contentOptions: { id: '', name: '', learnerCount: '', smallPhotoUrl: '' }
        });
    }

    //更新热门数据
    function updateHot() {
        var index = 0;

        //每隔5s更新热门课程数据
        function showNewHot() {
            index++;
            if (index == 20) index = 0;
            addHot(0, 10, index, hotDataList);
        }

        setInterval(showNewHot, 5000);
    }

    //初始化操作
    getHot();
    updateHot();
}(utils.ajax));