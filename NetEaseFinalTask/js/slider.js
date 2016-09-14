//Created by Reson-a on 2016/9/6. slider组件脚本

(function(_) {
    var sliderTemplate = '<div class="m-slider">\
        <div class="slide"></div>\
        <div class="slide"></div>\
        <div class="slide"></div>\
        </div>';

    var cursorTemplate = '<ul class="m-cursor"></ul>';

    function Slider(options) {
        if (options) _.extend(this, options);
        this.container = this.container || document.body;
        this.container.style.overflow = 'hidden';

        this.slider = this._layout.cloneNode(true); //
        this.slides = [].slice.call(this.slider.querySelectorAll('.slide'), 0);
        this.slidesNum = this.slides.length;

        this.container.appendChild(this.slider);

        this.pageNum = this.images.length; //图片总数
        this.pageIndex = this.pageIndex || 0; //当前页码

        if (this.isCursor) this._initCursor();
        if (this.isDrag) this._initDrag();
        if (this.isAutoPlay) this._initAutoPlay();

        // 拖拽相关
        this.offsetWidth = this.container.offsetWidth;
        this.breakPoint = this.offsetWidth / 4;

        this._step(0);

    };

    _.extend(Slider.prototype, _.emitter);

    _.extend(Slider.prototype, {
        _layout: _.html2node(sliderTemplate),
        //导航向指定页
        nav: function(pageIndex) {
            this.pageIndex = pageIndex;
            for (var i = 0, l = this.slidesNum; i < l; i++) {
                this.slides[i].style.transitionDuration = '0s'; //直接导航时 不播放动画
            }
            this._onNav();
        },
        prev: function() {
            this._step(-1);
        },
        next: function() {
            this._step(1);
        },
        _step: function(num) {
            this.pageIndex = this._normal(this.pageIndex + num, this.pageNum);

            for (var i = 0; i < this.slidesNum; i++) {
                if (this.slides[i].posIndex === undefined) { //动画初始化操作
                    this.slides[i].posIndex = i - 1;
                    this.slides[i].style.transitionDuration = '0s';
                } else if (!num) this.slides[i].style.transitionDuration = '.5s'; //用于拖拽回弹
                else if (this.slides[i].posIndex + num) this.slides[i].style.transitionDuration = '.5s'; //翻页时播放动画
                else this.slides[i].style.transitionDuration = '0s';

                var index = this.slides[i].posIndex - num;
                if (index < -1) index = 1;
                else if (index > 1) index = -1;
                this.slides[i].style.left = index * 100 + '%';
                this.slides[i].posIndex = index;
            }
            this._onNav();
        },

        _onNav: function() { //图片状态的更新 slider=1 对应当前图片,在nav和_step后调用
            for (var i = 0; i < this.slidesNum; i++) {
                var img = this.slides[i].querySelector('img');
                if (!img) {
                    img = document.createElement('img');
                    this.slides[i].appendChild(img);
                }
                img.src = this.images[this._normal(this.pageIndex + this.slides[i].posIndex, this.pageNum)];
            }
            if (this.isCursor) this._upDateCursor();
        },

        //处理下标的方法
        _normal: function(index, length) {
            return (index + length) % length;
        }
    });


    _.extend(Slider.prototype, {
        //初始化cursor
        _initCursor: function() {
            this.m_cursor = _.html2node(cursorTemplate);
            this.cursors = [];
            //添加前后翻页           

            for (var i = 0; i < this.pageNum; i++) {
                var cursor = document.createElement('li');
                cursor.className = 'cursor';
                this.cursors.push(cursor)
                addEvent(cursor, 'click', this.nav.bind(this, i));
                this.m_cursor.insertBefore(cursor, this.m_cursor.lastChild);
            }

            //清除选区
            addEvent(this.m_cursor, 'mousemove', this._clearSelection.bind(this));
            addEvent(this.m_cursor, 'click', this._clearSelection.bind(this));

            this.slider.appendChild(this.m_cursor);
        },

        //更新cursor状态,在onNav中调用
        _upDateCursor: function() {
            for (var i = 0; i < this.pageNum; i++) {
                if (this.pageIndex === i) _.addClass(this.cursors[i], 'z-ac');
                else _.delClass(this.cursors[i], 'z-ac');
            }
        },
        //清除选区
        _clearSelection: function() {
            if (window.getSelection) window.getSelection().removeAllRanges();
            else if (window.document.selection) window.document.selection.empty();
        }
    });

    _.extend(Slider.prototype, {
        //初始化autoPlay
        _initAutoPlay: function() {
            addEvent(this.container, 'mouseout', this.setAutoPlay.bind(this));
            addEvent(this.container, 'mouseover', this.clearAutoPlay.bind(this));
        },

        setAutoPlay: function() {
            if (!this.intervalID) this.intervalID = setInterval(this.next.bind(this), 5000);
        },

        clearAutoPlay: function() {
            if (this.intervalID) clearInterval(this.intervalID);
            this.intervalID = undefined;
        },
    });


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

    });

    //暴露到全局
    window.Slider = Slider;

}(utils));