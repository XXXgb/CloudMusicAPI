const express=require('express')
const connect = require('./db/connect.js')
//引入body-parser来解析post请求体
var bodyParser = require('body-parser')
const app=express()
//路由
const register = require('./router/userRouter.js')
const userCollectRouter = require('./router/userCollectRouter.js')
const indexDetailRouter = require('./router/indexDetailRouter.js')
const fileRouter = require('./router/fileRouter.js')
const allCommentsRouter = require('./router/allCommentsRouter.js')
const path = require('path')


//使用body-parser来解析x-www-form-urlencoded格式的请求体
app.use(bodyParser.urlencoded({ extended: false }))
//使用body-parser来解析json格式的请求体
app.use(bodyParser.json())
//设置跨域请求头  一个中间件设置跨域  主要是Access-Control-Allow-Origin字段 允许的访问源
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    //res.header("Content-Type", "application/json;charset=utf-8");
    next();
})

app.use('/public',express.static(path.join(__dirname,'./static')))


app.use('/user',register)
app.use('/music',userCollectRouter)
app.use('/capture',indexDetailRouter)
app.use('/file',fileRouter)
app.use('/allComments',allCommentsRouter)

console.log(__dirname)
app.listen(3000,()=>{
	console.log('server start123')
})