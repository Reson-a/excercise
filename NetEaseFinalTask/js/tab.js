(function(_) {
    var template = '<ul class="m-tab">\
                        <li class="tab"></li><li> class="tab"</li>\
                    </ul>';

    function Tab(options) {
        if (options) _.extend(this, options);

        this.tab = this._layout.cloneNode(true);
        this.tabItems = this.tab.querySelectorAll('li');

        this.container = this.container || document.body;
        this.tabNum = this.tabNum || 2; //tab数目
        this.tabIndex = this.tabIndex || 0; //初始为选中状态的tab
        this.tabOptions = this.tabOptions || ['tab1', 'tab2'];

        this._init();
        this.container.appendChild(this.tab);

    };
    _.extend(Tab.prototype, _.emitter);
    _.extend(Tab.prototype, {
        //模板转换为节点
        _layout: _.html2node(template),

        //初始化方法
        _init: function() {
            for (var i = 0; i < this.tabNum; i++) {
                //tabNum>2时，创建其余的切换项
                if (i >= 2) {
                    var tabItem = document.createElement('li');
                    _.addClass(tabItem, 'tab');
                    this.tab.appendChild(tabItem);
                    this.tabItems.push(tabItecm);
                }
                //添加tab名称
                this.tabItems[i].innerText = this.tabOptions[i];
                //绑定点击事件
                addEvent(this.tabItems[i], 'click', this._click.bind(this, i));
            }
            //清除选区
            addEvent(this.container, 'mousemove', _.clearSelection);

            //初始化点击状态
            this._click(this.tabIndex);
        },

        //点击事件
        _click: function(index) {
            this.emit('tabClick', index);
            for (var i = 0; i < this.tabNum; i++) {
                if (index === i) _.addClass(this.tabItems[i], 'z-ac');
                else _.delClass(this.tabItems[i], 'z-ac');
            }
        }
    });

    //暴露到全局
    window.Tab = Tab;

}(utils))