class Game {
    public static instance: Game;//单例模式    
    public data: Array<Array<Grid>>//游戏数据
    private container: Laya.Label;
    private maxCount: number;//数字最大个数
    private numCount: number;//当前数字数量  
    private mainMenu: MainMenu;
    public score: number;//分数
    constructor(public column: number = gameConfig.column, public row: number = gameConfig.row) {
        if (Game.instance) return Game.instance;//如果存在单例则直接返回
        Game.instance = this;
        this.stageInit();
        this.startNew();
        //Laya.Stat.show(0, 0);
    }
    //舞台初始化，只调用一次
    stageInit(): void {
        //Laya.init(640, 1136);//iphone5为初始尺寸
        Laya.init(640, 1136, Laya.WebGL);//iphone5为初始尺寸
        Laya.stage.scaleMode = Laya.Stage.SCALE_NOBORDER;//适配模式
        Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;//自动竖屏        
        Laya.stage.bgColor = '#FAF8EF';
        //初始化并添加方格容器
        this.container = new Laya.Label();
        this.container.width = gameConfig.width;
        this.container.height = gameConfig.height;
        this.container.x = (640 - gameConfig.width) / 2;//居中显示
        this.container.y = (1136 - gameConfig.height) / 2;//居中显示   
        this.container.bgColor = '#BBAD9F';
        Laya.stage.addChild(this.container);
        //初始化并添加UI
        this.mainMenu = new MainMenu();
        Laya.stage.addChild(this.mainMenu);
        //操作初始化
        InputManager.init();
    }
    //游戏状态初始化，可能调用多次
    gameInit(): void {
        this.score = 0;
        this.numCount = 0;
        this.maxCount = this.row * this.column;

        if (!this.data) this.data = [];
        for (let i = 0; i < this.column; i++) {
            if (!this.data[i]) this.data.push([]);
            for (let j = 0; j < this.row; j++) {
                let grid: Grid;
                if (!this.data[i][j]) {
                    grid = new Grid();
                    let grid0 = new Grid();//grid0用于充当背景，防止播放动画时露馅，也可以用一张背景图处理
                    this.container.addChild(grid0.text);
                    this.container.addChild(grid.text);
                    this.data[i].push(grid);
                    grid.setPos(i, j);
                    grid0.setPos(i, j);
                }
                else grid = this.data[i][j];
                grid.setValue(0, true);//数值归零
            }
        }
    }
    //开始新一局游戏
    startNew(): void {
        this.gameInit();
        this.generateNum(gameConfig.startNumber);
    }
    //随机生成新数字，n为数字个数，exp为指数,这部分逻辑可以优化
    generateNum(n: number, exp: number = 1): void {
        let count = 0;
        while (count < n && this.numCount < this.maxCount) {//生成n个数字
            let i: number = this.getRandom(this.column);
            let j: number = this.getRandom(this.row);
            if (!this.data[i][j].getExp()) {//在当前没有数字的位置随机生成
                let a = Math.random();
                if (a > 3 / 4) exp += 1;
                this.data[i][j].setValue(exp, true);
                count++;
                this.numCount++;
            }
        }
    }
    //取得随机数
    getRandom(n: number): number {
        return Math.floor(Math.random() * n);
    }
    //notUpdate不更新数据，只检查是否能够移动，返回值表示是否发生移动
    move(dir: Direction, notUpdate?: boolean): boolean {
        if (!this.data) return;//数据不存在则直接返回
        if (!notUpdate && Grid.tweenList.length) return;//任意动画未播放完成直接返回
        let data = this.data;
        let hasMoved = false;//方格是否发生了移动
        let hasGenerated = false;//是否生成了数字
        switch (dir) {
            case Direction.Up:
                for (let i = 0; i < this.column; i++) {
                    for (let j = 0; j < this.row; j++) {
                        let exp = data[i][j].getExp();
                        for (let k = j + 1; k < this.row; k++) {
                            let value = data[i][k].getExp();
                            if (value) {
                                if (!exp) {//如果当前格是空的那么移动到这里
                                    upDateGrid(i, j, i, k, exp, false);//更新数据及位置
                                    exp = data[i][j].getExp();
                                }
                                else if (exp == value) {//如果两个数相等，那么移动到这里并发生合并     
                                    upDateGrid(i, j, i, k, exp, true);//更新数据及位置
                                    break;//遇到相等的数字，合并并跳出循环
                                }
                                else break;//遇到不相等的数字，直接跳出循环
                            }
                        }
                    }
                }
                break;
            case Direction.Down:
                for (let i = this.column - 1; i >= 0; i--) {
                    for (let j = this.row - 1; j >= 0; j--) {
                        let exp = data[i][j].getExp();
                        for (let k = j - 1; k >= 0; k--) {
                            let value = data[i][k].getExp();
                            if (value) {
                                if (!exp) {//如果当前格是空的那么移动到这里
                                    upDateGrid(i, j, i, k, exp, false);//更新数据及位置
                                    exp = data[i][j].getExp();
                                }
                                else if (exp == value) {//如果两个数相等，那么移动到这里并发生合并        
                                    upDateGrid(i, j, i, k, exp, true);//更新数据及位置
                                    break;//遇到相等的数字，合并并跳出循环
                                }
                                else break;//遇到不相等的数字，直接跳出循环
                            }
                        }
                    }
                }
                break;
            case Direction.Left:
                for (let i = 0; i < this.row; i++) {
                    for (let j = 0; j < this.column; j++) {
                        let exp = data[j][i].getExp();
                        for (let k = j + 1; k < this.column; k++) {
                            let value = data[k][i].getExp();
                            if (value) {
                                if (!exp) {//如果当前格是空的那么移动到这里
                                    upDateGrid(j, i, k, i, exp, false);//更新数据及位置
                                    exp = data[j][i].getExp();
                                }
                                else if (exp == value) {//如果两个数相等，那么移动到这里并发生合并      
                                    upDateGrid(j, i, k, i, exp, true);//更新数据及位置
                                    break;//遇到相等的数字，合并并跳出循环
                                }
                                else break;//遇到不相等的数字，直接跳出循环
                            }
                        }
                    }
                }
                break;
            case Direction.Right:
                for (let i = this.row - 1; i >= 0; i--) {
                    for (let j = this.column - 1; j >= 0; j--) {
                        let exp = data[j][i].getExp();
                        for (let k = j - 1; k >= 0; k--) {
                            let value = data[k][i].getExp();
                            if (value) {
                                if (!exp) {//如果当前格是空的那么移动到这里
                                    upDateGrid(j, i, k, i, exp, false);//更新数据及位置
                                    exp = data[j][i].getExp();
                                }
                                else if (exp == value) {//如果两个数相等，那么移动到这里并发生合并    
                                    upDateGrid(j, i, k, i, exp, true);//更新数据及位置
                                    break;//遇到相等的数字，合并并跳出循环
                                }
                                else break;//遇到不相等的数字，直接跳出循环
                            }
                        }
                    }
                }
                break;
        }

        //grid更新统一处理
        function upDateGrid(a: number, b: number, c: number, d: number, exp: number, flag: boolean) {
            let that = Game.instance;
            if (a === c && b == d) return;//未发生交换直接返回
            else {
                hasMoved = true;//发生或可发生交换
                if (notUpdate) return;//数据不更新则直接返回
                let temp = data[a][b];
                data[a][b] = data[c][d];
                data[c][d] = temp;
                if (flag) {//同步更新数值
                    data[a][b].setValue(exp + 1);
                    data[c][d].setValue();
                }
                data[a][b].setPos(a, b, true, laya.utils.Handler.create(that, () => {
                    data[c][d].setPos(c, d);
                    data[a][b].showValue(flag);//异步显示数值
                    data[c][d].showValue();
                    if (flag) {
                        that.score += Math.pow(2, exp + 1);//增加分数
                        that.numCount--;//数字数-1
                        that.mainMenu.upDateScore();
                    }
                    //数据发生更新才会生成新数字，否则只用于检查,当前以及生成新数字情况下不再检查
                    if (!notUpdate && !hasGenerated) {
                        if (hasMoved) {//如果发生了移动
                            that.generateNum(1);//则生成一个新的数字
                            hasGenerated = true;
                        }
                    }
                    //如果数字已满，判断是否游戏失败
                    if (that.numCount >= that.maxCount) {
                        if (!(that.move(0, true) || that.move(1, true) || that.move(2, true) || that.move(3, true))) {//所有方向均不可移动                        
                            that.gameFail();//游戏失败
                            return;
                        }
                    }
                }));
                if (exp + 1 > 10) Game.instance.gameWin();//到达2048即游戏胜利
            }
        }
        return hasMoved;
    }
    //游戏失败
    gameFail(): void {
        this.mainMenu.showRes('LOSE!');
        console.log('你输了');
    }
    //游戏胜利
    gameWin(): void {
        this.mainMenu.showRes('WIN!');
        console.log('你赢了');
    }
}

//启动游戏
new Game();
console.log(Game.instance);