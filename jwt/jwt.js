const jwt = require('jsonwebtoken');
//secret为加密token的密钥
const secret = "sl;jfe111]5*-123";

//当登陆时，生成一个token
function creatToken(params){
	return jwt.sign(params,secret,{
     expiresIn:  60*60*24 //到期时间 1天
  })
}
//当执行查询操作时，验证携带的token是否正确
function checkToken(token){
	return new Promise((resolve,reject)=>{
		jwt.verify(token,secret,(err,data)=>{
			if(err){
				reject('验证失败')
			}else{
				resolve(data)
			}
		})
	})
}

module.exports = {
	creatToken,
	checkToken
}