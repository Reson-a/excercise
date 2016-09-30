//Created by Reson-a on 2016/9/6. slider组件脚本
//学习借鉴自波神的slider组件,出于大作业中复用性的考虑添加对多张图片同时滑动展示的支持
//滑动及淡入淡出效果均未使用CSS3，纯js实现。兼容至IE8，默认为线性变化函数，其它效果需自行实现

(function(_) {
    var sliderTemplate = '<div class="m-slider">\
        <div class="slide"></div>\
        <div class="slide"></div>\
        <div class="slide"></div>\
        </div>';

    var cursorTemplate = '<ul class="m-cursor"><li class="cursor"></li><li class="cursor"></li><li class="cursor"></li></ul>';

    function Slider(options) {
        if (options) _.extend(this, options);
        this.container = this.container || document.body;
        this.container.style.overflow = 'hidden';

        this.pageNum = this.images.length; //图片总数
        this.showNum = this.showNum || 1; //同时展示图片数目
        this.slidesNum = this.showNum + 2; //滑动条数目，   
        this.pageIndex = this.pageIndex || (this.slidesNum % 2 ? 0 : -0.5); //初始页码，页码为偶数时第一页从-0.5开始
        this.offsetCenter = (this.slidesNum - 1) / 2; //中心偏移量，用于计算两端的index值

        this._initLayout();
        this.slider = this._layout.cloneNode(true);
        this.slides = [].concat.apply([], this.slider.querySelectorAll('.slide')); //兼容IE8的写法
        this.container.appendChild(this.slider);


        /*动画参数配置,此处为统一配置,若想控制在特定条件下播放特定动画，在调用动画函数时添加判断即可
        animeOptions:{
            animationName1:animationDuration1,//时间以毫秒为单位
            animationName2:animationDuration2,
            ...
        }*/
        this.animeOptions = this.animeOptions || { fadeOut: 500, fadeIn: 500, moveX: 500 };
        this.animeSpeed = { //计算动画播放速度
            fadeOut: this.animeOptions.fadeOut && (1 / this.animeOptions.fadeOut),
            fadeIn: this.animeOptions.fadeIn && (1 / this.animeOptions.fadeIn),
            moveX: this.animeOptions.moveX && (100 / this.showNum / this.animeOptions.moveX)
        };

        //初始化操作        
        if (this.isCursor) this._initCursor();
        if (this.isDrag) this._initDrag();
        this._initPos();
        if (this.isScroll) this._initScroll(); //滚动图
        else if (this.isAutoPlay) { //定时播放
            this.autoPlayTime = this.autoPlayTime === undefined ? 5000 : this.autoPlayTime;
            this._initAutoPlay();
        }

        //清除选区
        addEvent(this.container, 'mousemove', _.clearSelection);
    };

    _.extend(Slider.prototype, _.emitter);

    _.extend(Slider.prototype, {
        //节点初始化
        _initLayout: function() {
            this._layout = _.html2node(sliderTemplate);
            for (var i = 3, l = this.slidesNum; i < l; i++) {
                var slide = document.createElement('div');
                slide.className = 'slide';
                this._layout.appendChild(slide);
            }
        },

        //图片位置初始化
        _initPos: function() {
            this.offsetAll = 0;
            this.slider.style.left = 0 + '%';
            for (var i = 0; i < this.slidesNum; i++) {
                this.slides[i].posIndex = this.slides[i].posIndex === undefined ? i - this.offsetCenter : this.slides[i].posIndex;
                this.slides[i].style.left = (this.slides[i].posIndex + this.offsetCenter - 1) / this.showNum * 100 + '%';
            }
            this._onNav();
        },

        //单步移动 n取值为-1到1,必须在初始化后调用  
        _step: function(n) {
            //判断只有先前移动完成后才会更新数据状态
            var leftPos = parseFloat(this.slider.style.left.slice(0, -1));
            if (Math.abs(this.offsetAll / this.showNum * 100) <= Math.abs(leftPos)) {
                //更新偏移量
                this.offsetAll += n;
                //计算更新slides位置
                this._calPos(n);
                //更新页码
                this.pageIndex = this._normal(this.pageIndex + n, this.pageNum);
            }
            //容器移动
            this._moveX(this.slider, -this.offsetAll / this.showNum * 100, function(offsetAll) {
                if (offsetAll >= this.slidesNum) this._initPos(); //位置重置，避免offsetAll数值过大
                if (this.isScroll) this.startScroll(); //若为滚动图则在回调中前进到下一页
                this._onNav(true); //更新图片状态
            }.bind(this, this.offsetAll));
        },

        //计算更新slides位置
        _calPos: function(n) {
            for (var i = 0; i < this.slidesNum; i++) {
                if (this.slides[i].posIndex === -n * this.offsetCenter) { //与容器移动方向相同的末端的某个slider移动到另一末端
                    this.slides[i].posIndex = n * this.offsetCenter;
                    this.slides[i].style.left = (this.offsetAll + n * this.offsetCenter + this.offsetCenter - 1) / this.showNum * 100 + '%';
                } else this.slides[i].posIndex -= n; //重新计算posIndex,便于计算图片和状态重置
            }
        },

        //导航向指定页
        nav: function(index) {
            this.pageIndex = index;
            this._onNav(true);
        },

        //向前一页
        prev: function() {
            this._step(-1);
        },

        //向后一页
        next: function() {
            this._step(1);
        },

        //淡出动画
        _fadeOut: function(node, callback) {
            _.anime(node, 'opacity', 0, { 'speed': this.animeSpeed.fadeOut, 'callback': callback });
        },

        //淡入动画
        _fadeIn: function(node, callback) {
            _.anime(node, 'opacity', 1, { 'speed': this.animeSpeed.fadeIn, 'callback': callback });
        },

        //水平方向单位平移动画
        _moveX: function(node, targetX, callback) {
            _.anime(node, 'left', targetX, { 'speed': this.animeSpeed.moveX, 'callback': callback });
        },

        //图片状态的更新,isFade表示播放淡入淡出效果
        _onNav: function(isFade) {
            for (var i = 0; i < this.slidesNum; i++) {
                var img = this.slides[i].querySelector('img'),
                    imgIndex = this._normal(this.pageIndex + this.slides[i].posIndex, this.pageNum),
                    newSrc = this.images[imgIndex],
                    a = img && img.parentNode,
                    href = this.links && this.links[imgIndex];

                if (!a && this.links) { //链接初始化
                    a = document.createElement('a');
                    a.target = "_blank";
                    this.slides[i].appendChild(a);
                }
                if (!img) { //图片初始化
                    img = document.createElement('img');
                    if (this.links) a.appendChild(img);
                    else this.slides[i].appendChild(img);
                }
                //播放淡入淡出效果,否则直接执行callback
                if (isFade) this._fadeOut(img, outCallBack.bind(this, img, newSrc, a, href));
                else outCallBack.call(this, img, newSrc, a, href);
            }
            //淡出回调方法中更新图片
            function outCallBack(img, src, a, href) {
                img.src = src;
                if (a) a.href = href;
                this._fadeIn(img);
            }
            //更新cursor
            if (this.isCursor) this._upDateCursor();
        },

        //标准化下标的方法
        _normal: function(index, length) {
            return (index + length) % length;
        }
    });


    //cursor
    _.extend(Slider.prototype, {
        //初始化cursor
        _initCursor: function() {
            this.m_cursor = _.html2node(cursorTemplate);
            this.cursors = [].concat.apply([], this.m_cursor.querySelectorAll('.cursor'));
            //数量超过3，在模板基础上继续添加cursor
            for (var i = 0; i < this.pageNum; i++) {
                if (i > 3) {
                    var cursor = document.createElement('li');
                    cursor.className = 'cursor';
                    this.cursors.push(cursor);
                    this.m_cursor.appendChild(cursor);
                }
                addEvent(this.cursors[i], 'click', this.nav.bind(this, i));
            }

            this.container.appendChild(this.m_cursor);
        },

        //更新cursor状态,在onNav中调用
        _upDateCursor: function() {
            for (var i = 0; i < this.slidesNum; i++) {
                if (this.pageIndex === i) _.addClass(this.cursors[i], 'z-ac');
                else _.delClass(this.cursors[i], 'z-ac');
            }
        }
    });

    //自动播放
    _.extend(Slider.prototype, {
        //自动轮播初始化
        _initAutoPlay: function() {
            addEvent(this.container, 'mouseout', this.setAutoPlay.bind(this));
            addEvent(this.container, 'mouseover', this.clearAutoPlay.bind(this));
            this.setAutoPlay();
        },
        //设置自动轮播
        setAutoPlay: function() {
            this.clearAutoPlay();
            this.intervalID = setInterval(this.next.bind(this), this.autoPlayTime);
        },
        //清除自动轮播
        clearAutoPlay: function() {
            if (this.intervalID) clearInterval(this.intervalID);
        }
    });


    //滚动播放模式
    _.extend(Slider.prototype, {
        //滚动初始化
        _initScroll: function() {
            addEvent(this.container, 'mouseout', this.startScroll.bind(this));
            addEvent(this.container, 'mouseover', this.stopScroll.bind(this));
            this.startScroll();
        },
        //开始滚动
        startScroll: function() {
            this.stopScroll();
            this.next();
        },
        //停止滚动
        stopScroll: function() {
            if (this.slider.animeIntervalID) {
                clearInterval(this.slider.animeIntervalID);
                this.slider.animeIntervalID = undefined;
            }
        }
    });

    //暴露到全局
    window.Slider = Slider;

}(utils));