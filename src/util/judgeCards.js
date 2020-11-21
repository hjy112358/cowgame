// judgeCards -- 判断牌型的方法
/**
 * 传入一组牌，如果判断结果为错误牌型则返回status:false，牌型正确返回一个对象，对象有三个属性
 * @param  {list} cards - 要判断的牌
 * @return {object} -返回牌型结果
 *    status: 是否有牛
 *    cardKind：牛型
 *    cardSort:按照牌型以及相应的大小排序
 *    kindvalue: //牌型大小顺序
 */

//  五小>五花>四炸>牛牛>牛数（9～1）>无牛
//  五花>五小>四炸>牛牛>牛数（9～1）>无牛
function judgeCards(objArr) {
	// var arr = objArr.concat();
	var soracrd = sortCard(objArr);
	var returnmsg = {
		status: false,
		cardKind: null,
		cardSort: soracrd,
		kindvalue: null
	};
	var isflower = is5flower(soracrd);
	if (isflower.status) {
		console.log('is5flower')
		// 五花 都是JQK  cowFlower   kindvalue:5
		returnmsg = isflower
	} else {
		var ismall = is5small(soracrd)
		if (ismall.status) {
			console.log('is5small')
			// 五小 5张牌点数加起来小于10 ，每张牌都在5以下 cowSmall   kindvalue:6
			returnmsg = ismall
		} else {
			var isBoom = isboom(soracrd);
			if (isBoom.status) {
				console.log('isboom')
				// 四炸 有四张一样的牌不需要判别有没有牛  cowBoom kindvalue:4
				returnmsg = isBoom
			} else {
				var iscow = cowNum(soracrd);
				if (iscow.status) {
					console.log('cowNum')
					// 无牛 任意三张牌和不是10的整数倍    null kindvalue:1
					// 有牛1-9 任意三张牌和是10的整数倍，另外两张的和不是，则用另外两张和的个位数作为牛数 牛数 cow+数  kindvalue:2
					// 牛牛 任意三张牌的和是10的整数倍，另外两张的和也是   iscow  kindvalue:3
					returnmsg = iscow;
				}
			}
		}
	}
	return returnmsg
}

// 是否有牛
function cowNum(objarr) {
	var arr = objarr.concat();
	var sum = 0;
	var sumold = 0;
	var group = [];
	var returnmsg = {
		status: false,
		cardKind: null,
		cardSort: arr,
		kindvalue: 1
	};
	for (var i = 0; i < arr.length; i++) {
		sumold += arr[i].cardNum
	}
	for (var i = 0; i < arr.length - 2; i++) {
		sum = sumold;
		for (var j = i + 1; j < arr.length - 1; j++) {
			for (var k = j + 1; k < arr.length; k++) {
				if ((arr[i].cardNum + arr[j].cardNum + arr[k].cardNum) % 10 == 0) {
					sum = sum - (arr[i].cardNum + arr[j].cardNum + arr[k].cardNum);
					var groupChild = [arr[i], arr[j], arr[k], sum];
					group.push(groupChild)
				}
			}
		}
	}
	console.log(group)
	var groupcows = [];
	var num = 0;
	for (var i = 0; i < group.length; i++) {
		if (group[i][3] % 10 == 0) {
			groupcows[num++] = 0;
		} else {
			groupcows[num++] = group[i][3] % 10;
		}
	}
	if (groupcows.length > 0) {
		if (groupcows.indexOf(0) != '-1') {
			var three = groupcows.indexOf(0)
			var changeorder = changesort(arr, group[three])
			returnmsg = {
				status: true,
				cardKind: 'cows',
				cardSort: changeorder,
				kindvalue: 3
			};
		} else {
			var newgroup = groupcows;
			newgroup = sortCard(newgroup)[newgroup.length - 1];
			var index = groupcows.indexOf(newgroup);
			console.log(index)
			var changeorder = changesort(arr, group[index])
			returnmsg = {
				status: true,
				cardKind: 'cow' + newgroup,
				cardSort: changeorder,
				kindvalue: 2
			};
		}
		console.log(returnmsg);
	}


	return returnmsg
}

// 是否有牛
function cowNum1(objarr) {
	var arr = objarr.concat();
	var sum = 0;
	var returnmsg = {
		status: false,
		cardKind: null,
		cardSort: [],
		kindvalue: null
	};
	for (var i = 0; i < arr.length; i++) {
		sum += arr[i].cardNum
	}
	for (var i = 0; i < arr.length - 2; i++) {
		for (var j = i + 1; j < arr.length - 1; j++) {
			for (var k = j + 1; k < arr.length; k++) {
				if ((arr[i].cardNum + arr[j].cardNum + arr[k].cardNum) % 10 == 0) {
					sum = sum - (arr[i].cardNum + arr[j].cardNum + arr[k].cardNum);
					var changeorder = changesort(arr, [i, j, k])
					if (sum % 10 == 0) {
						returnmsg = {
							status: true,
							cardKind: 'cows',
							cardSort: changeorder,
							kindvalue: 3
						};
						return returnmsg
					} else {
						returnmsg = {
							status: true,
							cardKind: 'cow' + sum % 10,
							cardSort: changeorder,
							kindvalue: 2
						};
						return returnmsg
					}

				}
			}
		}
	}

	returnmsg = {
		status: false,
		cardKind: null,
		cardSort: arr,
		kindvalue: 1
	};
	return returnmsg
}

// 四炸 有四张一样的牌不需要判别有没有牛
function isboom(objarr) {
	var arr = objarr.concat();
	var returnmsg = {
		status: false,
		cardKind: null,
		cardSort: [],
		kindvalue: null
	};
	var which4 = [];
	for (var i = 0; i < arr.length; i++) {
		var count = 0;
		for (var j = i; j < arr.length; j++) {
			if (arr[i].cardNum == arr[j].cardNum) {
				count++;
				which4[0] = arr[i].cardNum;
			}
		}

		if (count == 4) {
			var changeorder = changesortBoom(arr, which4);
			returnmsg = {
				status: true,
				cardKind: 'cowBoom',
				cardSort: changeorder,
				kindvalue: 4
			};

		}
	}
	return returnmsg
}


// 五花 都是JQK
function is5flower(objarr) {
	var returnmsg = {
		status: false,
		cardKind: null,
		cardSort: [],
		kindvalue: null
	};
	var arr = objarr.concat();
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].cardNum < 10) {
			return returnmsg
		}
	}
	returnmsg = {
		status: true,
		cardKind: 'cowFlower',
		cardSort: arr,
		kindvalue: 5
	};
	return returnmsg
}

// 五小 5张牌点数加起来小于10 ，每张牌都在5以下
function is5small(objarr) {
	var arr = objarr.concat();
	var returnmsg = {
		status: false,
		cardKind: null,
		cardSort: [],
		kindvalue: null
	};
	var sum = 0;
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].cardNum > 5) {
			return returnmsg
		} else {
			sum += arr[i].cardNum;
		}
	}
	if (sum < 10) {
		returnmsg = {
			status: true,
			cardKind: 'cowSmall',
			cardSort: arr,
			kindvalue: 6,
			sumkids: sum
		};
	}
	return returnmsg

}


// 排序
function sortCard(arr) {
	var min;
	for (var i = 0; i < arr.length - 1; i++) {
		for (var j = i + 1; j < arr.length; j++) {
			if (arr[i].cardValue < arr[j].cardValue) {
				min = arr[j];
				arr[j] = arr[i];
				arr[i] = min;
			}
		}
	}
	for (var i = 0; i < arr.length - 1; i++) {
		for (var j = i + 1; j < arr.length; j++) {
			if (arr[i].cardValue == arr[j].cardValue && arr[i].cardColor < arr[j].cardColor) {
				min = arr[j];
				arr[j] = arr[i];
				arr[i] = min;
			}
		}
	}
	return arr;
}

// 根据牌型排序
function changesort(arr, checkarr) {
	console.log(arr);
	console.log(checkarr)
	// arr 原数组
	// checkarr 特殊牌
	var newarr = checkarr.splice(0, checkarr.length - 1);
	var min;

	// for (var i = 0; i < checkarr.length; i++) {
	// 	newarr.push(arr[checkarr[i]])
	// }

	for (var j = 0; j < newarr.length; j++) {
		for (var k = 0; k < arr.length; k++) {
			if (arr[k].cardValue == newarr[j].cardValue && arr[k].cardColor == newarr[j].cardColor) {
				arr.splice(k, 1)
			}
		}
	}
	newarr = sortCard(newarr);
	arr = sortCard(arr);
	var newreturn = newarr.concat(arr);
	for (var i = 0; i < newreturn.length - 1; i++) {
		for (var j = i + 1; j < newreturn.length; j++) {
			if (newreturn[i].cardValue == newreturn[j].cardValue && newreturn[i].cardColor < newreturn[j].cardColor) {
				min = newreturn[j];
				newreturn[j] = newreturn[i];
				newreturn[i] = min;
			}
		}
	}
	return newreturn
}

// 四炸重新排列
function changesortBoom(arr, which) {
	var newarr = [];
	var last = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].cardNum == which) {
			newarr.push(arr[i]);
		} else {
			last.push(arr[i])
		}
	}
	console.log(newarr)
	var newreturn = newarr.concat(last);
	return newreturn
}



export default judgeCards