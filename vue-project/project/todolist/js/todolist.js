Vue.component('todolist-component', {
    template: '#todolist-template',

    props: { //外部传入参数,参数的变化不会反映在html里
        //一个图片地址数组
        todolist: {
            type: Array
                //required: true,
        },
        holder: {
            type: String,
            default: '请输入一项任务'
        }

    },
    methods: {
        addItem: function() {
            if (this.item) this.todos.push(this.item);
            this.item = '';
        },
        delItem: function(index) {
            this.todos.splice(index, 1);
            this.selected.splice(index, 1);
        }
    },
    data: function() {
        return {
            todos: this.todolist, //data里的数据
            selected: [], //为了处理有多个todo可能名称相同的情况，selected存储index而非todo
            item: '',
            selectedStyle: {
                textDecoration: 'line-through'
            },
            flStyle: {
                float: 'left'
            },
            epStyle: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
            }
        }
    },
    computed: {
        selectedStyleList: function() {
            return this.todos.map(function(item, index) {
                if (this.selected.indexOf(index) >= 0) return this.selectedStyle;
                else return {};
            }.bind(this));
        }
    }
});

var vm = new Vue({
    el: "#todolist-container"
})