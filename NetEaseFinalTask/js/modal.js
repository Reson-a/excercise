//基础弹窗组件，具体实现请添加相应扩展
(function(_) {

    var template = '<div class="m-mask">\
                        <div class="g-align"></div>\
                        <div class="g-align modal">\
                            <span class="close">×</span>\
                            <h2></h2>\
                        </div>\
                    </div>';

    function Modal(options) {
        if (options) _.extend(this, options);

        //为自定义内容提供默认值
        this.titleName = this.titleName || '弹窗';
        this.modalClassName = this.modalClassName || "m-modal"; //支持一个自定义的modal类名，便于样式设置

        this._init();

        //添加到文档中
        document.body.appendChild(this.container);
    }

    _.extend(Modal.prototype, _.emmiter);

    //扩展原型
    _.extend(Modal.prototype, {

        //模板转换为节点
        _layout: _.html2node(template),

        //初始化操作,请在设置自定义内容之后，添加自定义扩展前调用
        _init: function() {
            //获取相关节点
            this.container = this._layout.cloneNode(true);
            this.modal = this.container.querySelector('.modal');
            this.close = this.modal.querySelector('.close');
            this.title = this.modal.querySelector('h2');

            //设置相关属性
            this.title.innerText = this.titleName;
            this._setContent(this.content);
            _.addClass(this.modal, this.modalClassName);

            //添加事件监听
            addEvent(this.close, 'click', this._close.bind(this));
        },

        //设置modal内容
        _setContent: function(content) {
            if (!content) return;

            //支持DOM节点和字符串作为内容
            if (content.nodeType !== 1) content = document.createTextNode(content);
            this.modal.appendChild(content);
        },

        //关闭modal
        _close: function() {
            document.body.removeChild(this.container);
        }
    });

    //暴露至全局
    window.Modal = Modal;
}(utils));