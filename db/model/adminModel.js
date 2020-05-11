const mongoose = require('mongoose')
//Schema对象
var adminSchema = mongoose.Schema({
	//用户名
	user: {type: String},
	//密码
	password: {type: String},
	//昵称
	nickName: {type: String}

})

var adminModel = mongoose.model('admins', adminSchema)

module.exports = adminModel