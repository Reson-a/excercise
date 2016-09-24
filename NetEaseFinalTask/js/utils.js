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


/*/XHR兼容
window.XMLHttpRequest = window.XMLHttpRequest || function () {
    var version = [
        "MSXML2.XMLHttp.6.0",
        "MSXML2.XMLHttp.3.0",
        "MSXML2.XMLHttp"
    ];
    for (var i = 0; version.length; i++) {
        try {
            return new ActiveXObject(version[i]);
        } catch (e) { }
    }
    throw new Error("您的系统或浏览器不支持XHR对象！");
}*/

//ajax get方法
function get(url, options, callback) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.onreadystatechange = function(event) {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) callback(xhr.responseText);
            else alert('Request was unsuccessful:' + xhr.status);
        }
    }
    xhr.open('get', url + '?' + serialize(options), true);
    xhr.send(null);
}

//ajax post方法
function post(url, options, callback) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.onreadystatechange = function(event) {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) callback(xhr.responseText);
            else alert('Request was unsuccessful:' + xhr.status);
        }
    }
    xhr.open('post', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(serialize(options));
}


//字符串序列化
function serialize(data) {
    if (!data) return '';
    var arr = [];
    for (var name in data) {
        if (!data.hasOwnProperty(name) || typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        arr.push(name + '=' + value);
    }
    return arr.join('&');
}

//设置Cookie
function setCookie(name, value, expires, path, domain, secure) {
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires)
        cookie += '; expires=' + expires.toGMTString();
    if (path)
        cookie += '; path=' + path;
    if (domain)
        cookie += '; domain=' + domain;
    if (secure)
        cookie += '; secure=' + secure;
    document.cookie = cookie;
}

//获取从当前时间算起指定天数以后的日期,用于设置Cookie
function getFutureDate(day) {
    var date = new Date();
    date.setDate((date.getDate() + day));
    return date;
}

//取得Cookie
function getCookies() {
    var cookie = {}; //新建空对象用于返回
    var all = document.cookie; //获取cookie
    if (all === '') return cookie; //如果不存在则直接返回
    var list = all.split('; '); //用分号分隔
    for (var i = 0, len = list.length; i < len; i++) {
        var item = list[i];
        var p = item.indexOf('='); //获取等号位置
        var name = item.substring(0, p); //分割出name字符串
        name = decodeURIComponent(name); //name解码
        var value = item.substring(p + 1); //分割出value字符串
        value = decodeURIComponent(value); //value解码
        cookie[name] = value; //设置为对象的属性
    }
    return cookie;
};

//删除Cookie
function removeCookie(name, path, domain) {
    document.cookie = 'name=' + name + '; path=' + path + '; domain=' + domain + '; max-age=0';
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
                var handles = this._handles || (this._handles = {}),
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
                    calls;
                if (!handles || !(calls = handles[event])) return this;
                for (var i = 0, len = calls.length; i < len; i++) {
                    calls[i].apply(this, args);
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
            var frameRate = options && options.frameRate ? options.frameRate : 30, //每秒帧数
                speed = options && options.speed, //动画播放速度,单位长度/ms
                callback = options && options.callback; //回调函数，只有动画正常播放完才会执行回调

            //属性相关加工和处理
            function propFactory(node, prop) {
                switch (prop) {
                    case 'opacity':
                        this.getValue = node.style[prop] = targetValue ? 0 : 1;
                        this.setValue = function(value) {
                            node.style[prop] = value + '';
                        }
                        return;
                    case 'left':
                        this.getValue = node.style[prop] === '' ? 0 : parseFloat(node.style[prop].slice(0, -1));
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
            node.animeIntervalID = undefined;

            function anime() {
                currentValue = currentValue + dir * speed * 1000 / frameRate;
                _prop.setValue(currentValue);
                if ((targetValue - currentValue) * dir <= 0) endAnime();
            }

            function endAnime() {
                if (node.animeIntervalID) clearInterval(node.animeIntervalID);
                _prop.setValue(targetValue);
                callback && callback();
            }

            (function startAnime() {
                if (!speed) endAnime(); //speed不存在动画直接播放至终点
                else node.animeIntervalID = setInterval(anime, 1000 / frameRate); //id注册在node上方便外部操作直接删除
            }());
        },
    }
}();