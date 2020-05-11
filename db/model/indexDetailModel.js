const mongoose = require('mongoose')
/*创建Schema对象*/
const indexDetailSchema = mongoose.Schema({
	songList: {type: Array},
	slideshow: {type: Array}
})

var indexDetailModel = mongoose.model('indexDetail',indexDetailSchema)

/*抛出模型*/
module.exports = indexDetailModel