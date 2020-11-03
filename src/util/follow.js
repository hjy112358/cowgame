/**
 * 对战判断
 *  @param  {lastype} -- 上家牌型
 *  @param  {yourtype} -- 牌型 cardKind
 * 	@return {true/false} --是否可以对上家的牌
 */

// 同类型  直接比较大小
// 不同类型   就只能王炸和炸弹

function follow(lastype, yourtype) {
	var res = true;
	// 牌型一致
	if(lastype.cardKind==yourtype.cardKind){
		

	}else{
	// 牌型不一致
		compareGrade(lastype.kindvalue,yourtype.kindvalue)
	}
}


// 判断牌的大小
function compareGrade(last, your) {
	return last < your;
}

export default follow
