(function(_) {
    var template = '<ul class="m-pager">\
                       <li class="prev">&lt;</li><li class="page">1</li><li class="page">2</li><li class="next">&gt;</li>\
                    </ul>';

    function Pager(options) {
        if (options) _.extend(this, options);

        this.pager = this._layout.cloneNode(true);
        this.pages = [].slice.call(this.pager.querySelectorAll('.page'), 0);
        this.prev = this.pager.querySelector('.prev');
        this.next = this.pager.querySelector('.next');


        this.container = this.container || document.body;
        this.pageNum = this.pageNum || 2; //page数目,最少为2
        this.showNum = this.showNum || 1; //展示page数目,最少为1
        this.pageIndex = this.pageIndex || 0; //初始为选中状态的page

        this._init();
        this.container.appendChild(this.pager);

    };
    _.extend(Pager.prototype, _.emitter);
    _.extend(Pager.prototype, {
        //模板转换为节点
        _layout: _.html2node(template),

        //初始化方法
        _init: function() {
            for (var i = 0; i < this.pageNum; i++) {
                //pageNum>2时，创建其余的切换项
                if (i >= 2) {
                    var page = document.createElement('li');
                    _.addClass(page, 'page');
                    this.pager.insertBefore(page, this.next);
                    this.pages.push(page);
                }
                if (i >= this.showNum) this.pages[i].style.display = 'none';
                //添加pager名称
                this.pages[i].innerText = i + 1;
                //绑定点击事件
                addEvent(this.pages[i], 'click', this.click.bind(this, i));
            }
            addEvent(this.prev, 'click', this._prev.bind(this));
            addEvent(this.next, 'click', this._next.bind(this));

            //清除选区
            addEvent(this.container, 'mousemove', _.clearSelection);

            //初始化点击状态
            this.click(this.pageIndex);
        },
        _prev: function() {
            this.click(this.pageIndex - 1);
        },
        _next: function() {
            this.click(this.pageIndex + 1);
        },
        //点击事件
        click: function(index) {
            if (index < 0 || index >= this.pageNum) return;
            this.pageIndex = index;
            this.emit('pageClick', index);
            for (var i = 0; i < this.pageNum; i++) {
                if (index === i) _.addClass(this.pages[i], 'z-ac');
                else _.delClass(this.pages[i], 'z-ac');
                if (i >= index && i < index + this.showNum || i >= this.pageNum - this.showNum && index >= this.pageNum - this.showNum)
                    this.pages[i].style.display = 'inline-block';
                else this.pages[i].style.display = 'none';
            }
        }
    });

    //暴露到全局
    window.Pager = Pager;

}(utils))