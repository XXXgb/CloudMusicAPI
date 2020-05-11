//连接数据库
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/CloudMusicDB',{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
//数据库连接的对象
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('数据库连接成功')
});


/*const mysql = require('mysql')

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'user',
	password: '123'
})

connection.connect(err=>{
	if(err){
		console.log("err:"+err)
	}else{
		console.log('数据库连接成功')
	}
})*/