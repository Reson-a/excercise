(function($) {
    var template = '<div class="gallery-item"><img><div class="line-t"></div><div class="line-r"></div><div class="line-b"></div><div class="line-l"></div></div>';

    function Gallery(options) {
        if (options) $.extend(this, options);
        this.container = this.container || $(document.body);
        this.gallery = this._layout.clone();
        this.images = this.images || []; //图片url数组
        this.imageNum = this.images.length; //图片总数量
        this.imageIndex = this.imageIndex || 0; //初始展示图片
        this._init();
        this.container.append(this.gallery);
    }
    $.extend(Gallery.prototype, {
        _layout: $('<div class="m-gallery"></div>'),
        _init: function() {
            var that = this;
            for (var i = 0; i < this.imageNum; i++) {
                this.gallery.append(template);
            }
            this.gallery.find('img').each(function(index) {
                this.src = that.images[index];
            });
            this.gallery.on('click', 'img', function(event) {
                var className = event.target.parentNode.className;
                if (!className) return false;
                if (className.indexOf('next') >= 0) that.next();
                if (className.indexOf('prev') >= 0) that.prev();
                return false;
            });
            this.gallery.on('mousedown', function() {
                return false;
            });
            this.items = this.gallery.find('.gallery-item');
            this._onNav();
        },
        prev: function() {
            this.imageIndex = this._normalize(--this.imageIndex);
            this._onNav();
        },
        next: function() {
            this.imageIndex = this._normalize(++this.imageIndex);
            this._onNav();
        },
        _onNav: function() {
            var imageIndex = this.imageIndex;
            var that = this;
            this.items.each(function(index) {
                var _this = $(this);
                if (imageIndex === index) _this.addClass('active').removeClass('prev next out');
                else if (that._normalize(imageIndex - 1) === index) _this.addClass('prev').removeClass('active next out');
                else if (that._normalize(imageIndex + 1) === index) _this.addClass('next').removeClass('prev active out');
                else _this.addClass('out').removeClass('prev next active');
            });
        },
        _normalize: function(index) {
            return (index + this.imageNum) % this.imageNum;
        }
    });
    window.Gallery = Gallery;
}(jQuery));
/*scss部分 仅作示例用数值部分请根据图片大小进行具体调整
.m-gallery {
            width: 100%;
            height: 100%;
            perspective: 1000px;
            .gallery-item {
                position: absolute;
                text-align: center;
                transition: all ease .5s;
                cursor: pointer;
                user-select: none;
                img {
                    display: inline-block;
                }
            }
            .active {
                left: 50%;
                top: 50%;
                z-index: 2;
                transform: translate(-50%, -50%);
            }
            .next {
                left: 50%;
                top: 50%;
                z-index: 1;
                transform: translate3d(-5%, -50%, -200px) scale(0.6) rotate3d(0, 1, 0, -30deg);
            }
            .prev {
                left: 50%;
                top: 50%;
                z-index: 1;
                transform: translate3d(-95%, -50%, -200px) scale(0.6) rotate3d(0, 1, 0, 30deg);
            }
            .out {
                left: 50%;
                top: 50%;
                z-index: -1;
                transform: translate3d(-50%, -50%, 0) scale(0.6);
            }
        }
*/