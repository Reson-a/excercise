<template>
   <div class="collection">
        <slider :pagination-visible="true" :slides="slides" :repeating="true" :auto="5000" class="">
            <div v-for="(slide,index) in slides" :key="index">
                <a :href="slide.value">
                   <img width="100%" height="100%" :src="slide.image" :alt="slide.alt"/>
                </a>
            </div>
        </slider>
        <base-layout class="splitter">
            <el-row :gutter="10">
                <el-col :span="6"><a href=""  v-tap><img src="" alt="必备"></a></el-col>
                <el-col :span="6"><a href=""  v-tap><img src="" alt="评测"></a></el-col>
                <el-col :span="6"><a href=""  v-tap><img src="" alt="福利"></a></el-col>
                <el-col :span="6"><a href=""  v-tap><img src="" alt="游戏"></a></el-col>
            </el-row>            
        </base-layout>
        <base-layout>
            <div class="app-list-title">
                <span>编辑推荐</span>
                <a href="">更多</a>                    
            </div>
            <app-list :app-data="appData"></app-list> 
        </base-layout>          
    </div>
</template>

<script>
    import slider from './Slider.vue'
    import appList from './AppList.vue'
    import baseLayout from './BaseLayout.vue'

    var appData = [{
        icon: '',
        name: '即刻',
        size: '10.7',
        userCount: '69',
        slogan: '第一时间告诉你新鲜好玩的东西',
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
        slogan: '第一时间告诉你新鲜好玩的东西'
    }, {
        icon: '',
        name: '即刻',
        size: '10.7',
        userCount: '69',
        slogan: '第一时间告诉你新鲜好玩的东西'
    }, {
        icon: '',
        name: '即刻',
        size: '10.7',
        userCount: '69',
        slogan: '第一时间告诉你新鲜好玩的东西'
    }, {
        icon: '',
        name: '即刻',
        size: '10.7',
        userCount: '69',
        slogan: '第一时间告诉你新鲜好玩的东西'
    }, {
        icon: '',
        name: '即刻',
        size: '10.7',
        userCount: '69',
        slogan: '第一时间告诉你新鲜好玩的东西'
    }, {
        icon: '',
        name: '即刻',
        size: '10.7',
        userCount: '69',
        slogan: '第一时间告诉你新鲜好玩的东西'
    }, {
        icon: '',
        name: '即刻',
        size: '10.7',
        userCount: '69',
        slogan: '第一时间告诉你新鲜好玩的东西'
    }];
    export default {
        data() {
            return {
                slides: [{
                    value: '',
                    image: '',
                    alt: '轮播图1'
                }, {
                    value: '',
                    image: '',
                    alt: '轮播图2'

                }, {
                    value: '',
                    image: '',
                    alt: '轮播图3'
                }, {
                    value: '',
                    image: '',
                    alt: '轮播图4'
                }],
                appData
            }
        },
        components: {
            slider,
            appList,
            baseLayout
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    .g-bd {
        position: absolute;
        top: 7rem;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: scroll;
    }
    
    .swiper {
        height:15rem;
        margin: 1rem 0 0;
    }
    
    .el-col {
        .el-col {
            height:100%;
            padding: 1rem 0;
            a {
                display: block;
                width: 100%;
                height: 100%;
                text-align:center;
                img {
                    display:inline-block;                    
                    width: 100%;
                    height: 4rem;
                    &.small{
                        height: 3rem;
                    }
                    &.icon{
                        width: 3rem;
                        height: 3rem;
                        margin:0.25rem auto 0.5rem;
                    }
                }
            }
        }
        .row-second {
            padding: 0 0 1rem;
        }
    }
    
    .splitter {
        border-bottom: 1rem solid #EFF2F7;
    }
    
    .app-list-title {
        padding: 1rem 0;
        border-bottom: 1px solid #D3DCE6;
        span {
            border-left: 3px solid #20A0FF;
            padding-left: 5px;
        }
        a {
            float: right;
            color: #20A0FF;
        }
    }
</style>