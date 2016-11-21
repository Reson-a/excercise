<template>
    <div class="rank">
        <base-layout class="splitter">
            <el-row :gutter="20">
                <el-col :span="12"><a href=""  v-tap><img src="" alt="尝鲜榜" class="small"></a></el-col>
                <el-col :span="12"><a href=""  v-tap><img src="" alt="游戏榜" class="small"></a></el-col>                
            </el-row>        
        </base-layout>
        <base-layout>
            <app-list :app-data="rankData" :isRank="true"></app-list> 
        </base-layout>        
    </div>    
</template>

<script>
    import appList from './AppList.vue'
    import baseLayout from './BaseLayout.vue'

    var rankData = [{
        icon: '',
        name: '即刻',
        size: '10.7',
        userCount: '69',
        slogan: '第一时间告诉你新鲜好玩东西',
        isPromoted: false
    }, {
        icon: '',
        name: 'QQ阅读',
        size: '12.1',
        userCount: '1111',
        slogan: '致力于打造优秀极致的阅读体验',
        isPromoted: true
    }, {
        icon: '',
        name: '阴阳师',
        size: '565',
        userCount: '167',
        slogan: '网易和风匠心巨制',
        isPromoted: true
    }, {
        icon: '',
        name: '即刻',
        size: '10.7',
        userCount: '69',
        slogan: '第一时间告诉你新鲜好玩东西'
    }, {
        icon: '',
        name: '即刻',
        size: '10.7',
        userCount: '69',
        slogan: '第一时间告诉你新鲜好玩东西'
    }, {
        icon: '',
        name: '即刻',
        size: '10.7',
        userCount: '69',
        slogan: '第一时间告诉你新鲜好玩东西'
    }, {
        icon: '',
        name: '即刻',
        size: '10.7',
        userCount: '69',
        slogan: '第一时间告诉你新鲜好玩东西'
    }, {
        icon: '',
        name: '即刻',
        size: '10.7',
        userCount: '69',
        slogan: '第一时间告诉你新鲜好玩东西'
    }, {
        icon: '',
        name: '即刻',
        size: '10.7',
        userCount: '69',
        slogan: '第一时间告诉你新鲜好玩东西'
    }, {
        icon: '',
        name: '即刻',
        size: '10.7',
        userCount: '69',
        slogan: '第一时间告诉你新鲜好玩东西'
    }];
    export default {
        data() {
            return {
                rankData
            }
        },
        components: {
            appList,
            baseLayout
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">    
</style>