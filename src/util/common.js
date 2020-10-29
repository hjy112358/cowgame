let base='192.168.199.101:8082';
let requestUrl={
		startGame:'http://'+base+'/game/startGame',  //开始游戏
		websocketUrl:'ws://'+base+'/webSocket/',  //websocket地址
		finishGame:'http://'+base+'/game/getGameScore' ,//结束游戏
		exitRoom:'http://'+base+'/game/user_exitRoom',//退出房间
		isFriend:'http://'+base+'/friendlist/isFrined'//判断是否是好友
	}


export{
	requestUrl
}