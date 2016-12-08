var goodsData = [{
        name: "矿粉",
        manufacturer: "澳大利亚",
        specification: "GTY45",
        tNum: 1000,
        gNum: 1000,
        pNum: 1,
        accessory: '无'
    },
    {
        name: "粗粉",
        manufacturer: "巴西",
        specification: "FH2323",
        tNum: 300,
        gNum: 300,
        pNum: 1,
        accessory: '无'
    },
    {
        name: "精粉",
        manufacturer: "乌克兰",
        specification: "HJK6688",
        tNum: 1500,
        gNum: 1500,
        pNum: 1,
        accessory: '无'
    },
    {
        name: "热翔",
        manufacturer: "中国",
        specification: "SHIT233",
        tNum: 5000,
        gNum: 5000,
        pNum: 1,
        accessory: '保温装置'
    }
];

var baseItem = {
    name: undefined,
    manufacturer: undefined,
    specification: undefined,
    tNum: undefined,
    gNum: undefined,
    pNum: undefined,
    accessory: undefined
}

function extend(o1, o2) {
    for (var o in o2) {
        o1[o] = o2[o];
    }
    return o1;
}

var vm = new Vue({
    el: document.getElementById('app'),
    data: {
        goodsData: goodsData,
        buttonIndex: 0,
        editIndex: undefined,
        buttons: ['增加', '保存'],
        cancelButtons: ['删除', '取消'],
        newItem: extend({}, baseItem),
        selected: []

    },
    methods: {
        buttonClick: function() {
            if (this.buttonIndex) {
                //保存添加新货物
                if (this.editIndex === undefined) {
                    this.goodsData.push(extend({}, this.newItem));
                    extend(this.newItem, baseItem); //恢复初始状态
                }
                this.editIndex = undefined;
            }
            this.buttonIndex = 1 - this.buttonIndex;

        },
        cancelClick: function() {
            if (!this.buttonIndex) {
                //删除选中的货物
                for (var i = this.selected.length - 1; i >= 0; i--) {
                    var itemIndex = this.selected[i];
                    if (itemIndex != undefined) {
                        this.goodsData.splice(itemIndex, 1);
                        this.selected.splice(i, 1);
                    };
                }
            } else {
                this.buttonIndex = 1 - this.buttonIndex;
            }
            this.editIndex = undefined;
        },
        isEdit: function(index) {
            return index === this.editIndex;
        },
        selectAll: function() {
            for (var i = 0; i < this.goodsData.length; i++) {
                if (this.selected.indexOf(i) < 0) this.selected.push(i);
            }
        }

    },
    watch: {
        goodsData: {
            handler: function() {
                //window.localStorage[goodsData] = JSON.parse(this.goodsData);
            }
        },
    },
    created: function() {
        // `this` points to the vm instance   
    },
    filters: {

    },
    computed: {

    }

});