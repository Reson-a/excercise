<template>
	<div class="category">
        <base-layout class="splitter">
            <el-row :gutter="20">
                <el-col :span="12"><a href=""  v-tap><img src="" alt="游戏合辑" class="small"></a></el-col>
                <el-col :span="12"><a href=""  v-tap><img src="" alt="热门单机" class="small"></a></el-col>                            
                <el-col :span="12" class="row-second"><a href=""  v-tap><img src="" alt="热门专题" class="small"></a></el-col>
                <el-col :span="12" class="row-second"><a href=""  v-tap><img src="" alt="魅友推荐" class="small"></a></el-col>
            </el-row>    
        </base-layout>
        <base-layout v-for="item in 8">
            <el-row class="category-details">
                <el-col :span="6" class="border-bottom"><a href=""  v-tap class="border-right"><img src="" alt="游戏合辑" class="icon"><p>游戏合辑</p></a></el-col>
                <el-col :span="6"><a href=""  v-tap><p><span>大作</span><span>Q版</span></p></a></el-col>                            
                <el-col :span="6"><a href=""  v-tap><p><span>卡牌</span><span>动漫</span></p></el-col>
                <el-col :span="6"><a href=""  v-tap><p><span>经典</span><span>益智</span></p></el-col>
            </el-row>    
        </base-layout>
	</div>
</template>

<script>
    import baseLayout from './BaseLayout.vue'
    export default {
        data() {
            return {}
        },
        components: {
            baseLayout
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.category-details{
    height:7rem;
    .border-right{        
        position:relative;
        &:after{
            top:0.5rem;
            bottom:0.5rem;
        }
    }
    span{
        display:block;
        height:1rem;
        margin-top:1rem;
    }
}    
</style>