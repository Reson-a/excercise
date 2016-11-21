<template>
    <div class="me">
        <base-layout class="splitter">
            <el-row class="user">
                <img :src="userData.portrait" :alt="userData.name" class="f-fl">
                <div>
                    <h1>{{userData.name}}</h1>
                    <p>{{userData.phone}}</p>
                </div>
                <i class="el-icon-arrow-right f-fr"></i>
            </el-row>    
        </base-layout>
        <base-layout class="splitter">
            <div class="me-item border-bottom">
                <i class="el-icon-upload f-fl"></i>                                  
                <p>下载管理</p>                
                <i class="el-icon-arrow-right f-fr"></i>
            </div>
            <div class="me-item border-bottom">
                <i class="el-icon-document f-fl"></i>                                  
                <p>安装记录</p>                
                <i class="el-icon-arrow-right f-fr"></i>
            </div>
            <div class="me-item">
                <i class="el-icon-setting f-fl"></i>                                   
                <p>设置</p>                
                <i class="el-icon-arrow-right f-fr"></i>
            </div>
        </base-layout>
    </div>	
</template>

<script>
    import baseLayout from './BaseLayout.vue'

    var userData={
        portrait:'',
        name:'八哥',
        phone:18888888888
    }
    export default {
        data() {
            return {
                userData               
            }
        },
        components: {
            baseLayout
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.user,.me-item{
    padding:1rem 0;
    position:relative;
    img{
        width:3rem;
        height:3rem;        
    }
    
    div{
        margin-left:4.4rem;
        h1{            
            font-size:1.4rem;
            margin-bottom:0.6rem;
            line-height:1;
        }
    }
    >p{
        font-size:1.2rem;
        margin-left:4.4rem;
    }
       

    i{        
        font-size:1.6rem;
        color:#D3DCE6;
        height:1.6rem;
        width:1.6rem;        
    }
}

.me-item{
    .f-fl{
        left:0.8rem;
    }
}

</style>