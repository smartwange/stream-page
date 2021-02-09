const {src,dest,parallel,watch, series} =require('gulp')
const gulpLoadPlugins = require('gulp-load-plugins')
const browser = require('browser-sync')
const del = require('del')
const plugins = gulpLoadPlugins()
const style=()=>{
  // cwd指定要从哪个目录下找，默认根目录
  return src(config.build.paths.styles,{base:config.build.src,cwd:config.build.src}).pipe(plugins.sass()).pipe(dest(config.build.temp))
  .pipe(bs.reload({stream:true}))
}
const scripts = ()=>{
  return src(config.build.paths.scripts,{base:config.build.src,cwd:config.build.src})
  // 这时不能直接使用presets:['@babel/preset-env'],因为生成后的项目中没有babel模块，
  // require方式载入会先到这个构建项目中找
  .pipe(plugins.babel({presets:[require('@babel/preset-env')]}))
  .pipe(dest(config.build.dist))
}
const page = ()=>{
  return src(config.build.paths.pages,{base:config.build.src,cwd:config.build.src}).pipe(plugins.swig({ data:config.data, defaults: { cache: false } })).pipe(dest(config.build.temp)).pipe(bs.reload({stream:true}))
}
const cwd = process.cwd()
// config文件应该是根据项目不同个性化的数据
let config={
  // default config
  build:{
    src:'src',
    dist:'dist',
    temp:'temp',
    public:'public',
    paths:{
      styles:'assets/styles/**',
      scripts:'assets/scripts/**',
      pages:'*.html',
      images:'assets/images/**',
      fonts:'assets/fonts/**'
    }
  }
}
try {
  const loadConfig=require(`${cwd}/page.config.js`)
  config=Object.assign({},config,loadConfig)
} catch (error) {
  console.log(error)
}

const useref = ()=>{
  return src(config.build.paths.pages,{base:config.build.src,cwd:config.build.src})
  .pipe(plugins.useref({searchPath:[config.build.temp,'.']}))
  .pipe(plugins.if(/\.css$/,plugins.cleanCss()))
  .pipe(plugins.if(/\.js$/,plugins.uglify()))
  .pipe(plugins.if(/\.html$/,plugins.htmlmin({collapseWhitespace:true,minifyCSS:true,minifyJS:true})))  //htmlmin默认只是去除空白字符
  .pipe(dest(config.build.dist))
}
const bs = browser.create()
const serve = ()=>{
  watch(config.build.paths.styles,{cwd:config.build.src},style)
  watch(config.build.paths.scripts,{cwd:config.build.src},scripts)
  watch(config.build.paths.pages,{cwd:config.build.src},page)
  watch([
    config.build.paths.images,
    config.build.paths.fonts
  ],{cwd:config.build.src},bs.reload)
  watch([
    '**'
  ],{
    cwd:config.build.paths.pages
  },bs.reload)
  bs.init({
    notify:false,  //关闭浏览器右上角是否启动browser-sync提示
    port:5000,    //默认3000
    open:false, //默认true自动打开浏览器
    server:{
      baseDir:[config.build.temp,config.build.src,config.build.public],
      routes:{
        '/node_modules':'node_modules'
      },
    }
  })
}
const clean=()=>{
   return del([config.build.dist,config.build.temp])
}
const complie = parallel(style,scripts,page)
const develop = series(complie,serve)
const build = series(clean,complie,useref)
module.exports={
  develop,
  clean,
  build
}
