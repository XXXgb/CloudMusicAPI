
const express = require('express')
const router = express.Router()
//引入userModel模型
const allCommentsModel = require('../db/model/allCommentsModel.js')
const jwt = require('../jwt/jwt.js')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


//添加音乐评论(所有人可见)
router.post('/addComments',(req,res)=>{
	let { _id, songId, singerName,  commentsTime, commentsContent, songName, headImg, nickName} =req.body;
	let comments = [{ _id, singerName, "likeCount":"0", commentsTime, commentsContent, songName, headImg, nickName}]
	//如果没有该歌曲评论，则先插入一条
	allCommentsModel.find({songId})
	.then((data)=>{
		if(data.length === 0){
			//未存在该歌曲
			return allCommentsModel.insertMany({songId,singerName,songName,comments})
		}else{
			//已存在，在该条记录下，更新comments集合
			return allCommentsModel.update({ songId } , { $push:{comments: { $each: comments,$position: 0}}})
		}
	})
	.then((data)=>{
		res.send({err:0,msg:'评论成功'})
	})
	.catch((err)=>{
		res.send(err)
	})
})


//删除评论
router.get('/removeComments',(req,res)=>{
	let { _id, songId, commentsTime} =req.query
	allCommentsModel.update({ songId } , { $pull:{
		"comments": { "_id": _id , "commentsTime": commentsTime}
	}},function(err,data){
		res.send({err:0,msg:'已删除该评论',error:err,data:data})
	})
})


//查询个人评论(所有人可见)
router.get('/findComments',(req,res)=>{
	let { songId} = req.query
	allCommentsModel.find({ songId })
	.then( data => {
		//筛选出songId相同的评论
		res.send(data[0].comments)
	})
	.catch( err => {
		res.send(err)
	})
})




module.exports = router