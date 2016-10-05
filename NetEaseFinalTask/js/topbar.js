//topbar组件
(function (_) {

    var template = '<div class="m-topbar">\
        <p class="clearfix g-wrap">\
            <a href="#" target="_blank" class="s-link">立即查看&gt;</a>\
            <span class="f-fr">不再提醒</span>\
        </p>\
    </div>';

    function Topbar(options) {
        if (options) _.extend(this, options);
        //获取相关节点
        this.container = this.container || document.body;
        this.topbar = this._layout.cloneNode(true);

        //为自定义内容提供默认值
        this.content = this.content || '';
        this.href = this.href || '#';

        this._init();

        //插入到容器最前面
        this.container.insertBefore(this.topbar, this.container.firstChild);
    }


    _.extend(Topbar.prototype, _.emitter);
    _.extend(Topbar.prototype, {
        _layout: _.html2node(template),

        //初始化操作
        _init: function () {
            //创建文本内容
            var p = this.topbar.querySelector('p'),
                textNode = document.createTextNode(this.content);
            p.insertBefore(textNode, p.firstChild);

            //设置链接
            var a = this.topbar.querySelector('a');
            a.href = this.href;

            //添加事件监听
            var ignore = this.topbar.querySelector('span');
            addEvent(ignore, 'click', this._ignore.bind(this));
        },

        //点击不在提醒触发事件，支持注册自定义事件，如设置cookie
        _ignore: function () {
            this.emit('ignore');
            this.hide();
        },

        //隐藏topbar
        hide: function () {
            this.topbar.style.display = 'none';
        }
    });

    //暴露到全局
    window.Topbar = Topbar;
} (utils));