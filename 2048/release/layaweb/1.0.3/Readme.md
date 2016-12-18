# 2048小游戏
[地址在这里][url]，因为开启了强制竖屏，请用devtools模拟或用手机打开。  
操作 WASD、上下左右、拖拽滑动均可
[url]:https://reson-a.github.io/works/2048/release/layaweb/1.0.3/index.html
TypeScript+LayaAir开发
* 之前玩过Unity和C#上手TS没有任何难度（毕竟一个作者），对于游戏开发而言TS感觉完胜JS，在编译阶段能避免很多错误并且减轻了一大堆API的记忆负担。
* 前公司用过白鹭引擎，同事对其性能都颇有微词，所以这次选择了Laya，上手体验还算轻松愉快，可能游戏比较简单暂时还没遇到什么深坑
* 游戏逻辑完全独立完成，没有参照其他人的代码，数字方格独立出一个类包括内容和样式都可以单独定制          、
<pre><code>//核心逻辑看着一段应该就理解了
         switch (dir) {
            case Direction.Up:
                for (let i = 0; i < this.column; i++) {
                    for (let j = 0; j < this.row; j++) {
                        let exp = data[i][j].getExp();
                        for (let k = j + 1; k < this.row; k++) {
                            let value = data[i][k].getExp();
                            if (value) {
                                //如果当前格是空的那么移动到这里
                                if (!exp) {
                                    upDateGrid(i, j, i, k, exp, false);
                                    exp = data[i][j].getExp();
                                }
                                //如果两个数相等，那么移动到这里发生合并并跳出循环     
                                else if (exp == value) {
                                    upDateGrid(i, j, i, k, exp, true);
                                    break;
                                }
                                //遇到不相等的数字，直接跳出循环
                                else break;
                            }
                        }
                    }
                }
                break;</code></pre>
* 核心逻辑没那么复杂，难点算是在于为了缓动动画引入的很多异步逻辑，导致调试变得非常困难，中间出了个BUG排查了半天，总结下来还是多封装一些功能独立的函数写用例测试（类似单元测试），不要等逻辑一大堆了才开始找问题，到那会可能就只能打断点了……
