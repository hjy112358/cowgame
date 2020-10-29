import analyzeCards from './analyzeCards';
import {
	valCount,
	getMaxVal,
	sortCard
} from './util.js'


// judgeCards -- 判断牌型的方法
/**
 * 传入一组牌，如果判断结果为错误牌型则返回status:false，牌型正确返回一个对象，对象有三个属性
 * @param  {list} cards - 要判断的牌
 * @return {object} -返回牌型结果
 *    status: 牌型是否正确
 *    cardKind：牌型；
 *    val：牌型大小，顺子连对之类都是以最大牌为牌型大小，三带一之类都是以三根的牌大小为牌型大小；
 *    size：记录这组牌的长度
 */
function judgeCards(objArr) {

	let res = {
		status: false
	}; //默认结果是status:false，错误牌型
	let len = objArr.length;
	let cards = []; //根据出的牌的信息，获取牌面数字数组

	objArr.forEach((item) => {
		cards.push(parseInt(item.card))
	})
	// console.log(cards)


	// 按牌的数量分别判断
	switch (len) {
		case 1:
			res = {
				status: true,
				cardKind: "ONE",
				val: cards[0],
				size: len,
			};
			break;
		case 2:
			if (isPairs(cards)) {
				res = {
					status: true,
					cardKind: "PAIRS",
					val: cards[0],
					size: len,
				};
			} else if (isKingBomb(cards)) {
				res = {
					status: true,
					cardKind: "KINGBOMB",
					val: getMaxVal(cards, 1),
					size: len,
				};
			} else {
				res = {
					status: false
				};
			}
			break;
		case 3:
			res = isThree(cards) ? {
				status: true,
				cardKind: "THREE",
				val: cards[0],
				size: len,
			} : {
				status: false
			};
			break;
		case 4:
			if (isThreeWithOne(cards)) {
				res = {
					status: true,
					cardKind: "THREE_ONE",
					val: getMaxVal(cards, 3),
					size: len,
				};
			} else if (isBomb(cards)) {
				res = {
					status: true,
					cardKind: "BOMB",
					val: cards[0],
					size: len,
				};
			} else {
				res = {
					status: false
				};
			}
			break;
		default:
			if (isThreeWithTwo(cards)) {
				res = {
					status: true,
					cardKind: "THREE_TWO",
					val: getMaxVal(cards, 3),
					size: len,
				};
			} else if (isProgression(cards)) {
				res = {
					status: true,
					cardKind: "PROGRESSION",
					val: getMaxVal(cards, 1),
					size: len,
				};
			} else if (isProgressionPairs(cards)) {
				res = {
					status: true,
					cardKind: "PROGRESSION_PAIRS",
					val: getMaxVal(cards, 2),
					size: len,
				};
			} else if (isPlane(cards)) {
				res = {
					status: true,
					cardKind: "PLANE",
					val: getMaxVal(cards, 3),
					size: len,
				};
			} else if (isPlaneWithOne(cards, objArr)) {
				res = {
					status: true,
					cardKind: "PLANE_ONE",
					val: getMaxVal(analyzeCards(objArr)._plane[0], 3),
					size: len,
				};
			} else if (isPlaneWithTwo(cards)) {
				res = {
					status: true,
					cardKind: "PLANE_PAIRS",
					val: getMaxVal(cards, 3),
					size: len,
				};
			} else if (isFourWithTwo(cards)) {
				res = {
					status: true,
					cardKind: "FOUR_TWO",
					val: getMaxVal(cards, 4),
					size: len,
				};
			} else if (isFourWithPairs(cards)) {
				res = {
					status: true,
					cardKind: "FOUR_PAIRS",
					val: getMaxVal(cards, 4),
					size: len,
				};
			} else {
				res = {
					status: false
				}
			}
			break;
	}
	return res;
}

// 1.判断是否是对子
function isPairs(arr) {
	return arr.length == 2 && arr[0] === arr[1];
}

// 2.判断是否是三不带(三张相同的牌)
function isThree(arr) {
	return arr.length == 3 && arr[0] === arr[1] && arr[1] === arr[2];
}

// 3.判断是否是三带一
function isThreeWithOne(arr) {
	if (arr.length == 4) {
		let c = valCount(arr);
		return c.length == 2 && (c[0].count == 3 || c[1].count == 3);
	} else {
		return false;
	}
}

// 4.判断是否是三带二
function isThreeWithTwo(arr) {
	if (arr.length == 5) {
		let c = valCount(arr);
		return c.length == 2 && (c[0].count == 3 || c[1].count == 3);
	} else {
		return false;
	}
}

// 5.判断是否是顺子
function isProgression(arr) {
	if (arr.length < 5 || arr.length > 12) {
		return false;
	} else {
		let sortArr = sortCard(arr);
		for (let i = 0; i < sortArr.length - 1; i++) {
			if (sortArr[i + 1] - 1 != sortArr[i]) return false;
		}
	}
	return true;
}

// 6.判断是否是连对
function isProgressionPairs(arr) {
	if (arr.length < 6 || arr.length > 24) {
		return false;
	}
	let vCount = valCount(sortCard(arr));
	for (let i = 0; i < vCount.length; i++) {
		if (vCount[i].count != 2) return false;
		else if (
			i < vCount.length - 1 &&
			vCount[i + 1].val - 1 != vCount[i].val
		)
			return false;
	}
	return true;

}

// 7.判断是否是飞机
function isPlane(arr) {
	if (arr.length < 6 || arr.length > 36) {
		return false;
	} else {
		let vCount = valCount(sortCard(arr));
		for (let i = 0; i < vCount.length; i++) {
			if (vCount[i].count != 3 || vCount[i].val > 14) return false;
			else if (
				i < vCount.length - 1 &&
				vCount[i + 1].val - 1 != vCount[i].val
			)
				return false;
		}
		return true;
	}
}

// 8.判断是否是飞机带单
function isPlaneWithOne(arr, objArr) {
	let analCards = analyzeCards(objArr)
	// 有其他牌型则返回false
	if (analCards._bomb.length || analCards._kingBomb.length) {
		return false;
	}
	if (analCards._plane.length == 1) {
		if (analCards._plane[0].length / 3 == analCards._three.length - 1) {
			// 如果牌数为12，且均为三根，例如：333444555777
			return true
		} else {
			// 没有多一个三根的情况
			if (analCards._plane[0].length / 3 == analCards._one.length + analCards._pairs.length * 2) {
				return true
			}
		}
	} else {
		return false;
	}


	/* let c = valCount(sortCard(arr));
	let threeList = [];
	let threeCount = arr.length / 4;

	c.forEach((item) => {
		if (item.count == 3) {
			threeList.push(item);
		}
	});

	if (threeList.length != threeCount || threeList[threeCount - 1] > 14) {
		return false;
	}

	// 判断三根是否连续
	for (let i = 0; i < threeList.length - 1; i++) {
		if (threeList[i].val + 1 != threeList[i + 1].val) return false;
	}
	return true; */
}

// 9.判断是否是飞机带双
function isPlaneWithTwo(arr) {
	if (arr.length < 10 || arr.length % 5 != 0) return false;

	let c = valCount(sortCard(arr));
	let threeList = [];
	let pairsList = [];
	let groupCount = arr.length / 5;

	c.forEach((item) => {
		if (item.count == 3) {
			threeList.push(item);
		} else if (item.count == 2) {
			pairsList.push(item);
		} else {
			return false;
		}
	});

	if (
		threeList.length != groupCount ||
		pairsList.length != groupCount ||
		threeList[groupCount - 1].val > 14
	)
		return false;

	// 检测三根是否连续
	for (let i = 0; i < threeList.length - 1; i++) {
		if (threeList[i].val + 1 != threeList[i + 1].val) return false;
	}

	return true;
}

// 10.判断是否是四带二

function isFourWithTwo(arr) {
	let c = valCount(arr);

	if (arr.length != 6 || c.length > 3) return false;
	for (let i = 0; i < c.length; i++) {
		if (c[i].count == 4) return true;
	}

	return false;
}

// 11.判断是否是四带两个对子
function isFourWithPairs(arr) {
	let c = valCount(arr);
	let pairsList = [];

	c.forEach((item) => {
		if (item.count == 2) {
			pairsList.push(item);
		}
	});

	if (arr.length == 8 && c.length == 3 && pairsList.length == 2)
		return true;
	return false;
}

// 12.判断是否是炸弹
function isBomb(arr) {
	return (
		arr.length == 4 &&
		arr[0] == arr[1] &&
		arr[0] == arr[2] &&
		arr[0] == arr[3]
	);
}

// 13.判断是否是王炸
function isKingBomb(arr) {
	return arr.length == 2 && arr[0] + arr[1] == 33;
}



export default judgeCards