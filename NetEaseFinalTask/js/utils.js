//Created by Reson-a on 2016/9/5. 自行封装的常用工具，主要学习和借鉴自leeluoele大神 https://github.com/leeluolee

//以下代码使用频率较高，直接暴露到全局，请注意变量名污染
function addEvent(node, event, handler) {
    if (node.addEventListener) node.addEventListener(event, handler, false);
    else node.attachEvent('on' + event, handler);
}

//全局下的类选择器，如果只有一个元素则返回该元素，
function $(selector) {
    var elements = [].slice.call(document.querySelectorAll(selector), 0);
    if (elements.length === 1) return elements[0];
    else return elements;
}

Function.prototype.bind = Function.prototype.bind || function(arg) {
    var method = this,
        obj = arguments[0],
        args = arguments.slice(1);
    return function() { method.apply(obj, args) };
};

//封装的工具，避免全局变量污染
var utils = function() {
    return {
        //添加对应类名，低版本classList.add()方法可能不兼容
        addClass: function(node, className) {
            var cur = node.className || "";
            if ((" " + cur + " ").indexOf(" " + className + " ") === -1)
                node.className = cur ? cur + " " + className : className;
        },

        //删除对应类名
        delClass: function(node, className) {
            var cur = node.className || "";
            node.className = (" " + cur + " ").replace(" " + className + " ", " ").trim();
        },

        //扩展原型的方法 mixin模式
        extend: function(o1, o2) {
            for (var i in o2) {
                if (o1[i] === undefined) o1[i] = o2[i];
            }
        },

        //添加自定义监听事件
        emitter: {
            //注册事件
            on: function(event, fn) {
                var handles = this._handles || (this.handles = {}),
                    calls = handles[event] || (handles[event] = []);
                calls.push(fn);
                return this;
            },

            //解绑事件
            off: function(event, fn) {
                if (!event || !this._handles) this._handles = {};
                var handles = this._handles,
                    calls;
                if (calls = handle[event]) { //handle[event]存在，为calls赋值并进入后续判断
                    if (!fn) {
                        handles[event] = [];
                        return this;
                    }
                    for (var i = 0, len = calls.length; i < len; i++) {
                        if (fn === calls[i]) {
                            calls.splice(i, 1);
                            return this;
                        }
                    }
                }
                return this;
            },

            //触发事件
            emit: function(event) {
                var args = [].slice.call(arguments, 1),
                    handles = this._handles,
                    call;
                if (!handles || !(calls = handles[event])) return this;
                for (var i = 0, len = calls.length; i < len; i++) {
                    calls[i].apply(this, args)
                }
                return this;
            }
        },

        //将html字符串转换成节点
        html2node: function(str) {
            var container = document.createElement('div');
            container.innerHTML = str;
            return container.children[0];
        },

        //清除选区
        clearSelection: function(event) {
            if (window.getSelection) window.getSelection().removeAllRanges();
            else if (window.document.selection) window.document.selection.empty();
        },

        //支持任意属性数值变化的动画函数，需要对属性进行额外加工，这里只实现了透明度和百分比left，
        anime: function(node, prop, targetValue, options) {
            var frameRate = options && options.frameRate ? options.frameRate : 30,
                duration = options && options.duration ? options.duration : 500,
                callback = options && options.callback ? options.callback : undefined;

            //属性相关加工和处理
            function propFactory(node, prop) {
                this.propName = prop;
                this.node = node;
                switch (prop) {
                    case 'opacity':
                        this.getValue = node.style[prop] = targetValue ? 0 : 1;
                        this.setValue = function(value) {
                            node.style[prop] = value + '';
                        }
                        return;
                    case 'left':
                        this.getValue = node.style[prop] === '' ? 0 : parseInt(node.style[prop].slice(0, -1));
                        this.setValue = function(value) {
                            node.style[prop] = value + '%';
                        }
                        return;
                }
            }

            var _prop = new propFactory(node, prop);
            var currentValue = _prop.getValue,
                offset = targetValue - currentValue,
                dir = offset > 0 ? 1 : (offset < 0 ? -1 : 0); //表示数值变化方向

            function anime() {
                currentValue = currentValue + offset * 1000 / (duration * frameRate);
                _prop.setValue(currentValue);
                if ((targetValue - currentValue) * dir <= 0) {
                    _prop.setValue(targetValue);
                    clearInterval(animeIntervalID);
                    callback && callback();
                }
            }
            var animeIntervalID = setInterval(anime, 1000 / frameRate);
        }
    }
}();