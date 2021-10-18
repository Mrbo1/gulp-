let {series,parallel,src,dest,watch}=require('gulp');
let fileInclude=require('gulp-file-include');
let clean=require('gulp-clean');
let webserver=require('gulp-webserver');
let sass=require('gulp-sass')(require('sass'))
//清理任务
function cleanTask(){
    return src('./dist', { allowEmpty: true })
    .pipe(clean());

}
//代码片段任务
function fileTask(){
    return src('./src/views/*.html')
    .pipe(fileInclude({
        prefix: '@', 
        basepath: './src/views/templates' 
    }))
    .pipe(dest('./dist/views'))
}
//服务器任务
function webTask(){
    return src('./dist')
            .pipe(webserver({
                livereload: true,     
                open: './views/index.html', 
                port: 3000,
                host: 'localhost'
            }));

}
// css预处理任务
function scssTask(){
    return src('./src/css/**')
    .pipe(sass())
    .pipe(dest('./dist/css'))
}
//同步静态资源
function staticTask(){
    return src('./src/static/**')
    .pipe(dest('./dist/static'))
}
//同步第三方库
function libTask(){
    return src('./src/lib/**')
    .pipe(dest('./dist/lib'))
}
//同步api
function apiTask(){
    return src('./src/api/**')
    .pipe(dest('./dist/api'))
}
//监听任务
function watchTask(){
    watch('./src/views/**',fileTask)
    watch('./src/api/**',apiTask)
    watch('./src/static/**',staticTask)
    watch('./src/lib/**',libTask)
    watch('./src/css/**',scssTask)
}
module.exports={
    dev:series(cleanTask,parallel(fileTask,staticTask,apiTask,libTask,scssTask),
    parallel(webTask,watchTask))
}