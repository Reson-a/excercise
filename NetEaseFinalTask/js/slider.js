//Created by Reson-a on 2016/9/6. slider组件脚本
//学习借鉴自波神的slider组件,出于大作业中复用性的考虑添加对多张图片同时滑动展示的支持
//滑动及淡入淡出效果均未使用CSS3，纯js实现。兼容至IE8，默认为线性变化函数，其它效果需自行实现

(function(_) {
    var sliderTemplate = '<div class="m-slider">\
        <div class="slide"></div>\
        <div class="slide"></div>\
        <div class="slide"></div>\
        </div>';

    var cursorTemplate = '<ul class="m-cursor"><li class="cursor"><li class="cursor"><li class="cursor"></ul>';

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
        this.slides = [].slice.call(this.slider.querySelectorAll('.slide'), 0);

        this.container.appendChild(this.slider);

        //相关功能初始化        
        if (this.isCursor) this._initCursor();
        if (this.isDrag) this._initDrag();
        if (this.isAutoPlay) {
            this.autoPlayTime = this.autoPlayTime === undefined ? 5000 : this.autoPlayTime;
            this._initAutoPlay();
        }
        this.animeDuration = this.animeDuration === undefined ? 500 : this.animeDuration;

        // 拖拽相关配置
        this.offsetWidth = this.container.offsetWidth;
        this.breakPoint = this.offsetWidth / 4;

        //位置初始化
        this._initPos();

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
            this.offsetAll += n;
            this.sliderIndex = this._normal();
            for (var i = 0; i < this.slidesNum; i++) {
                if (this.slides[i].posIndex === -n * this.offsetCenter) { //与容器移动方向相同的末端的slider移动到另一末端
                    this.slides[i].posIndex = n * this.offsetCenter;
                    this.slides[i].style.left = (this.offsetAll + n * this.offsetCenter + this.offsetCenter - 1) / this.showNum * 100 + '%';
                } else this.slides[i].posIndex -= n; //重新计算posIndex,便于计算图片和状态重置
            }
            this.pageIndex = this._normal(this.pageIndex + n, this.pageNum);

            //容器移动
            this._moveX(this.slider, -this.offsetAll / this.showNum * 100, function() {
                if (!(this.offsetAll % this.slidesNum)) { //位置重置，避免offsetAll数值过大
                    this._initPos();
                }
            }.bind(this));

            //更新图片状态
            this._onNav();
        },

        //导航向指定页
        nav: function(index) {
            this.pageIndex = index;
            this._onNav(true); //淡入淡出动画
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
            _.anime(node, 'opacity', 0, { duration: this.animeDuration / 2, 'callback': callback });
        },

        //淡入动画
        _fadeIn: function(node, callback) {
            _.anime(node, 'opacity', 1, { duration: this.animeDuration / 2, 'callback': callback });
        },

        //平移动画
        _moveX: function(node, targetX, callback) {
            _.anime(node, 'left', targetX, { duration: this.animeDuration, 'callback': callback });
        },

        //图片状态的更新，isFade表示有淡入淡出效果
        _onNav: function(isFade) {
            for (var i = 0; i < this.slidesNum; i++) {
                var img = this.slides[i].querySelector('img'),
                    imgIndex = this._normal(this.pageIndex + this.slides[i].posIndex, this.pageNum),
                    newSrc = this.images[imgIndex];
                if (!img) { //初始化图片加载
                    img = document.createElement('img');
                    this.slides[i].appendChild(img);
                }
                if (isFade && this.slides[i].posIndex === 0) { //当前图片发生改变，添加淡入淡出效果
                    this._fadeOut(img, function(img, src) {
                        img.src = src;
                        this._fadeIn(img);
                    }.bind(this, img, newSrc))
                } else {
                    img.src = newSrc;
                }
            }
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
            this.cursors = [].slice.call(this.m_cursor.querySelectorAll('.cursor'), 0);

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
        },


    });

    //自动播放
    _.extend(Slider.prototype, {
        //初始化autoPlay
        _initAutoPlay: function() {
            addEvent(this.container, 'mouseout', this.setAutoPlay.bind(this));
            addEvent(this.container, 'mouseover', this.clearAutoPlay.bind(this));
            this.setAutoPlay();
        },

        setAutoPlay: function() {
            if (this.intervalID === undefined) this.intervalID = setInterval(this.next.bind(this), this.autoPlayTime);
        },

        clearAutoPlay: function() {
            if (this.intervalID) clearInterval(this.intervalID);
            this.intervalID = undefined;
        },
    });

    /*/拖拽
    _.extend(Slider.prototype, {
        //初始化拖拽
        _initDrag: function() {
            this.dragInfo = {};
            for (var i = 0; i < this.slidesNum; i++) {
                this.slides[i].style.transitionDuration = '0s';
            }
            addEvent(this.slider, 'mousedown', this._dragStart.bind(this));
            addEvent(this.slider, 'mousemove', this._dragMove.bind(this));
            addEvent(this.slider, 'mouseup', this._dragEnd.bind(this));
            addEvent(this.slider, 'mouseleave', this._dragEnd.bind(this));
        },

        _dragStart: function(event) {
            this.dragInfo.start = { x: event.pageX };
            event.preventDefault();
            return false;
        },

        _dragMove: function(event) {
            if (!this.dragInfo.start) return;
            event.preventDefault();
            this._clearSelection();

            this.offsetX = event.pageX - this.dragInfo.start.x;

            for (var i = 0; i < this.slidesNum; i++) {
                this.slides[i].style.transitionDuration = '0s';
                this.slides[i].style.left = (this.slides[i].posIndex + this.offsetX / this.slides[i].firstChild.width) * 100 + '%';
            }
            return false;
        },

        _dragEnd: function(event) {
            if (!this.dragInfo.start) return;
            this.dragInfo = {};
            event.preventDefault();

            if (this.offsetX > this.breakPoint) this._step(-1);
            else if (this.offsetX < -this.breakPoint) this._step(1);
            else this._step(0);
            return false;
        }

    });*/

    //暴露到全局
    window.Slider = Slider;

}(utils));