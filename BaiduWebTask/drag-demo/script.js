(function() {

    function Container() {
        this.outer = this.outer || document.body;
        this.containerNum = this.containerNum || 2;
        this.totalNum = this.totalNum || 8;
        this.startNum = this.startNum || Math.floor(this.totalNum / 2);
        this.containers = [];
        this.childs = [];
        this._init();
    }

    Container.prototype = {
        _layout: (function() {
            var c = document.createElement('div');
            c.className = "container";
            c.style.position = "relative";
            return c;
        }()),

        _init: function() {
            for (var i = 0; i < this.containerNum; i++) {
                this.containers.push(this._layout.cloneNode(true));
                this.outer.appendChild(this.containers[i]);
                if (!i) {
                    this.width = this.containers[i].clientWidth;
                    this.height = this.containers[i].clientHeight;
                    this.childHeight = this.height / this.totalNum;
                    this.dragWidth = this.width / 3;
                }
                this.childs.push([]);
                for (var j = 0; j < this.startNum; j++) {
                    var child = document.createElement('div');
                    child.className = 'child';
                    child.style.position = "absolute";
                    child.style.left = "0";
                    child.style.top = this.childHeight * j + 'px';
                    child.style.width = this.width;
                    child.style.height = this.childHeight;
                    this.containers[i].appendChild(child);
                    this.childs[i].push(child);
                }
            }

            this.addDelegate(this.outer, '.child', 'mousedown', this.dragStart.bind(this));
            this.outer.addEventListener('mousemove', this.drag.bind(this));
            this.outer.addEventListener('mouseup', this.dragEnd.bind(this));
            this.outer.addEventListener('mouseleave', this.dragEnd.bind(this));
        },
        dragStart: function(event) {
            this.isDrag = true;
            this.dragObj = event.target;
            this.dragObj.style.zIndex = 1;
            this.dragObj.style.opacity = 0.5;
            this.initX = parseInt(this.dragObj.style.left);
            this.initY = parseInt(this.dragObj.style.top);
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        },
        drag: function(event) {
            if (!this.dragObj) return;
            if (event.preventDefault) event.preventDefault();
            else event.returnValue = false;
            var x = event.clientX - this.mouseX,
                y = event.clientY - this.mouseY;
            this.dragObj.style.left = this.initX + x + 'px';
            this.dragObj.style.top = this.initY + y + 'px';
        },
        dragEnd: function() {
            if (!this.dragObj) return;
            var pos = this.dragObj.getBoundingClientRect();
            var cPos = [];
            var containerIndex;
            var childIndex;
            for (var i = 0; i < this.containerNum; i++) {
                var index = this.childs[i].indexOf(this.dragObj);
                if (index !== -1) {
                    containerIndex = i;
                    childIndex = index;
                    this.containers[i].removeChild(this.dragObj);
                    this.childs[i].splice(index, 1, null);
                }
            }
            for (var i = 0; i < this.containerNum; i++) {
                cPos.push(this.containers[i].getBoundingClientRect());
                var n = Math.round((pos.top - cPos[i].top) / this.childHeight);
                if (Math.abs(pos.left - cPos[i].left) <= this.dragWidth && n >= 0 && n < this.totalNum && !this.childs[i][n]) {
                    this.containers[i].appendChild(this.dragObj);
                    this.dragObj.style.left = 0;
                    this.dragObj.style.top = n * this.childHeight + 'px';
                    this.childs[i][n] = this.dragObj;
                }
            }
            if (!this.dragObj.parentNode) {
                this.containers[containerIndex].appendChild(this.dragObj);
                this.childs[containerIndex][childIndex] = this.dragObj;
                this.dragObj.style.left = 0;
                this.dragObj.style.top = childIndex * this.childHeight + 'px';
            }

            this.dragObj.style.opacity = 1;
            this.dragObj.style.zIndex = 0;
            this.dragObj = null;
        },
        addDelegate: function(node, selector, event, fn) {
            var targets = [].slice.call(node.querySelectorAll(selector));
            var delegate = function(event) {
                event = event || window.event;
                eventTarget = event.target || event.srcElement;
                if (targets.indexOf(eventTarget) < 0) return;
                else fn.call(eventTarget, event);
            }
            node.addEventListener(event, delegate, false);
        }
    }

    window.Container = Container;
}());


var c = new Container();