/**
 * 对战判断
 *  @param  {lastype} -- 上家牌型
 *  @param  {yourtype} -- 牌型 cardKind
 * 	@return {true/false} --是否可以对上家的牌  true 上一家大
 */

// 无分：最大牌的大小-->花色  
// 有分：最大牌的大小-->花色 
// 牛牛：最大牌的大小-->花色
// 四花：最炸弹牌的大小-->花色
// 五花：最大牌的大小-->花色
// 五小：先比点数，单张比最小还是最大？？？

function follow(lastype, yourtype) {
	console.log(lastype);
	console.log(yourtype)

	// 牌型一致
	if(lastype.cardKind==yourtype.cardKind){
		var last=sortCard(lastype.cardSort);
		var yours=sortCard(yourtype.cardSort);
		console.log(last)
		console.log(yours)
		
		if(lastype.kindvalue==6){
			if(parseInt(lastype.sumkids)==parseInt(yourtype.sumkids)){
				// 比谁更小
				for(var i=0;i<last.length;i++){
					if(parseInt(last[i].cardValue)<parseInt(yours[i].cardValue) && parseInt(last[i].cardColor)<parseInt(yours[i].cardColor)){
						return true;
					}
				}
			}else{
				return (parseInt(lastype.sumkids)<parseInt(yourtype.sumkids))
			}
		}else{
			// for(var i=0;i<last.length;i++){
				if(parseInt(last[0].cardValue)>parseInt(yours[0].cardValue) ){
					// console.log('不一样')
					// console.log(last[i])
					// console.log(yours[i])
					return true;
				}else  if(parseInt(last[0].cardValue)==parseInt(yours[0].cardValue)&&parseInt(last[0].cardColor)>parseInt(yours[0].cardColor)){
					// console.log('一样')
					// console.log(last[i])
					// console.log(yours[i])
					return true;
				}
			// }
		}
		return false;
	}else{
	// 牌型不一致
		if(lastype.kindvalue&&yourtype.kindvalue){
			if(parseInt(lastype.kindvalue)==parseInt(yourtype.kindvalue)){
				var last=lastype.cardKind;
				var your=yourtype.cardKind;
				return (parseInt(last.substr(last.length-1,1))>parseInt(your.substr(your.length-1,1)))
				
			}else{
				return (parseInt(lastype.kindvalue)>parseInt(yourtype.kindvalue))
			}
		}else{
			if(lastype.kindvalue){
				return true;
			}else{
				return false;
			}
		}
		
	}
}



// 排序
function sortCard(arr) {
	var min;
	for (var i = 0; i < arr.length - 1; i++) {
		for (var j = i + 1; j < arr.length; j++) {
			if (parseInt(arr[i].cardValue) < parseInt(arr[j].cardValue)) {
				min = arr[j];
				arr[j] = arr[i];
				arr[i] = min;
			}
		}
	}
	for (var i = 0; i < arr.length - 1; i++) {
		for (var j = i + 1; j < arr.length; j++) {
			if (parseInt(arr[i].cardValue) == parseInt(arr[j].cardValue) && parseInt(arr[i].cardColor) < parseInt(arr[j].cardColor)) {
				min = arr[j];
				arr[j] = arr[i];
				arr[i] = min;
			}
		}
	}
	return arr;
}


export default follow
