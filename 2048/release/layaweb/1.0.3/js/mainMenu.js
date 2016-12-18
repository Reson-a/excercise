var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MainMenu = (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    MainMenu.prototype.init = function () {
        this.result.visible = false;
        this.newGame.on('click', this, this.startNew);
        this.upDateScore();
        this.upDateBest();
    };
    //更新分数
    MainMenu.prototype.upDateScore = function () {
        this.score.text = (Game.instance.score || 0) + '';
    };
    //更新最高分
    MainMenu.prototype.upDateBest = function () {
        this.best.text = this.best.text || 0 + '';
        var score = 0;
        if (window.localStorage)
            score = parseInt(window.localStorage["best"]);
        else
            score = parseInt(this.best.text);
        if (score && Game.instance.score > score) {
            this.best.text = Game.instance.score + '';
            if (window.localStorage)
                window.localStorage["best"] = this.best.text;
        }
    };
    //开始新游戏
    MainMenu.prototype.startNew = function () {
        this.result.visible = false;
        Game.instance.startNew();
    };
    //展现结果
    MainMenu.prototype.showRes = function (res) {
        this.result.text = res;
        this.result.visible = true;
        this.upDateBest();
    };
    return MainMenu;
}(ui.mainUI));
//# sourceMappingURL=mainMenu.js.map