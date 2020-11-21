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
		var last=lastype.cardSort;
		var yours=yourtype.cardSort;
		if(lastype.kindvalue==6){
			if(lastype.sumkids==yourtype.sumkids){
				// 比谁更小
				for(var i=0;i<last.length;i++){
					if(last[i].cardValue<yours[i].cardValue && last[i].cardColor<yours[i].cardColor){
						return true;
					}
				}
			}else{
				return (lastype.sumkids<yourtype.sumkids)
			}
			
		}else{
			for(var i=0;i<last.length;i++){
				if(last[i].cardValue>yours[i].cardValue && last[i].cardColor>yours[i].cardColor){
					return true;
				}
			}
		}
		
		return false;
	}else{
	// 牌型不一致
		if(lastype.kindvalue&&yourtype.kindvalue){
			if(lastype.kindvalue==yourtype.kindvalue){
				var last=lastype.cardKind;
				var your=yourtype.cardKind;
				return (last.substr(last.length-1,1)>your.substr(your.length-1,1))
				
			}else{
				return (lastype.kindvalue>yourtype.kindvalue)
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





export default follow
