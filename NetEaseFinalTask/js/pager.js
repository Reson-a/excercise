//pager组件,考虑到不同情况下psize的变化，并且pageNum数量可能比较大，pager均为动态创建,只创建当前显示的page
(function(_) {

    var template = '<ul class="m-pager">\
                       <li class="prev">&lt;</li><li class="page"></li><li class="page"></li><li class="next">&gt;</li>\
                    </ul>';

    function Pager(options) {
        if (options) _.extend(this, options);
        //选择相关节点
        this.container = this.container || document.body;
        this.pager = this._layout.cloneNode(true);
        this.pages = [].concat.apply([], this.pager.querySelectorAll('.page'));
        this.prev = this.pager.querySelector('.prev');
        this.next = this.pager.querySelector('.next');

        this.pageNum = this.pageNum || 2; //page数目,默认为2
        this.showNum = this.showNum || 1; //展示page数目,默认为1
        //当前选中的page,处理越界情况
        this.pageIndex = this.pageIndex > this.pageNum - 1 ? this.pageNum - 1 : (this.pageIndex < 0 ? 0 : this.pageIndex);
        //处理起始index，保证始终显示showNum个page
        this.startIndex = this.pageIndex > this.pageNum - this.showNum ? this.pageNum - this.showNum : this.pageIndex;

        this._init();
        this.container.appendChild(this.pager);

    }
    _.extend(Pager.prototype, _.emitter);
    _.extend(Pager.prototype, {
        //模板转换为节点
        _layout: _.html2node(template),

        //初始化方法
        _init: function() {
            for (var i = 0; i < this.showNum; i++) {
                var index = this.startIndex + i;
                //showNum>2时，创建其余的切换项
                if (i >= 2) {
                    var page = document.createElement('li');
                    _.addClass(page, 'page');
                    this.pager.insertBefore(page, this.next);
                    this.pages.push(page);
                }
                //添加pager名称
                this.pages[i].innerText = index + 1;
                //绑定点击事件
                addEvent(this.pages[i], 'click', this._click.bind(this, index));
            }
            addEvent(this.prev, 'click', this._prev.bind(this));
            addEvent(this.next, 'click', this._next.bind(this));

            //清除选区
            addEvent(this.container, 'mousemove', _.clearSelection);

            //初始化点击状态
            this._click(this.pageIndex);
        },

        //上一页
        _prev: function() {
            this._click(this.pageIndex - 1);
        },

        //下一页
        _next: function() {
            this._click(this.pageIndex + 1);
        },

        //点击事件
        _click: function(index) {
            if (index < 0 || index >= this.pageNum) return; //处理边界情况
            this.pageIndex = index;

            //触发自定义事件
            this.emit('pageClick', index);

            //更新激活状态
            for (var i = 0; i < this.showNum; i++) {
                if (index === this.startIndex + i) _.addClass(this.pages[i], 'z-ac');
                else _.delClass(this.pages[i], 'z-ac');
            }
        }
    });

    //暴露到全局
    window.Pager = Pager;

}(utils));