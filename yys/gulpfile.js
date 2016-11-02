// 引入 gulp
var gulp = require('gulp');

// 引入组件
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
//var notify = require('gulp-notify');
var stripCssComments = require('gulp-strip-css-comments');
//var plumber = require('gulp-plumber');
//var gutil = require('gulp-util');
var cssbeautify = require('cssbeautify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cssmin = require('gulp-minify-css');
var browserSync = require('browser-sync').create();
var image = require('gulp-image');
var imgSrc = 'source/images/*';
var imgDest = 'dist/pages/images';
var htmlmin = require('gulp-htmlmin');
var spriter = require('gulp-css-spriter');
var cssBase64 = require('gulp-css-base64');

//压缩图片
gulp.task('image', function () {
    gulp.src('./img/*')
        .pipe(image({
            optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('./img'));
});

// 检查脚本
gulp.task('lint', function () {
    gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 编译Sass
gulp.task('sass', function () {
    gulp.src('./css/*.scss')
        .pipe(sass())
        /*{
                noCache: true,
                compass: false,
                bundleExec: true,
                sourcemap: true
        }*/
        // 去掉css注释
        .pipe(stripCssComments())
        // auto prefix  
        .pipe(autoprefixer({
            browsers: [
                'last 2 versions',
                'Edge >= 11',
                'Safari >= 5',
                'Firefox >= 20',
                'ie >= 8',
                'Opera >=12',
                'iOS >= 6',
                'Android >= 4.0'
            ]
        }))
        // css格式化、美化（因为有f2ehint，故在此不再做语法等的检查与修复）  
        /*.pipe(mapStream(function (file, cb) {
            // 添加css代码的格式化  
            var cssContent = file.contents.toString();
            if (/\.(css|sass|scss)/.test(path.extname(file.path))) {
                file.contents = new Buffer(cssbeautify(cssContent, {
                    indent: '    ',
                    openbrace: 'end-of-line',
                    autosemicolon: true
                }));
            }
            cb(null, file);
        }))*/
        .pipe(gulp.dest('./css'));
});

//读取JS文件，合并，输出到新目录，重新命名，压缩，输出
gulp.task('scripts', function () {
    gulp.src('./js/*.js')
        .pipe(concat('all.js'))
        //.pipe(gulp.dest('./dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});


//读取CSS文件，合并，输出到新目录，重新命名，压缩，输出
gulp.task('styles', function () {
    gulp.src('./css/*.css')
        .pipe(concat('all.css'))
        //.pipe(gulp.dest('./dist'))
        .pipe(spriter({
            'spriteSheet': './dist/img/sprite.png', //生成的spriter的位置
            'pathToSpriteSheetFromCSS': '../img/sprite.png' //生成样式文件图片引用地址的路径
        }))
        /*.pipe(cssBase64({
            //baseDir: "./img",// 有绝对路径时在配置此选项
            //extensions: ['png'],
            //maxImageSize: 50 * 1024, // bytes
            maxWeightResource: 20 * 1024,
            extensionsAllowed: ['.gif', '.jpg', '.png']
        }))*/
        .pipe(rename('all.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/css'));
});

//压缩HTML
gulp.task('htmlmin', function () {
    gulp.src('./index.html')
        .pipe(htmlmin({
            removeComments: true, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
            collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS})) //设置是够压缩html文件 true
        }))
        .pipe(gulp.dest('./dist'));
});

//服务器插件中，监视文件并自动刷新
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});


// 默认任务
gulp.task('default', function () {
    gulp.run('lint', 'scripts', 'sass', 'styles', 'htmlmin');
    gulp.run('serve');

    // 监听js文件变化
    gulp.watch('./js/*.js', ['lint', 'scripts']);
    // 监听scss文件变化
    gulp.watch('./css/*.{scss,sass}', ['sass', 'styles']);
    // 浏览器重新加载
    gulp.watch(['./js/*.js', './css/*.css', './*.html'], function () {
        browserSync.reload();
    });
});