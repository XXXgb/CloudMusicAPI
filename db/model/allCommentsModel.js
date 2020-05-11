const mongoose = require('mongoose')
//Schema对象
var allCommentsSchema = mongoose.Schema({
	songId: {type: String},
	songName: {type: String},
	singerName: {type: String},
	comments: {type: Array}

})

var allCommentsModel = mongoose.model('allComments', allCommentsSchema)

module.exports = allCommentsModel