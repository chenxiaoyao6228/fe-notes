const Koa = require('koa')
const KoaStatic = require('koa-static')

const app = new Koa()

// 执行命令时的路径
const rootPath = process.cwd()
app.use(KoaStatic(rootPath))

app.listen(8000, () => {
    console.log("mini-vite server启动成功！", );
})