import './assets/css/style.scss'
import Vue from 'vue'
//import ElementUI from 'element-ui'
import {Col,Row,Button,Icon,Menu,MenuItem,Input} from 'element-ui'
//import 'element-ui/lib/theme-default/index.css'
import vueTap from 'v-tap'
//import Vuex from 'vuex'
import VueRouter from 'vue-router'

import Collection from './components/Collection.vue'
import Rank from './components/Rank.vue'
import CateGory from './components/CateGory.vue'
import Me from './components/Me.vue'
// import store from './js/vuex/store';

//Vue.use(Vuex);
//Vue.use(ElementUI);
Vue.use(VueRouter);
//Vue.use(Vuex);
Vue.use(vueTap);
Vue.use(Col);
Vue.use(Row);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Input);

//window.bus = new Vue(); //事件总线

const routes = [
    { path: '/1', component: Collection },
    { path: '/2', component: Rank },
    { path: '/3', component: CateGory },
    { path: '/4', component: Me }
]
const router = new VueRouter({
    routes
});

const elem = document.getElementById('app');

const vm = new Vue({
    el:elem,
    router,
    components: [
        Collection,
        Rank,
        CateGory,
        Me
    ],
    mounted(){
        document.getElementById('loading').style.display='none';        
    }
});

router.push(routes[0]); //初始化操作