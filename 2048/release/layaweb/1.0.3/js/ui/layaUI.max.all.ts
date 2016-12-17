
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class mainUI extends View {
		public score:laya.display.Text;
		public best:laya.display.Text;
		public newGame:Laya.Label;
		public result:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":640,"height":1136},"child":[{"type":"Label","props":{"y":70,"x":370,"width":100,"valign":"top","text":"Score","name":"score","height":80,"fontSize":30,"color":"#BBAD9F","bold":true,"align":"center"},"child":[{"type":"Text","props":{"y":40,"width":100,"var":"score","text":"0","name":"score","fontSize":"30","color":"#BBAD9F","bold":true,"align":"center"}}]},{"type":"Label","props":{"y":70,"x":490,"width":100,"text":"Best","name":"best","height":80,"fontSize":30,"color":"#BBAD9F","bold":true,"align":"center"},"child":[{"type":"Text","props":{"y":40,"x":0,"width":100,"var":"best","text":"0","name":"best","fontSize":"30","color":"#BBAD9F","bold":true,"align":"center"}}]},{"type":"Label","props":{"y":70,"x":50,"width":200,"valign":"top","text":"2048","name":"title","height":120,"fontSize":120,"color":"#766D68","bold":true,"align":"center"}},{"type":"Label","props":{"y":160,"x":380,"width":200,"var":"newGame","valign":"middle","text":"New Game","name":"newGame","height":50,"fontSize":30,"color":"#FFFFFF","bold":true,"bgColor":"#BBAD9F","align":"center"}},{"type":"Label","props":{"y":508,"x":120,"width":400,"visible":false,"var":"result","valign":"middle","text":"Win!","name":"result","height":120,"fontSize":120,"color":"#766D68","bold":true,"align":"center"}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.mainUI.uiView);
        }
    }
}
