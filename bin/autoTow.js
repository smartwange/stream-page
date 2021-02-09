#!/usr/bin/env node
// console.log('这是cli文件')
// gulp命令去运行gulpfile.js文件的配置是在node_modules/gulp/bin/gulp，所以直接请求这个路径就是运行gulp
// 通过process.argv通过给命令行传递参数就能指定gulpfile.js文件
process.argv.push('--cwd')
process.argv.push(process.cwd()) //要生成文件的目录是执行命令行的项目目录
process.argv.push('--gulpfile')
process.argv.push(require.resolve('..')) //找到上级目录就是当前项目根目录。他会自动把package.json中的main属性值加载进来

// 需要重新unlink、link才会把新建配置注册全局
require('gulp/bin/gulp')
