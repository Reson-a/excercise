var Tween = Laya.Tween;
//公共样式
var commonStyle = {
    align: 'center',
    valign: 'middle',
    bold: 'true',
    fontSize: gameConfig.width / gameConfig.column / 2,
};
//样式列表
var stylesArr = [
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
];
var Grid = (function () {
    function Grid(exp) {
        if (exp === void 0) { exp = 0; }
        this.init();
        this.setValue(exp, true);
    }
    //初始化操作
    Grid.prototype.init = function () {
        if (!this.text) {
            this.text = new Laya.Label();
            this.text.width = Grid.gridWidth;
            this.text.height = Grid.gridHeight;
            this.text.anchorX = 0.5; //以中点为轴心缩放
            this.text.anchorY = 0.5;
        }
    };
    //更新文字及样式
    Grid.prototype.upDate = function () {
        var i = this.exp, text = this.text, style = Grid.styles[i];
        //Object.assign(text, Grid.commonStyle, style); //混入样式 TS不会对Object assign进行编译
        extend(text, Grid.commonStyle);
        extend(text, style);
        text.text = this.num ? this.num + '' : ''; //设置文字
        function extend(o1, o2) {
            for (var key in o2) {
                o1[key] = o2[key];
            }
        }
    };
    //设置位置,isTween表示是否有缓动效果
    Grid.prototype.setPos = function (x, y, isTween, callback) {
        var _this = this;
        if (x > gameConfig.column || y > gameConfig.row)
            return;
        x = (Grid.gridWidth + Grid.borderWidth) * x + Grid.gridWidth / 2 + Grid.borderWidth;
        y = (Grid.gridHeight + Grid.borderWidth) * y + Grid.gridHeight / 2 + Grid.borderWidth;
        if (isTween) {
            Grid.tweenList.push(this);
            this.tween = Tween.to(this.text, { x: x, y: y }, 300, Laya.Ease.linearNone, laya.utils.Handler.create(this, function () {
                callback && callback.run();
                Grid.tweenList.splice(Grid.tweenList.indexOf(_this), 1);
            }));
        }
        else
            this.text.pos(x, y);
    };
    //给数字赋值,showAsnyc为true则立即显示更新后的数值，否则等待手动异步更新    
    Grid.prototype.setValue = function (exp, showAsnyc) {
        if (exp === void 0) { exp = 0; }
        var isTween = this.text.text != exp + '';
        this.exp = exp || 0; //设置相关属性
        this.num = exp ? Math.pow(2, exp) : 0;
        if (showAsnyc)
            this.showValue(isTween);
    };
    //显示数字的值,isTween表示是否播放缓动动画
    Grid.prototype.showValue = function (isTween, callback) {
        var _this = this;
        this.upDate();
        this.setOrder();
        if (isTween) {
            this.text.scale(0.5, 0.5);
            Grid.tweenList.push(this);
            this.tween = Tween.to(this.text, {
                scaleX: 1,
                scaleY: 1
            }, 300, Laya.Ease.bounceInOut, laya.utils.Handler.create(this, function () {
                callback && callback.run();
                Grid.tweenList.splice(Grid.tweenList.indexOf(_this), 1);
            }));
        }
    };
    //取得2的幂
    Grid.prototype.getExp = function () {
        return this.exp;
    };
    //设置层级
    Grid.prototype.setOrder = function () {
        if (!this.exp)
            this.text.zOrder = 0; //设置层级
        else
            this.text.zOrder = 10;
    };
    return Grid;
}());
Grid.commonStyle = commonStyle; //公共样式
Grid.styles = stylesArr; //样式列表
Grid.borderWidth = 10;
Grid.gridWidth = gameConfig.width / gameConfig.column - Grid.borderWidth * (1 + 1 / gameConfig.column); //每格的宽度
Grid.gridHeight = gameConfig.height / gameConfig.row - Grid.borderWidth * (1 + 1 / gameConfig.row); //每格的高度  
Grid.tweenList = [];
//# sourceMappingURL=grid.js.map