// judgeCards -- 判断牌型的方法
/**
 * 传入一组牌，如果判断结果为错误牌型则返回status:false，牌型正确返回一个对象，对象有三个属性
 * @param  {list} cards - 要判断的牌
 * @return {object} -返回牌型结果
 *    status: 是否有牛
 *    cardKind：牛型
 *    cardSort:按照大小排序
 */
function judgeCards(objArr) {
	// 排序
	for (var i = 0; i < objArr.length; i++) {
		objArr[i].value = parseInt(objArr[i].cardValue + parseInt(objArr[i].cardColor));
	}
	var soracrd = sortCard(objArr);
	// 无牛 任意三张牌和不是10的整数倍  -1
	// 有牛1-9 任意三张牌和是10的整数倍，另外两张的和不是，则用另外两张和的个位数作为牛数 牛数
	// 牛牛 任意三张牌的和是10的整数倍，另外两张的和也是  0
	// var hascow =cowNum(soracrd);
	// console.log(hascow)


	// 四炸 有四张一样的牌不需要判别有没有牛
	// var hasboom = isboom(soracrd);
	// console.log(hasboom)

	// 五花 都是JQK
	// var has5flower = is5flower(soracrd);
	// console.log(has5flower)


	// 五小 5张牌点数加起来小于10 ，每张牌都在5以下
	var has5small = is5small(soracrd);
	console.log(has5small)


}

// 是否有牛
function cowNum(objarr) {
	var arr = objarr.concat();
	var sum = 0;
	for (var i = 0; i < arr.length; i++) {
		sum += arr[i].cardNum
	}
	for (var i = 0; i < arr.length - 2; i++) {
		for (var j = i + 1; j < arr.length - 1; j++) {
			for (var k = j + 1; k < arr.length; k++) {
				if ((arr[i].cardNum + arr[j].cardNum + arr[k].cardNum) % 10 == 0) {
					sum = sum - (arr[i].cardNum + arr[j].cardNum + arr[k].cardNum);
					if (sum % 10 == 0) {
						return '0'
					} else {
						return sum % 10;
					}

				}
			}
		}
	}
	return -1
}


// 四炸 有四张一样的牌不需要判别有没有牛
function isboom(objarr) {
	var arr = objarr.concat();
	var res =null; 
	for (var i = 0; i < arr.length;i++) {
		var count = 0;
		for (var j = i; j < arr.length; j++) {
			if (arr[i].cardNum == arr[j].cardNum) {
				count++;
			}
		}
		if(count==4){
			res=arr[i].cardNum;
		}
	}
	return res;
}


// 五花 都是JQK
function is5flower(objarr){
	var arr = objarr.concat();
	for(var i=0;i<arr.length;i++){
		if(arr[i].cardNum<10){
			return false;
		}
	}
	return true
}

// 五小 5张牌点数加起来小于10 ，每张牌都在5以下
function is5small(objarr){
	var arr = objarr.concat();
	var sum=0;
	for(var i=0;i<arr.length;i++){
		if(arr[i].cardNum>5){
			return false;
		}else{
			sum+=arr[i].cardNum;
		}
	}
	if(sum<10){
		return true
	}

}


// 排序
function sortCard(arr) {
	var min;
	for (var i = 0; i < arr.length - 1; i++) {
		for (var j = i + 1; j < arr.length; j++) {
			if (arr[i].value > arr[j].value) {
				min = arr[j];
				arr[j] = arr[i];
				arr[i] = min;
			}
		}
	}
	return arr;
}






export default judgeCards