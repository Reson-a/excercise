enum Direction {
    Up,
    Down,
    Left,
    Right
}
//输入处理
class InputManager {
    public static instance: InputManager;
    private isDrag: boolean;
    private distance: number;//触发滑动距离
    private startPos;
    constructor() {
        if (InputManager.instance) return InputManager.instance;//如果存在单例则直接返回
        InputManager.instance = this;
        this.distance = 60;
        Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
    }
    static init(): InputManager {
        return new InputManager();
    }
    //添加键盘事件
    onKeyUp(e: Laya.Event): void {
        switch (e.keyCode) {
            case 87:
            case 38:
                Game.instance.move(0);//上
                break;
            case 83:
            case 40:
                Game.instance.move(1);//下
                break;
            case 65:
            case 37:
                Game.instance.move(2);//左
                break;
            case 68:
            case 39:
                Game.instance.move(3);//右
                break;
        }
    }
    //添加鼠标拖拽操作
    onMouseDown(e): void {
        this.isDrag = true;
        this.startPos = {
            x: Laya.stage.mouseX,
            y: Laya.stage.mouseY
        }
    }
    onMouseMove(e): void {
    }
    onMouseUp(e): void {
        if (!this.isDrag) return;
        this.isDrag = false;
        let x1: number = this.startPos.x,
            x2: number = Laya.stage.mouseX,
            y1: number = this.startPos.y,
            y2: number = Laya.stage.mouseY;
        if ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) < this.distance * this.distance) return;//移动距离小于触发距离直接退出
        if (y1 > y2 && (y1 - y2) > Math.abs(x1 - x2)) Game.instance.move(0);//上
        else if (y1 < y2 && (y2 - y1) > Math.abs(x1 - x2)) Game.instance.move(1);//下
        else if (x1 > x2 && (x1 - x2) > Math.abs(y1 - y2)) Game.instance.move(2);//左
        else if (x1 < x2 && (x2 - x1) > Math.abs(y1 - y2)) Game.instance.move(3);//右
    }
}