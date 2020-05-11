
const express = require('express')
const router = express.Router()
//引入userModel模型
const userModel = require('../db/model/userModel.js')
const jwt = require('../jwt/jwt.js')
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
//收藏、取消收藏操作
router.get('/collect',(req,res)=>{
	let {_id,songId,songName,singerName,addTime} = req.query
	userModel.find({ _id })
	.then((data)=>{
		if(data.length != 0){   //找到了当前登陆的用户
			return userModel.find({ _id ,"collect.songId": songId})		
		}else{   //未找到当前登陆用户
			res.send({err:-1,msg:'未找到当前用户'})
		}
	})
	.then((data) => {
		if(data.length != 0){  //取消收藏
			userModel.update({ _id } , { $pull:{
				"collect": { "songId": songId }
			}},function(err,data){
				res.send({err:1,msg:'已取消收藏'})
			})
		}else{  //收藏
			let collect = [{songId,songName,singerName,addTime}]
			userModel.update({ _id } , { $push:{
				collect: { $each: collect,$position: 0}
			}},function(err,data){
				res.send({err:0,msg:'收藏成功'})
			})
		}
	})
})

//查询收藏音乐操作
router.get('/find/collect',(req,res)=>{
	let { _id } = req.query
	userModel.find({ _id })
	.then((data)=>{
		console.log(data)
		res.send(data[0].collect)
	}).catch( err => {
		console.log(err)
	})
})

//添加音乐评论
router.post('/addComments',(req,res)=>{
	let { _id, songId, singerName, likeCount, commentsTime, commentsContent, songName} =req.body;
	let comments = [{ songId, singerName, likeCount, commentsTime, commentsContent, songName}]
	userModel.update({ _id } , { $push:{
		comments: { $each: comments,$position: 0}
	}},function(err,data){
		res.send({err:0,msg:'评论成功'})
	})
})

//删除评论
router.get('/removeComments',(req,res)=>{
	let { _id, songId, commentsTime} =req.query
	userModel.update({ _id } , { $pull:{
		"comments": { "songId": songId , "commentsTime": commentsTime}
	}},function(err,data){
		res.send({err:0,msg:'已删除该评论',error:err,data:data})
	})
})

//查询个人评论
router.get('/findComments',(req,res)=>{
	let { _id, songId} = req.query
	userModel.find({ _id , "comments.songId": songId})
	.then( data => {
		let result = [];
		//筛选出songId相同的评论
		console.log(data)
		for(let i = 0; i < data[0].comments.length; i++){
			if(data[0].comments[i].songId == songId){
				result.push(data[0].comments[i]);
			}
		}	
		res.send({result,"nickName": data[0].nickName,"headImg": data[0].headImg});
	})
	.catch( err => {
		res.send(err)
	})
})

//添加个人最近播放
router.post('/addSelfLatelyPlay',(req,res)=>{
	let { _id, songId, songName, singerName, addTime} = req.body;
	let latelyPlay = [{ songId, songName, singerName, addTime }];
	let flag;
	//先判断该歌曲是否已经在最近播放列表中
	userModel.find({ _id ,"latelyPlay.songId": songId})
	.then( data => {
		if(data.length != 0){  //已存在
			//1.先删除
			flag = 0;
			return userModel.update({ _id } , { $pull:{
				"latelyPlay": { "songId": songId }
			}})
		}else{  //未存在
			flag = 1;
			//直接添加
			return userModel.update({ _id } , { $push:{
				latelyPlay: { $each: latelyPlay,$position: 0}
			}})
		}
	})
	.then( data => {
		if(flag === 0){
			//2.再重新添加
			return userModel.update({ _id } , { $push:{
				latelyPlay: { $each: latelyPlay,$position: 0}
			}})
		}else if(flag === 1){
			res.send({err:0,msg:'添加成功'})
		}
	})
	.then( data => {
		res.send({err:0,msg:'添加成功'})
	})
})

//查询个人最近播放
router.get('/getSelfLatelyPlay',(req,res)=>{
	let { _id } = req.query;
	userModel.find({ _id })
	.then( data => {
		res.send(data[0].latelyPlay)
	})
	.catch( err => {
		res.send(err)
	})
})

module.exports = router