const express = require('express')
const router = express.Router()
const multer = require('multer')


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  	//文件路径
    cb(null, './static/img')
  },
  filename: function (req, file, cb) {
  	//文件名
  	let ext = file.originalname.split('.')[1]
  	let tmpname = (new Date()).getTime()
    cb(null, `${tmpname}.${ext}`);
  }
})

var upload = multer({ storage: storage })


router.post('/upload',upload.single('headImg'),(req,res)=>{
	let url =  `/public/img/${req.file.filename}`
	res.json({err: 0 , msg: '上传成功' , headImg: url})
})

module.exports = router
