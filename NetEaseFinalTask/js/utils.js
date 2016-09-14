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
        }
    }
}();