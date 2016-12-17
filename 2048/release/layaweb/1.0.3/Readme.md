#2048小游戏

采用LayaAir +TypeScript开发

*  以前玩过Unity和C#上手TS几乎没有任何难度（毕竟一个作者），至少对游戏而言，TS绝对是更优的选择，能够在编译阶段就预防很多问题，也减轻了记忆一大堆API的负担
   
*  之前公司用过白鹭，开发大型游戏的性能瓶颈还是比较严重的，所以这次选择了Laya上手，目前感觉开发体验还可以，成熟度可能还欠缺一些

*  游戏核心逻辑部分完全独立完成，没有参考任何别人的逻辑，还存在一些可以优化的地方
     
    //大概看这一段就能明白了，没有想象中那么复杂
    switch (dir) {
            case Direction.Up:
                for (let i = 0; i < this.column; i++) {
                    for (let j = 0; j < this.row; j++) {
                        let exp = data[i][j].getExp();
                        //遍历找到一个有数字的格
                        for (let k = j + 1; k < this.row; k++) {
                            let value = data[i][k].getExp();
                            if (value) {
                                //如果当前格是空的那么移动到这里
                                if (!exp) {
                                    upDateGrid(i, j, i, k, exp, false);
                                    exp = data[i][j].getExp();
                                }
                                //如果两个数相等，那么移动到这里，合并并跳出循环 
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
                break;

*  最大的难点算是为了动画和缓动而引入了很多异步逻辑，导致调试变得非常困难，中间出了个BUG排查了很久，最后还是靠写模拟数据测试+打断点解决，可能用await和asnyc的方案会比较好

*  最后吐槽一句感觉自己连培训班的人都竞争不过了，难道真要走上简历造假的道路？还是回去做游戏吧！
