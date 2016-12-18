class MainMenu extends ui.mainUI {
    constructor() {
        super();
        this.init();
    }
    init(): void {
        this.result.visible = false;
        this.newGame.on('click', this, this.startNew);
        this.upDateScore();
        this.upDateBest();
    }
    //更新分数
    upDateScore(): void {
        this.score.text = (Game.instance.score || 0) + '';
    }
    //更新最高分
    upDateBest(): void {
        this.best.text = this.best.text || 0 + '';
        let score = 0;
        if (window.localStorage) score = parseInt(window.localStorage["best"]);
        else score = parseInt(this.best.text);
        if (score && Game.instance.score > score) {
            this.best.text = Game.instance.score + '';
            if (window.localStorage) window.localStorage["best"] = this.best.text;
        }
    }
    //开始新游戏
    private startNew(): void {
        this.result.visible = false;
        Game.instance.startNew();
    }
    //展现结果
    showRes(res: string): void {
        this.result.text = res;
        this.result.visible = true;
        this.upDateBest();
    }
}

