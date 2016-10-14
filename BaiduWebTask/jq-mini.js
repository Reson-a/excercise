//迷你版jq 只实现了事件监听的相关部分，
//可能与原版具体实现方法有所差异，但思路是相同的
(function(window) {
    function $(selector, context) {
        return new $.fn.init(selector, context);
    }

    $.fn = $.prototype = {
        init: function(selector, context) {
            this.selector = selector;
            this.context = context && context[0] ? context : document;
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
    }

    $.fn.init.prototype = $.prototype;

    window.$ = $;

}(window));