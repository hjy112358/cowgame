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
	if (lastype.cardKind == yourtype.cardKind) {
		res = compareGrade(lastype.val, yourtype.val);
		return res;
	} else {
		// 牌型不一致  
		// 1.上家是王炸,false
		// 2.上家是炸弹,我是王炸true  我是炸弹比较大小
		// 3.我是炸弹或者王炸true
		// 集中判断是否王炸，免得多次判断王炸
		if (lastype.cardKind == 'KINGBOMB') {
			// 上家王炸，肯定不能出
			return false;
		} else if (lastype.cardKind == 'BOMB') {
			// 我王炸，肯定能出
			if (yourtype.cardKind == 'KINGBOMB') {
				return true
			} else if(yourtype.cardKind == 'BOMB'){
				res = compareGrade(lastype.val, yourtype.val);
				return res;
			}

		}else{
			if(yourtype.cardKind == 'BOMB' || yourtype.cardKind == 'KINGBOMB' ){
				return true
			}else{
				return false
			}
			
		}

	}
}


// 判断牌的大小
function compareGrade(last, your) {
	return last < your;
}


export default follow
