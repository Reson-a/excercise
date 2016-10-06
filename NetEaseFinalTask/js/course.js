//课程组件
(function (_) {
    var template = {
        //普通课程模板
        courseTemplate: '<li class="f-fl m-course">\
                             <a href="#" target="_blank">\
                                 <img src="" alt="">\
                                 <h3 class="f-ep">课程名称</h3>\
                                 <p><span class="provider">机构名称</span><br><span class="count">人数</span><br><strong>价格</strong></p>\
                             </a>\
                         </li>',
        //课程详细信息模板
        detailTemplate: '<li class="m-detail"><a href="#" target="_blank"><img src="" alt="" class="f-fl">\
                                 <h3 class="f-ep">课程名称</h3>\
                                 <p><span class="count">人数</span>人在学<br></p>\
                                 <p>发布者：<span class="provider">机构名称</span><br>\
                                 分类：<span class="category">分类名称</span></p>\
                                 <p class="description">描述</p>\
                              </a></li>',
        //热门排行模板
        hotTemplate: '<li>\
                          <a href="#" target="_blank">\
                              <img src="" alt="" class="f-fl">\
                              <h3 class="f-ep">课程名称</h3>\
                              <span class="count">人数</span>\
                         </a>\
                     </li>'
    };

    function Course(options) {
        if (options) _.extend(this, options);

        //确定模板
        this.template = this.template ? template[this.template] : template.courseTemplate;

        //选择相关节点
        this.container = this.container || document.body;
        this.course = this._getLayout().cloneNode(true);
        this.link = this.course.querySelector('a');
        this.image = this.course.querySelector('img');
        this._name = this.course.querySelector('h3');
        this._provider = this.course.querySelector('.provider');
        this._learnerCount = this.course.querySelector('.count');
        this._price = this.course.querySelector('strong');
        this._categoryName = this.course.querySelector('.category');
        this._description = this.course.querySelector('.description');

        //为自定义内容提供默认值        
        this.baseLink = this.baseLink || 'http://study.163.com/course/introduction/';
        this.contentOptions = this.contentOptions || { id: '', name: '', price: '', bigPhotoUrl: '' };

        this._init();
        this.container.appendChild(this.course);
    }

    _.extend(Course.prototype, {
        //获取节点的方法，使用前必须先确定模板
        _getLayout: function () {
            return _.html2node(this.template);
        },

        //初始化方法，根据参数操作相关节点
        _init: function () {
            for (var key in this.contentOptions) { //参数中未被定义的键不会被操作,以此实现不同模板使用同样的init方法而不会报错
                var value = this.contentOptions[key];
                switch (key) { //不同键的不同处理方式,写在switch里更加直观便于修改
                    case 'id':
                        this.link.href = this.baseLink + value + '.htm';
                        break;
                    case 'price':
                        this._price.innerText = this.contentOptions.price ? '¥ ' + this.contentOptions.price : '免费';
                        break;
                    case 'categoryName':
                        this._categoryName.innerText = this.contentOptions.categoryName || '无';
                        break;
                    case 'bigPhotoUrl':
                    case 'middlePhotoUrl':
                    case 'smallPhotoUrl':
                        this.image.src = value;
                        break;
                    default:
                        this['_' + key].innerText = value;
                        break;
                }
            }
        },

        //更新课程内容
        update: function (options) {
            _.rewrite(this.contentOptions, options);
            this._init();
        }
    });

    //暴露到全局
    window.Course = Course;

} (utils));