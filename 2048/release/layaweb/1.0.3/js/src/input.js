var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
//输入处理
var InputManager = (function () {
    function InputManager() {
        if (InputManager.instance)
            return InputManager.instance; //如果存在单例则直接返回
        InputManager.instance = this;
        this.distance = 60;
        Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
    }
    InputManager.init = function () {
        return new InputManager();
    };
    //添加键盘事件
    InputManager.prototype.onKeyUp = function (e) {
        switch (e.keyCode) {
            case 87:
            case 38:
                Game.instance.move(0); //上
                break;
            case 83:
            case 40:
                Game.instance.move(1); //下
                break;
            case 65:
            case 37:
                Game.instance.move(2); //左
                break;
            case 68:
            case 39:
                Game.instance.move(3); //右
                break;
        }
    };
    //添加鼠标拖拽操作
    InputManager.prototype.onMouseDown = function (e) {
        this.isDrag = true;
        this.startPos = {
            x: Laya.stage.mouseX,
            y: Laya.stage.mouseY
        };
    };
    InputManager.prototype.onMouseMove = function (e) {
    };
    InputManager.prototype.onMouseUp = function (e) {
        if (!this.isDrag)
            return;
        this.isDrag = false;
        var x1 = this.startPos.x, x2 = Laya.stage.mouseX, y1 = this.startPos.y, y2 = Laya.stage.mouseY;
        if ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) < this.distance * this.distance)
            return; //移动距离小于触发距离直接退出
        if (y1 > y2 && (y1 - y2) > Math.abs(x1 - x2))
            Game.instance.move(0); //上
        else if (y1 < y2 && (y2 - y1) > Math.abs(x1 - x2))
            Game.instance.move(1); //下
        else if (x1 > x2 && (x1 - x2) > Math.abs(y1 - y2))
            Game.instance.move(2); //左
        else if (x1 < x2 && (x2 - x1) > Math.abs(y1 - y2))
            Game.instance.move(3); //右
    };
    return InputManager;
}());
//# sourceMappingURL=input.js.map