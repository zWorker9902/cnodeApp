
/* gulp项目的配置文件 */
var gulp = require('gulp'); // 本地安装的gulp用到的地方

// 调用模块并实例化
var $ = require('gulp-load-plugins')(); //gulp-load-plugins[模块化管理插件]

var open = require('open');

var app = {
    srcPath: 'www/',
    buildPath: 'build/',
    destPath: 'dest/'
};

gulp.task('clean', function(){
    gulp.src([app.buildPath, app.destPath])
        .pipe($.clean());
});

gulp.task('lib', function(){
    gulp.src(app.srcPath + 'lib/**/*')
        .pipe(gulp.dest(app.buildPath + 'lib'))
        .pipe(gulp.dest(app.destPath + 'lib'))
        .pipe($.connect.reload()); //  刷新浏览器：高级浏览器支持
});

gulp.task('html', function(){
    gulp.src(app.srcPath + "**/*.html")
        .pipe(gulp.dest(app.buildPath))
        .pipe(gulp.dest(app.destPath))
        .pipe($.connect.reload());
});

gulp.task('image', function(){
    gulp.src(app.srcPath + "image/**/*")
        .pipe($.imagemin({progressive: true}))
        .pipe(gulp.dest(app.buildPath + 'image'))
        .pipe(gulp.dest(app.destPath + 'image'))
        .pipe($.connect.reload());
});

gulp.task('css', function(){
   gulp.src(app.srcPath + 'css/**/*.scss')
       .pipe($.sass())
       .pipe($.concat('index.css')) //合并css
       .pipe(gulp.dest(app.buildPath + 'css'))
       .pipe($.minifyCss())
       .pipe($.rename({suffix:'.min'})) //设置压缩文件名
       .pipe(gulp.dest(app.destPath + 'css'))
       .pipe($.connect.reload());
});

// 图片压缩
gulp.task('js', function(){
   gulp.src(app.srcPath + 'js/**/*.js')
       // .pipe($.requirejsOptimize({
   //     mainConfigFile: app.srcPath + 'js/main.js',
       // exclude: [
       //     'jquery',
       //     'angular',
       //     'angular-route',
       //     'controllerModel'
       // ]
   // }))
       .pipe($.concat('app.js'))   //合并js
       .pipe(gulp.dest(app.buildPath))
       .pipe($.uglify())
       .pipe(gulp.dest(app.destPath))
       .pipe($.connect.reload())
});

gulp.task('build', ['js', 'lib', 'html', 'image', 'css']);

gulp.task('serve', ['build'], function(){
   $.connect.server({
       root: [app.buildPath],
       livereload: true,
       port: 1234
   });

   open('http://localhost:1234');
});

gulp.task('default', ['serve']);

// cnpm install gulp-load-plugins --save-dev