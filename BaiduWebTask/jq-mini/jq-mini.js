//迷你版jq 只实现了一部分内容，
//可能与原版具体实现方法有所差异，但思路是相同的
(function(window) {
    function $(selector, context) {
        return new $.fn.init(selector, context);
    }

    $.fn = $.prototype = {
        init: function(selector, context) {
            this.selector = selector;
            this.context = context && context[0] ? context[0] : document;
            var elem = this.context.querySelectorAll(selector);
            this.each.call(elem, function(item, index) {
                this[index] = item;
                this.length++;
            }.bind(this));
            return this;
        },
        length: 0,
        each: function(fn) {
            for (var i = 0; i < this.length; i++) {
                fn.call(this, this[i], i);
            }
        },
        extend: function(obj) {
            for (var o in obj) {
                if (this[o] === undefined) this[o] = obj[o];
            }
        }
    };
    //事件相关处理
    $.fn.extend({
        addEvent: function(elem, event, fn) {
            if (elem.addEventListner) elem.addEventListner(event, fn, false);
            else elem['on' + event] = fn;
            return this;
        },
        removeEvent: function(elem, event, fn) {
            if (elem.removeEventListner) elem.removeEventListner(event, fn, false);
            else elem['on' + event] = null;
            return this;
        },
        on: function(event, fn) {
            this.each(function(item, index) {
                this.addEvent(item, event, fn);
            })
        },
        un: function(event, fn) {
            this.each(function(item, index) {
                this.addEvent(item, event, fn);
            })
        },
        addDelegate: function(selector, event, fn) {
            if (!this[0]) return;
            var targets = [].concat.apply([], this[0].querySelectorAll(selector));
            if (!targets) return;
            var delegate = function(event) {
                event = event || window.event;
                var eventTarget = event.target || event.srcElement;
                if (targets.indexOf(eventTarget) < 0) return;
                else fn.call(eventTarget, event);
            }
            this.on(event, delegate);
            return this;
        }
    });

    //cookie
    $.fn.extend({
        isIE: function() {
            var agent = navigator.userAgent;
            if (/MSIE/.test(agent)) return agent.match(/MSIE\s(\d+)/)[1];
            else return /Trident/.test(agent) ? agent.match(/rv:([\d]+)/)[1] : -1;
        },
        setCookie: function(name, value, expires, path, domain, secure) {
            var cookie = decodeURICompone(name) + '=' + decodeURIComponent(value);
            if (expires) cookie += '; expires=' + expires.toUTCString();
            if (path) cookie += '; path=' + path;
            if (domain) cookie += '; domain=' + domain;
            if (secure) cookie += '; secure=' + secure;
            document.cookie = cookie;
        },
        getCookie: function() {
            var all = document.cookie;
            if (all === '') return cookie;
            var list = all.split('; ');
            for (var i = 0, len = list.length; i < len; i++) {
                var item = list[i];
                var p = item.indexOf('=');
                var name = item.substring(0, p);
                name = decodeURIComponent(name);
                var value = item.substring(p + 1);
                value = decodeURIComponent(value);
                cookie[name] = value;
            }
            return cookie;
        },
        removeCookie: function(name, path, domain) {
            setCookie(name, '', new Date(), path, domain);
        }
    });
    //ajax
    $.fn.extend({
        ajax: function(url, options) {
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject;
            xhr.onreadystatechange = function() {
                    if (xhr.readySate === 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            options.onsuccess && options.onsuccess();
                        } else {
                            options.onfail && options.onfail();
                        }
                    }
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
            if (options.type === 'post') {
                xhr.open('post', url, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send(serialize(options.data));
            } else {
                xhr.open('get', url + '?' + serialize(options.data), true);
                xhr.send(null);
            }
        }
    });

    $.fn.init.prototype = $.prototype;

    window.$ = $;

}(window));