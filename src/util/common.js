let base='192.168.199.101:8083';
// let base='192.168.199.112:8083';
let requestUrl={
		baseConfig:'http://'+base+'/getConfig',  //基础参数
		getUserDetail:'http://'+base+'/user/getUserDetails',//获取用户详情
		websocketUrl:'ws://'+base+'/webSocket4NN/',  //websocket地址
		finishGame:'http://'+base+'/game/getGameScore' ,//结束游戏
		exitRoom:'http://'+base+'/viproom/getOutRoom',//退出房间
	}
export{
	requestUrl
}