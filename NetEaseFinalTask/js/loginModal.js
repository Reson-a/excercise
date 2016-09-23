(function(_) {
    var template = '<div class="m-login">\
        <div class="g-align"></div>\
        <form class="g-align">\
            <span id="login-close">×</span>\
            <h2></h2>\
            <input type="text" id="userName">\
            <input type="password" id="password">\
            <p class="s-invalid"></p>\
            <button type="submit" id="login-submit">登录</button>\
        </form>\
    </div>';

    function LoginModal(options) {
        if (options) _.extend(this, options);
        this.container = this.container || document.body;

        this.loginModal = this._layout.cloneNode(true);
        this.form = this.loginModal.querySelector('form'),
            this.title = this.loginModal.querySelector('h2'),
            this.close = this.loginModal.querySelector('#login-close'),
            this._userName = this.loginModal.querySelector('#userName'),
            this._password = this.loginModal.querySelector('#password'),
            this.invalidHint = this.loginModal.querySelector('p');
        this.loginbtn = this.loginModal.querySelector('#login-submit');


        this.titleName = this.titleName || '登录';
        this.placeholder = this.placeholder || { //设置placeholder显示的字，预防产品死抠字眼
            userName: '用户名',
            password: '密码'
        };
        this.pattern = this.pattern || {
            userName: '^\\S{5,12}$',
            password: '^\\S{6,20}$'
        }

        this._init();

        this.container.appendChild(this.loginModal);
    }
    _.extend(LoginModal.prototype, _.emitter);
    _.extend(LoginModal.prototype, {
        //模板转换为节点
        _layout: _.html2node(template),

        //初始化
        _init: function() {
            this.form.action = this.action;
            this.form.method = this.method;
            this.title.innerText = this.titleName;
            this._updateHolder();

            addEvent(this.close, 'click', this._close.bind(this));
            addEvent(this.form, 'submit', this._login.bind(this));
            addEvent(this._userName, 'blur', this._userNameValidity.bind(this));
            addEvent(this._password, 'blur', this._passwordValidity.bind(this));
        },

        //关闭登录Modal
        _close: function() {
            this.container.removeChild(this.loginModal);
        },

        //更新placeholder内容
        _updateHolder: function() {
            this._userName.placeholder = this.placeholder.userName;
            this._password.placeholder = this.placeholder.password;
        },

        //用户名验证，返回true即为验证通过
        _userNameValidity() {
            if (new RegExp(this.pattern.userName).test(this._userName.value)) return true;
            if (this._userName.value === '') this.invalidHint.innerText = '请输入您的账号';
            else this.invalidHint.innerText = '用户名必须为5-12位';
            return false;
        },

        //密码验证，返回true即为验证通过  
        _passwordValidity() {
            if (new RegExp(this.pattern.password).test(this._password.value)) return true;
            if (this._password.value === '') this.invalidHint.innerText = '请输入您的密码';
            else this.invalidHint.innerText = '密码为6-20位，必须包含字母和数字';
            return false;
        },

        //清楚提示文本
        _clearHint: function() {
            this.invalidHint.innerText = '';
        },

        //获取提交参数
        _getOptions: function() {
            return {
                userName: hex_md5(this._userName.value),
                password: hex_md5(this._password.value)
            }
        },

        //登录回调
        _callback: function(responseText) {
            if (responseText == 1) {
                this.sucCallback && this.sucCallback();
                this._close();
            } else {
                this.failCallback && this.failCallback();
                this.invalidHint.innerText = '用户名或密码错误，请重新输入';
                this.loginbtn.disabled = false; //恢复submit按钮
            }
        },

        //提交事件
        _login: function(event) {
            event.preventDefault(); //取消表单默认提交
            if (this._userNameValidity() && this._passwordValidity()) { //表单验证通过即发送ajax请求
                this.loginbtn.disabled = true; //禁用按钮防止重复提交
                if (this.form.method === 'post') post(this.form.action, this._getOptions(), this._callback.bind(this));
                else get(this.form.action, this._getOptions(), this._callback.bind(this)); //默认为get提交方式
            }
            return false;
        }
    });

    window.LoginModal = LoginModal;
}(utils))