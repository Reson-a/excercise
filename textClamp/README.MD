### vue自定义指令----多行文本裁剪
#
分享一个项目中自己写的vue指令，解决非webkit浏览器多行文本裁剪的问题（webkit可用line-clamp）

网上一搜也有很多五花八门的解决方案，但都有各有缺陷，基本上一个非等宽字体就能废掉绝大部分，要么就是代码长的吓人(处理的很完美不过也太长了吧)

这里是用vue自定义指令获取节点+window.getComputedStyle()得到文本节点计算后的高度然后与目标比较，并截取对应字符串，对任意宽度字符都可以做到完美地在段落的最后加上…

缺点是性能上会有所损耗，不过现代浏览器完全压力不大，请注意对父元素设置固定高度并overflow:hidden避免可能引起的重绘



代码示例

    // lineCount:4, 文本行数，超过裁剪
    // maxLength:160  可能最大字符数，一般用半角计算，帮助减少判断
    
    <p class="artist-brief" v-text-clamp="{lineCount:4,maxLength:160}">{{msg.brief || '暂无简介'}}</p>

    import { textClamp } from 'directive.js'
    // ......
    directives: {
        textClamp
    }
