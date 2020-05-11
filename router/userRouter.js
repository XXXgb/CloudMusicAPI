const express = require('express')
const router = express.Router()
const crypto = require('crypto')
//接收用户的Schema模型
const userModel = require('../db/model/userModel.js')
const adminModel = require('../db/model/adminModel.js')
const allCommentsModel = require('../db/model/allCommentsModel.js')

const jwt = require('../jwt/jwt.js')


//注册
router.post('/reg',(req,res)=>{
	let {id,user,password,phoneNumber,addTime} = req.body
	userModel.find({user})
	.then((data)=>{
		if(data.length === 0){
			//用户名不存在，可以注册
			return userModel.insertMany({user,password:crypto.createHash('sha256').update(password).digest('hex'),phoneNumber,addTime})
		}else{
			res.send({err:-2,msg:'用户名已存在！'})
		}
	})
	.then((data)=>{
		res.send({err:0,msg:'注册成功'})
	})
	.catch((err)=>{
		res.send(err)
	})
})

//登陆
router.post('/login',(req,res)=>{
	let {user,password} = req.body
	userModel.find({user,password:crypto.createHash('sha256').update(password).digest('hex')})
	.then((data)=>{
		if(data.length === 0){
			res.send({err:-1,msg:'用户名或密码错误！'})
		}else{
			if(data[0].status===1){
				const token = jwt.creatToken({user});
				res.send({err:0,msg:'登陆成功',token,_id: data[0]._id,headImg:data[0].headImg,nickName:data[0].nickName})
			}else{
				res.send({err:-2,msg:'账号被封禁！'})
			}	
		}
	})
	.catch((err)=>{
		res.send({err:-1,msg:'内部错误！'})
	})
	
})

//修改个人信息
router.post('/changeSelfInfo',(req,res)=>{
	let { _id, nickName, brithday, sex, phoneNumber, email} = req.body;
	userModel.update({_id},{
		nickName,
		brithday,
		sex,
		phoneNumber,
		email
	})
	.then(data=>{
		res.send({err:0,msg:'修改成功'})
	})
	.catch(err=>{
		res.send({err:-1,msg:'修改失败'})
	})
})

//查询个人信息
router.get('/getSelfInfo',(req,res)=>{
	let { _id } = req.query;
	let result = {};
	userModel.find({ _id })
	.then( data => {
		result = {
			"nickName": data[0].nickName ,
	 		"signature": data[0].signature ,
	 		"brithday": data[0].brithday ,
	 		"sex": data[0].sex ,
	 		"phoneNumber": data[0].phoneNumber ,
	 		"email": data[0].email ,
	 		"headImg": data[0].headImg,
	 		"addTime": data[0].addTime
	 	}
		res.send(result)
	})
	.catch( err => {
		res.send(err)
	})
})

//修改登陆密码
router.post('/changePassword',(req,res)=>{
	let { _id, password, newPassword  } = req.body;
	//先判断原始密码
	userModel.find({_id,password:crypto.createHash('sha256').update(password).digest('hex')})
	.then(res=>{
		if(res.length === 1){
			//再修改密码
			return userModel.update({_id},{password: crypto.createHash('sha256').update(newPassword).digest('hex')})
		}else{
			res.send({err:-1,msg:'当前密码不正确，请重新输入！'})
		}
	})
	.then(data=>{
		res.send({err:0,msg:'修改成功'})
	})
	.catch(err=>{
		res.send({err:-1,msg:'当前密码不正确，请重新输入！'})
	})
})

//保存头像URL
router.post('/saveHeadImgUrl',(req,res)=>{
	let { _id,  headImg} = req.body;
	userModel.update({_id},{
		headImg
	})
	.then(data=>{
		res.send({err:0,msg:'修改成功'})
	})
	.catch(err=>{
		res.send({err:-1,msg:'修改失败'})
	})
})




//管理员注册
router.post('/adminRegister',(req,res)=>{
	let {user,password} = req.body
	adminModel.find({user})
	.then((data)=>{
		if(data.length === 0){
			//用户名不存在，可以注册
			return adminModel.insertMany({user,password:crypto.createHash('sha256').update(password).digest('hex')})
		}else{
			res.send({err:-2,msg:'用户名已存在！'})
		}
	})
	.then((data)=>{
		res.send({err:0,msg:'注册成功'})
	})
	.catch((err)=>{
		res.send(err)
	})
})


//管理员登陆
router.post('/adminLogin',(req,res)=>{
	let {user,password} = req.body
	adminModel.find({user,password:crypto.createHash('sha256').update(password).digest('hex')})
	.then((data)=>{
		if(data.length === 0){
			res.send({err:-1,msg:'用户名或密码错误！'})
		}else{
			res.send({err:0,msg:'登陆成功',nickName:data[0].nickName})	
		}
	})
	.catch((err)=>{
		res.send({err:-1,msg:'内部错误！'})
	})
	
})


//管理员查询普通用户
router.get('/getUser',(req,res)=>{
	let { status , pageCurrent , pageSize , user} = req.query;
	const reg = new RegExp(user, 'i') //不区分大小写
	
	userModel.find({
    $and: [  // 多字段同时匹配
      {$or:[{user:{$regex:reg}},
      		{nickName:{$regex:reg}},
      		{phoneNumber:{$regex:reg}},
      		{email:{$regex:reg}}
      ]},
      {status:status}
    ]
    /*status,
    user: 'x'*/
  	})
  	.skip(Number((pageCurrent-1)*pageSize))
  	.limit(Number(pageSize))
	.then( data => {
		res.send(data)
	})
	.catch( err => {
		res.send(err)
	})
})


//查询用户总数
router.get('/getUserTotal',(req,res)=>{
	let { status , user} = req.query;
	const reg = new RegExp(user, 'i') //不区分大小写
	userModel.find({
    $and: [  // 多字段同时匹配
      /*{user: {$regex:reg}},
      {status:status}*/
      {$or:[{user:{$regex:reg}},
      		{nickName:{$regex:reg}},
      		{phoneNumber:{$regex:reg}},
      		{email:{$regex:reg}}
      ]},
      {status:status}
    ]
    /*status,
    user: 'x'*/
  	})
  	.countDocuments()
	.then( data => {
		res.send({total:data})
	})
	.catch( err => {
		res.send(err)
	})
})

//管理员查询用户详细信息
router.get('/adminGetUserInfo',(req,res)=>{
	let { _id } = req.query;
	let result = {};
	userModel.find({ _id })
	.then( data => {
		result = {
			"nickName": data[0].nickName ,
	 		"signature": data[0].signature ,
	 		"brithday": data[0].brithday ,
	 		"sex": data[0].sex ,
	 		"phoneNumber": data[0].phoneNumber ,
	 		"email": data[0].email ,
	 		"headImg": data[0].headImg,
	 		"addTime": data[0].addTime,
	 		"_id": data[0]._id,
	 		"user": data[0].user,
	 		"status": data[0].status
	 	}
		res.send(result)
	})
	.catch( err => {
		res.send(err)
	})
})


//管理员封禁/解封
router.post('/banned',(req,res)=>{
	let { _id, status } = req.body;
	//先判断原始密码
	if(status == 1){
		//解封
		userModel.updateOne({_id},{
			status: 0
		})
		.then(res=>{
			res.send({err:0,msg:'封禁成功！'})
		})
		.catch(err=>{
			res.send({err:-1,msg:'封禁成功！'})
		})
	}else if(status == 0){
		//解封
		userModel.updateOne({_id},{
			status: 1
		})
		.then(res=>{
			res.send({err:0,msg:'解封成功！'})
		})
		.catch(err=>{
			res.send({err:-1,msg:'解封成功！'})
		})
	}
	
})

//管理员查询所有音乐评论
router.get('/adminGetAllComments',(req,res)=>{
	let { keyword , pageCurrent , pageSize} = req.query;
	const reg = new RegExp(keyword, 'i') //不区分大小写
	allCommentsModel.find({
    $and: [  // 多字段同时匹配
      {$or:[{songId:{$regex:reg}},
      		{songName:{$regex:reg}},
      		{singerName:{$regex:reg}}
      ]}
    ]
    /*status,
    user: 'x'*/
  	})
  	.skip(Number((pageCurrent-1)*pageSize))
  	.limit(Number(pageSize))
	.then( data => {
		res.send(data)
	})
	.catch( err => {
		res.send(err)
	})
})

//管理员查询歌曲总条数
router.get('/getMusicTotal',(req,res)=>{
	let { keyword } = req.query;
	const reg = new RegExp(keyword, 'i') //不区分大小写
	let total = 0;
	allCommentsModel.find({
    $and: [  // 多字段同时匹配
      {$or:[{songId:{$regex:reg}},
      		{songName:{$regex:reg}},
      		{singerName:{$regex:reg}}
      ]},
    ]
  	})
	.then( data => {
		for(let i=0;i<data.length;i++){
			if(data[i].comments.length != 0){
				total += 1;
			}
		}
		res.send({total:total})
	})
	.catch( err => {
		res.send(err)
	})
})

//管理员查询歌曲评论详情
router.get('/adminGetComments',(req,res)=>{
	let { songId , pageCurrent , pageSize} = req.query;
	let result;
	let total;
	let start = (pageCurrent-1)*pageSize;
	let end = (pageCurrent-1)*pageSize+4;
	allCommentsModel.find({
		songId
  	})
	.then( data => {
		result = data[0].comments.slice(start,end)
		total = data[0].comments.length;
		res.send({result,total})
	})
	.catch( err => {
		res.send(err)
	})
})

//管理员删除用户评论
router.get('/adminDeleteComments',(req,res)=>{
	let { songId , _id , commentsTime} = req.query;
	allCommentsModel.update({ songId } , { $pull:{
		"comments": { "_id": _id , "commentsTime":commentsTime}
	}},function(err,data){
		userModel.update({ _id } , { $pull:{
			"comments": { "songId": songId , "commentsTime": commentsTime}
		}},function(err,data){
			res.send({err:0,msg:'移除成功！'})
		})
	})
})


module.exports = router
