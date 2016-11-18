<template>
	<el-row>
            <el-col :span="2">&nbsp;
            </el-col>
            <el-col :span="20">
                <slot></slot>
            </el-col>
             <el-col :span="2">&nbsp;
            </el-col>    
    </el-row>
</template>

<script>
    export default {
        data() {
            return {}
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>