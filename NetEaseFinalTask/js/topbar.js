//Created by Reson-a on 2016/9/16. topbar组件脚本

(function(_) {

    var template = '<div class="m-topbar">\
        <p class="clearfix g-wrap">\
            <a href="#" target="_blank" class="s-link">立即查看&gt;</a>\
            <span class="f-fr">不再提醒</span>\
        </p>\
    </div>'

    function Topbar(options) {
        if (options) _.extend(this, options);
        this.container = this.container || document.body;

        this.topbar = this._layout.cloneNode(true);
        this.content = this.content || '';
        this.href = this.href || '#';

        this.container.insertBefore(this.topbar, this.container.firstChild);
        this._init();

    }
    _.extend(Topbar.prototype, _.emitter);
    _.extend(Topbar.prototype, {
        _layout: _.html2node(template),
        _init: function() {
            var p = this.container.querySelector('p'),
                textNode = document.createTextNode(this.content);
            p.insertBefore(textNode, p.firstChild);
            var a = this.container.querySelector('a');
            a.href = this.href;
            var ignore = this.container.querySelector('span');
            addEvent(ignore, 'click', this._ignore.bind(this));
        },
        _ignore: function() {
            this.emit('ignore');
            this.hide();
        },
        hide: function() {
            this.topbar.style.display = 'none';
        }
    });

    window.Topbar = Topbar;
}(utils))