//工具类，其中高使用频率和兼容的方法直接暴露到全局
//添加事件监听兼容方法
function addEvent(node, event, handler) {
    if (node.addEventListener) node.addEventListener(event, handler, false);
    else node.attachEvent('on' + event, handler);
}

//选择单个节点
function $(selector) {
    return document.querySelector(selector);
}
//选择节点集合，并返回数组
function $$(selector) {
    return [].concat.apply([], document.querySelectorAll(selector)); //兼容IE8的写法 slice.call方法不兼容
}

//数组slice方法兼容
Array.prototype.slice = Array.prototype.slice || function(start, end) {
    var l = this.length,
        result = [];
    if (start < 0) start += l;
    if (end && end < 0) end += l;
    else end = l;
    for (var i = start; i < end; i++) {
        result.push(this[i]);
    }
    return result;
};

//函数bind方法兼容
Function.prototype.bind = Function.prototype.bind || function() {
    var method = this,
        obj = arguments[0],
        args = [].slice.call(arguments, 1);
    return function() {
        method.apply(obj, [].concat.apply(args, arguments));
    };
};

//trim方法兼容
String.prototype.trim = String.prototype.trim || function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};



//ajax工具类
var ajaxUtils = (function() {

    //ajax get方法
    function get(url, options, callback) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.onreadystatechange = function(event) {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) callback(xhr.responseText);
            }
        };
        xhr.open('get', url + '?' + serialize(options), true);
        xhr.send(null);
    }

    //ajax post方法
    function post(url, options, callback) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.onreadystatechange = function(event) {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) callback(xhr.responseText);
            }
        };
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

    //暴露接口
    return {
        get: get,
        post: post
    }
}());



//cookie工具类
var cookieUtils = (function() {
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
    }

    //删除Cookie
    function removeCookie(name, path, domain) {
        setCookie(name, '', new Date(), path, domain);
    }

    //暴露接口
    return {
        setCookie: setCookie,
        getCookies: getCookies,
        removeCookie: removeCookie,
        getFutureDate: getFutureDate
    }
}());



//封装的通用工具类，避免全局变量污染
var utils = (function() {

    //增加类名
    function addClass(node, className) {
        var cur = node.className || "";
        if ((" " + cur + " ").indexOf(" " + className + " ") === -1)
            node.className = cur ? cur + " " + className : className;
    }

    //删除类名
    function delClass(node, className) {
        var cur = node.className || "";
        node.className = (" " + cur + " ").replace(" " + className + " ", " ").trim();
    }

    //扩展原型
    function extend(o1, o2) {
        for (var i in o2) {
            if (o1[i] === undefined) o1[i] = o2[i];
        }
        return o1;
    }

    //改写原型，不知道有没有标准叫法，自己起了一个名
    function rewrite(o1, o2) {
        for (var i in o1) {
            if (o2[i] !== undefined) o1[i] = o2[i];
        }
        return o1;
    }

    //自定义事件
    var emitter = {
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
            if (calls = handle[event]) {
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
    };

    //字符串转化为节点
    function html2node(str) {
        var container = document.createElement('div');
        container.innerHTML = str;
        return container.children[0];
    }

    //清除选区
    function clearSelection() {
        if (window.getSelection) window.getSelection().removeAllRanges();
        else if (window.document.selection) window.document.selection.empty();
    }

    //支持任意属性值变化的动画函数
    function anime(node, prop, targetValue, options) {
        var frameRate = options && options.frameRate ? options.frameRate : 30, //每秒帧数
            speed = options && options.speed, //动画播放速度,单位长度/ms
            callback = options && options.callback; //回调函数，只有动画正常播放完才会执行回调

        //属性相关加工和处理。这里只实现了透明度和百分比left，实现其他属性只需要添加case分支语句即可
        function propFactory(node, prop) {
            switch (prop) {
                case 'opacity':
                    this.getValue = function() {
                        var value = targetValue ? 0 : 1;
                        if (prop in node.style) node.style[prop] = value;
                        else node.style.filter = 'alpha(opacity=' + 100 * value + ')'; //兼容ie8
                        return value;
                    };
                    this.setValue = function(value) {
                        if (prop in node.style) node.style[prop] = value + '';
                        else node.style.filter = 'alpha(opacity=' + 100 * value + ')';
                    };
                    return;
                case 'left':
                    this.getValue = function() {
                        return node.style[prop] === '' ? 0 : parseFloat(node.style[prop].slice(0, -1));
                    };
                    this.setValue = function(value) {
                        node.style[prop] = value + '%';
                    };
                    return;
            }
        }


        var _prop = new propFactory(node, prop);
        var currentValue = _prop.getValue(),
            offset = targetValue - currentValue,
            dir = offset > 0 ? 1 : (offset < 0 ? -1 : 0); //表示数值变化方向
        if (!speed) { //speed不存在动画直接播放至完成状态
            endAnime();
            return;
        }
        if (node.animeIntervalID !== undefined) return; //防止重复触发


        //每帧动画调用修改属性值
        function updateAnime() {
            currentValue = currentValue + dir * speed * 1000 / frameRate;
            _prop.setValue(currentValue);
            if ((targetValue - currentValue) * dir <= 0) endAnime();
        }

        //结束动画
        function endAnime() {
            if (node.animeIntervalID) clearInterval(node.animeIntervalID);
            node.animeIntervalID = undefined;
            _prop.setValue(targetValue);
            callback && callback();
        }

        //播放动画
        node.animeIntervalID = setInterval(updateAnime, 1000 / frameRate);
    }

    return { //暴露接口
        addClass: addClass,
        delClass: delClass,
        extend: extend,
        rewrite: rewrite,
        emitter: emitter,
        html2node: html2node,
        clearSelection: clearSelection,
        anime: anime
    }
}());