var Game = (function () {
    function Game(column, row) {
        if (column === void 0) { column = gameConfig.column; }
        if (row === void 0) { row = gameConfig.row; }
        this.column = column;
        this.row = row;
        if (Game.instance)
            return Game.instance; //如果存在单例则直接返回
        Game.instance = this;
        this.stageInit();
        this.startNew();
    }
    //舞台初始化，只调用一次
    Game.prototype.stageInit = function () {
        Laya.init(640, 1136, Laya.WebGL); //iphone5为初始尺寸
        Laya.stage.scaleMode = "showAll"; //适配模式
        Laya.stage.screenMode = "vertical"; //自动竖屏
        Laya.stage.bgColor = '#FAF8EF';
        //初始化并添加方格容器
        this.container = new Laya.HTMLDivElement();
        this.container.width = gameConfig.width;
        this.container.height = gameConfig.height;
        this.container.x = (640 - gameConfig.width) / 2; //居中显示
        this.container.y = (1136 - gameConfig.height) / 2; //居中显示
        this.container.style.border = '20px solid #BBAD9F'; //设置容器样式        
        this.container.style.backgroundColor = '#BBAD9F';
        Laya.stage.addChild(this.container);
        //初始化并添加UI
        this.mainMenu = new MainMenu();
        Laya.stage.addChild(this.mainMenu);
        //操作初始化
        InputManager.init();
    };
    //游戏状态初始化，可能调用多次
    Game.prototype.gameInit = function () {
        this.score = 0;
        this.numCount = 0;
        this.maxCount = this.row * this.column;
        if (!this.data)
            this.data = [];
        for (var i = 0; i < this.column; i++) {
            if (!this.data[i])
                this.data.push([]);
            for (var j = 0; j < this.row; j++) {
                var grid = void 0;
                if (!this.data[i][j]) {
                    grid = new Grid();
                    var grid0 = new Grid(); //grid0用于充当背景，防止播放动画时露馅，也可以用一张背景图处理
                    this.container.addChild(grid0.text);
                    this.container.addChild(grid.text);
                    this.data[i].push(grid);
                    grid.setPos(i, j);
                    grid0.setPos(i, j);
                }
                else
                    grid = this.data[i][j];
                grid.setValue(0, true); //数值归零
            }
        }
    };
    //开始新一局游戏
    Game.prototype.startNew = function () {
        this.gameInit();
        this.generateNum(gameConfig.startNumber);
    };
    //随机生成新数字，n为数字个数，exp为指数,这部分逻辑可以优化
    Game.prototype.generateNum = function (n, exp) {
        if (exp === void 0) { exp = 1; }
        var count = 0;
        while (count < n && this.numCount < this.maxCount) {
            var i = this.getRandom(this.column);
            var j = this.getRandom(this.row);
            if (!this.data[i][j].getExp()) {
                this.data[i][j].setValue(exp, true);
                count++;
                this.numCount++;
            }
        }
    };
    //取得随机数
    Game.prototype.getRandom = function (n) {
        return Math.floor(Math.random() * n);
    };
    //notUpdate不更新数据，只检查是否能够移动，返回值表示是否发生移动
    Game.prototype.move = function (dir, notUpdate) {
        if (!this.data)
            return; //数据不存在则直接返回
        if (!notUpdate && Grid.tweenList.length)
            return; //任意动画未播放完成直接返回
        var data = this.data;
        var hasMoved = false; //方格是否发生了移动
        var hasGenerated = false; //是否生成了数字
        switch (dir) {
            case Direction.Up:
                for (var i = 0; i < this.column; i++) {
                    for (var j = 0; j < this.row; j++) {
                        var exp = data[i][j].getExp();
                        for (var k = j + 1; k < this.row; k++) {
                            var value = data[i][k].getExp();
                            if (value) {
                                if (!exp) {
                                    upDateGrid(i, j, i, k, exp, false); //更新数据及位置
                                    exp = data[i][j].getExp();
                                }
                                else if (exp == value) {
                                    upDateGrid(i, j, i, k, exp, true); //更新数据及位置
                                    break; //遇到相等的数字，合并并跳出循环
                                }
                                else
                                    break; //遇到不相等的数字，直接跳出循环
                            }
                        }
                    }
                }
                break;
            case Direction.Down:
                for (var i = this.column - 1; i >= 0; i--) {
                    for (var j = this.row - 1; j >= 0; j--) {
                        var exp = data[i][j].getExp();
                        for (var k = j - 1; k >= 0; k--) {
                            var value = data[i][k].getExp();
                            if (value) {
                                if (!exp) {
                                    upDateGrid(i, j, i, k, exp, false); //更新数据及位置
                                    exp = data[i][j].getExp();
                                }
                                else if (exp == value) {
                                    upDateGrid(i, j, i, k, exp, true); //更新数据及位置
                                    break; //遇到相等的数字，合并并跳出循环
                                }
                                else
                                    break; //遇到不相等的数字，直接跳出循环
                            }
                        }
                    }
                }
                break;
            case Direction.Left:
                for (var i = 0; i < this.row; i++) {
                    for (var j = 0; j < this.column; j++) {
                        var exp = data[j][i].getExp();
                        for (var k = j + 1; k < this.column; k++) {
                            var value = data[k][i].getExp();
                            if (value) {
                                if (!exp) {
                                    upDateGrid(j, i, k, i, exp, false); //更新数据及位置
                                    exp = data[j][i].getExp();
                                }
                                else if (exp == value) {
                                    upDateGrid(j, i, k, i, exp, true); //更新数据及位置
                                    break; //遇到相等的数字，合并并跳出循环
                                }
                                else
                                    break; //遇到不相等的数字，直接跳出循环
                            }
                        }
                    }
                }
                break;
            case Direction.Right:
                for (var i = this.row - 1; i >= 0; i--) {
                    for (var j = this.column - 1; j >= 0; j--) {
                        var exp = data[j][i].getExp();
                        for (var k = j - 1; k >= 0; k--) {
                            var value = data[k][i].getExp();
                            if (value) {
                                if (!exp) {
                                    upDateGrid(j, i, k, i, exp, false); //更新数据及位置
                                    exp = data[j][i].getExp();
                                }
                                else if (exp == value) {
                                    upDateGrid(j, i, k, i, exp, true); //更新数据及位置
                                    break; //遇到相等的数字，合并并跳出循环
                                }
                                else
                                    break; //遇到不相等的数字，直接跳出循环
                            }
                        }
                    }
                }
                break;
        }
        //grid更新统一处理
        function upDateGrid(a, b, c, d, exp, flag) {
            var that = Game.instance;
            if (a === c && b == d)
                return; //未发生交换直接返回
            else {
                hasMoved = true; //发生或可发生交换
                if (notUpdate)
                    return; //数据不更新则直接返回
                var temp = data[a][b];
                data[a][b] = data[c][d];
                data[c][d] = temp;
                if (flag) {
                    data[a][b].setValue(exp + 1);
                    data[c][d].setValue();
                }
                data[a][b].setPos(a, b, true, laya.utils.Handler.create(that, function () {
                    data[c][d].setPos(c, d);
                    data[a][b].showValue(flag); //异步显示数值
                    data[c][d].showValue();
                    if (flag) {
                        that.score += Math.pow(2, exp + 1); //增加分数
                        that.numCount--; //数字数-1
                        that.mainMenu.upDateScore();
                    }
                    //数据发生更新才会生成新数字，否则只用于检查,当前以及生成新数字情况下不再检查
                    if (!notUpdate && !hasGenerated) {
                        if (hasMoved) {
                            that.generateNum(1); //则生成一个新的数字
                            hasGenerated = true;
                        }
                    }
                    //如果数字已满，判断是否游戏失败
                    if (that.numCount >= that.maxCount) {
                        if (!(that.move(0, true) || that.move(1, true) || that.move(2, true) || that.move(3, true))) {
                            that.gameFail(); //游戏失败
                            return;
                        }
                    }
                }));
                if (exp + 1 > 10)
                    Game.instance.gameWin(); //到达2048即游戏胜利
            }
        }
        return hasMoved;
    };
    //游戏失败
    Game.prototype.gameFail = function () {
        this.mainMenu.showRes('LOSE!');
        console.log('你输了');
    };
    //游戏胜利
    Game.prototype.gameWin = function () {
        this.mainMenu.showRes('WIN!');
        console.log('你赢了');
    };
    return Game;
}());
//启动游戏
new Game();
console.log(Game.instance);
//# sourceMappingURL=game.js.map