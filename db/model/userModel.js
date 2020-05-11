const mongoose = require('mongoose')
//Schema对象
var registerSchema = mongoose.Schema({
	//用户id
	id: {type: String},
	//用户名
	user: {type: String},
	//密码
	password: {type: String},
	//账号状态
	status: {type: Number,default: 1},
	//昵称
	nickName: {type: String},
	//头像
	headImg: {type: String},
	//个性签名
	signature: {type: String},
	//生日
	brithday: {type: String},
	//性别
	sex: {type: String},
	//手机号
	phoneNumber: {type: String},
	//邮箱
	email: {type: String},
	//收藏列表
	collect: {type: Array},
	//评论
	comments: {type: Array},
	//最近播放
	latelyPlay: {type: Array},
	//注册时间
	addTime: {type: String}

})

var registerModel = mongoose.model('users', registerSchema)

module.exports = registerModel