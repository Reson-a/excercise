/**
 * 自定义指令
 */
import Vue from 'vue'

/* 多行文本裁剪, 溢出部分自动省略
 * v-text-clamp="{
 * lineCount:3 // 行数 ,
 * maxLength:9 }"// 最多可能字符数,般情况按半角计算，可不填}
*/
export const textClamp = {
  inserted(el, binding, vnode) {
    let maxHeight = parseInt(window.getComputedStyle(el).lineHeight) * binding.value.lineCount
    let str = el.innerText
    let l = str.length
    let maxLength = binding.value.maxLength
    if (maxLength && l > maxLength) {
      l = maxLength
      str = str.slice(0, l) + '...'
      el.innerText = str
    }
    while (parseInt(window.getComputedStyle(el).height) > maxHeight) {
      str = str.slice(0, -4) + '...'
      el.innerText = str
    }
  }
}
