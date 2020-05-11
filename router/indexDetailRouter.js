const express = require('express')
const router = express.Router()
//引入indexDetailModel模型
const indexDetailModel = require('../db/model/indexDetailModel.js')
const jwt = require('../jwt/jwt.js')

//添加推荐歌单
router.post('/indexDetail',(req,res)=>{
	let { _id, id, picUrl, playCount, name} = req.body;
	let songList = [{ id, picUrl, playCount, name}]
	// indexDetailModel.insertMany()
	// .then( data => {
	// 	res.send(data)
	// })
	// .catch( err => {
	// 	res.send(err)
	// })
	indexDetailModel.update({ _id } , { $push:{
		songList
	}},function(err,data){
		res.send({err:0,msg:'推荐歌单添加成功'})
	})
})

//查询推荐歌单
router.get('/getIndexDetail',(req,res)=>{
	let { _id } = req.query;
	indexDetailModel.find({_id})
	.then(data=>{
		res.send(data[0].songList)
	})
})

//添加轮播歌曲
router.post('/addSlideshow',(req,res)=>{
	let { _id, picUrl, targetId } = req.body;
	let slideshow = [{ _id, picUrl, targetId }]
	// indexDetailModel.insertMany()
	// .then( data => {
	// 	res.send(data)
	// })
	// .catch( err => {
	// 	res.send(err)
	// })
	indexDetailModel.update({ _id } , { $push:{
		slideshow
	}},function(err,data){
		res.send({err:0,msg:'轮播歌曲添加成功'})
	})
})

//查询轮播歌曲
router.get('/getSlideshow',(req,res)=>{
	let { _id } = req.query;
	indexDetailModel.find({_id})
	.then(data=>{
		res.send(data[0].slideshow)
	})
})

module.exports = router