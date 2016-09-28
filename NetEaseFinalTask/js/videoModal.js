(function(_) {
    var template = '<div class="f-mask">\
        <div class="g-align"></div>\
        <div class="g-align m-video">\
            <span id="video-close">×</span>\
            <h2></h2>\
            <video>您的浏览器不支持H5视频</video>\
        </div>\
    </div>';

    function VideoModal(options) {
        if (options) _.extend(this, options);
        this.container = this.container || document.body;

        this.videoModal = this._layout.cloneNode(true);
        this.video = this.videoModal.querySelector('video');
        this.close = this.videoModal.querySelector('#video-close');
        this.title = this.videoModal.querySelector('h2');
        this.titleName = this.titleName || '请观看下面的视频';

        this._init();
        this.container.appendChild(this.videoModal);
    }
    _.extend(VideoModal.prototype, _.emitter);
    _.extend(VideoModal.prototype, {
        //模板转换为节点
        _layout: _.html2node(template),

        //初始化操作
        _init: function() {
            this.title.innerText = this.titleName;
            if (!this.src) return;
            this.video.src = this.src;
            if (this.poster) this.video.poster = this.poster;
            if (this.controls) this.video.controls = "controls";
            if (this.autoPlay) this.video.autoPlay = "autoPlay";
            else if (this.preload) this.video.preload = this.preload;
            if (this.loop) this.video.loop = "loop";

            addEvent(this.close, 'click', this._close.bind(this));
        },
        //关闭登录Modal
        _close: function() {
            this.container.removeChild(this.videoModal);
        }
    });


    //暴露至全局
    window.VideoModal = VideoModal;
}(utils))