const mongoose = require('mongoose')
/*创建Schema对象*/
const musicSchema = mongoose.Schema({
	userId: {type:String,require:true},
	songId: {type:Number,require:true},
	songName: {type:String,require:true},
	singerName: {type:String,require:true},
	addTime: {type:String,require:true}
})

var musicModel = mongoose.model('mycoollects',musicSchema)

/*抛出模型*/
module.exports = musicModel