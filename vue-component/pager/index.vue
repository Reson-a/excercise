<!-- 
 * @author Reson_a<80547665@qq.com>
 * 分页器组件
 prop: {
    pageCount = ? // 总页数,required
    initialPageIndex = 0 // 初始页面,从0开始,默认为0
    maxShowCount = 5 // 最大展示页面数，默认为5
  }
  注意：.pager的display为tabel-cell 如果需要修改display进行布局请用.pager-wrap
-->

<template>
  <div class="pager-wrap">
    <ul class="pager" v-if="pageCount>1">
      <li class="prev" @click="prev">上一页</li>
      <li class="page" v-for="index in showCount" @click="pageClick(startIndex+index-1)" :class="{'z-active':startIndex+index-1==pageIndex}"
        v-show="startIndex+index<=pageCount">{{startIndex+index}}</li>
      <li class="next" @click="next">下一页</li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    pageCount: {
      type: Number,
      required: true
    },
    maxShowCount: {
      type: Number,
      default: 5
    },
    initialPageIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      pageIndex: this.initialPageIndex // 实际页码
    }
  },
  computed: {
    // 实际展示页面数量，小于等于页面总数量
    showCount () {
      return this.pageCount < this.maxShowCount ? this.pageCount : this.maxShowCount
    },
    // 显示的第一个页码
    startIndex () {
      return this.pageIndex - this.pageIndex % this.showCount
    }
  },
  methods: {
    // 向父组件派发page-click事件，参数为index(从0开始计数)
    pageClick (index) {
      this.pageIndex = index
      this.$emit('page-click', index)
    },
    // 向前翻页
    prev () {
      if (this.pageIndex <= 0) return
      this.pageIndex--
      this.$emit('page-click', this.pageIndex)
    },
    // 向后翻页
    next () {
      if (this.pageIndex >= this.pageCount - 1) return
      this.pageIndex++
      this.$emit('page-click', this.pageIndex)
    }
  }
}
</script>
<style scoped lang="postcss">
.pager {
  display: table-cell;
  width: 100%;
  text-align: center;
  color: #BEBEBE;
  line-height: 20px;
  position: relative;
}

.pager li{
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
}
  
.page {
  font-size: 20px;
  width: 32px;
  padding: 6px 0;
  margin: 0 8px;
  background-color: #FFF;
  border-radius: 10px;
}

.page.z-active{
  color: #FFF;
  background-color: #090714
}

.next {
  margin-left: 20px;
}

.prev {
  margin-right: 20px;
}

</style>