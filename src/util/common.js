let base='192.168.199.101:8083';
let requestUrl={
		// startGame:'http://'+base+'/game/startGame',  //开始游戏
		getUserDetail:'http://'+base+'/user/getUserDetails',//获取用户详情
		websocketUrl:'ws://'+base+'/webSocket4NN/',  //websocket地址
		// finishGame:'http://'+base+'/game/getGameScore' ,//结束游戏
		// exitRoom:'http://'+base+'/game/user_exitRoom',//退出房间
	}
export{
	requestUrl
}