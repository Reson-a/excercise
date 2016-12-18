import Tween = Laya.Tween;
//公共样式
const commonStyle = {
    align: 'center',
    valign: 'middle',
    bold: 'true',
    fontSize: gameConfig.width / gameConfig.column / 2,
}
//样式列表
const stylesArr = [
    {
        color: '#766D68',
        bgColor: '#CBC0B3',
    }, {
        color: '#766D68',
        bgColor: '#EFE3DB',
    }, {
        color: '#766D68',
        bgColor: '#EEE1C6',
    }, {
        color: '#F7E8DA',
        bgColor: '#F3B073',
    }, {
        color: '#F7E8DA',
        bgColor: '#F7945E',
    }, {
        color: '#F7E8DA',
        bgColor: '#F77C5A',
    }, {
        color: '#F7E8DA',
        bgColor: '#FB5D35',
    }, {
        color: '#F7E8DA',
        bgColor: '#EFCF6B',
    }, {
        color: '#F7E8DA',
        bgColor: '#ECCD57',
    }, {
        color: '#F7E8DA',
        bgColor: '#ECC842',
    }, {
        color: '#F7E8DA',
        bgColor: '#EFC534',
    }, {
        color: '',
        bgColor: '#EFC51F',
    },
]

class Grid {
    private exp: number;//指数
    private num: number;//数字
    public text: Laya.Label;//文字
    private static commonStyle = commonStyle;//公共样式
    private static styles = stylesArr; //样式列表
    public static borderWidth = 10;
    private static gridWidth = gameConfig.width / gameConfig.column - Grid.borderWidth * (1 + 1 / gameConfig.column);//每格的宽度
    private static gridHeight = gameConfig.height / gameConfig.row - Grid.borderWidth * (1 + 1 / gameConfig.row);//每格的高度  
    public tween: Tween;
    public static tweenList = [];

    constructor(exp: number = 0) {
        this.init();
        this.setValue(exp, true);
    }
    //初始化操作
    private init(): void {
        if (!this.text) {
            this.text = new Laya.Label();
            this.text.width = Grid.gridWidth;
            this.text.height = Grid.gridHeight;
            this.text.anchorX = 0.5;//以中点为轴心缩放
            this.text.anchorY = 0.5;
        }
    }
    //更新文字及样式
    private upDate(): void {
        let i = this.exp,
            text = this.text,
            style = Grid.styles[i];
        //Object.assign(text, Grid.commonStyle, style); //混入样式 TS不会对Object assign进行编译
        extend(text, Grid.commonStyle);
        extend(text, style);
        text.text = this.num ? this.num + '' : ''; //设置文字

        function extend(o1, o2) {
            for (let key in o2) {
                o1[key] = o2[key]
            }
        }
    }
    //设置位置,isTween表示是否有缓动效果
    setPos(x?: number, y?: number, isTween?: boolean, callback?: laya.utils.Handler): void {
        if (x > gameConfig.column || y > gameConfig.row) return;
        x = (Grid.gridWidth + Grid.borderWidth) * x + Grid.gridWidth / 2 + Grid.borderWidth;
        y = (Grid.gridHeight + Grid.borderWidth) * y + Grid.gridHeight / 2 + Grid.borderWidth;

        if (isTween) {
            Grid.tweenList.push(this);
            this.tween = Tween.to(this.text,
                { x, y }, 300, Laya.Ease.linearNone,
                laya.utils.Handler.create(this, () => {
                    callback && callback.run();
                    Grid.tweenList.splice(Grid.tweenList.indexOf(this), 1);
                }));
        }
        else this.text.pos(x, y);
    }
    //给数字赋值,showAsnyc为true则立即显示更新后的数值，否则等待手动异步更新    
    setValue(exp: number = 0, showAsnyc?: boolean): void {
        let isTween = this.text.text != exp + '';
        this.exp = exp || 0;//设置相关属性
        this.num = exp ? Math.pow(2, exp) : 0;
        if (showAsnyc) this.showValue(isTween);
    }
    //显示数字的值,isTween表示是否播放缓动动画
    showValue(isTween?: boolean, callback?: laya.utils.Handler) {
        this.upDate();
        this.setOrder();
        if (isTween) {//数字有改变时，播放缓动动画
            this.text.scale(0.5, 0.5);
            Grid.tweenList.push(this);
            this.tween = Tween.to(this.text, {
                scaleX: 1,
                scaleY: 1
            }, 300, Laya.Ease.bounceInOut,
                laya.utils.Handler.create(this, () => {
                    callback && callback.run();
                    Grid.tweenList.splice(Grid.tweenList.indexOf(this), 1);
                }));
        }
    }
    //取得2的幂
    getExp(): number {
        return this.exp;
    }
    //设置层级
    setOrder() {
        if (!this.exp) this.text.zOrder = 0;//设置层级
        else this.text.zOrder = 10;
    }
}


