import {
	valCount,
	getMaxVal,
	sortCard,
	arrange
} from './util.js'


/**
 *  analyzeCards  分析牌型，优先级依次是:王炸>炸弹>三顺>顺子>连对>三根>对子>单张
 *  @params {Array} allCards - 手中剩余所有牌的对象数组
 *  @return {object}  - 返回所有正确牌型的可能性
 *      _one:单张牌的数组
 *      _two:对子数组
 *      .......以此类推
 */
function analyzeCards(allCards) {
	let allArr = []; //所有牌面数字数组
	let target = []; //拷贝一份排序好的牌来使用
	let vCount = []; //统计整理后的对象数组
	let res = {
		_one: [],
		_pairs: [],
		_three: [],
		_plane: [],
		_progression: [],
		_progressionPairs: [],
		_kingBomb: [],
		_bomb: []
	} //返回分析牌型的结果

	let wipeB = []; //去除炸弹后的牌面

	allCards.forEach((item) => {
		allArr.push(parseInt(item.card));
	});
	target = sortCard(allArr.slice(0))
	vCount = valCount(target);

	// 判定是否有王炸
	if (target.slice(-2)[0] + target.slice(-2)[1] == 33) {
		res._kingBomb.push([16, 17])
	}

	// 判定炸弹
	vCount.forEach((item) => {
		if (item.count == 4) {
			res._bomb.push([item.val, item.val, item.val, item.val])
		} else {
			target.forEach(v => {
				if (v == item.val)
					wipeB.push(v)
			})
		}
	})

	// 判定三根，用于判定三顺
	vCount.forEach((item) => {
		if (item.count == 3) {
			res._three.push([item.val, item.val, item.val])
		}
	})

	// 判断三顺
	let threeNum = []; //所有三顺的数字
	vCount.forEach(item => {
		if (item.val < 15 && item.count == 3) {
			threeNum.push(item.val)
		}
	})
	arrange(threeNum).forEach(item => {
		if (item.length > 1) {
			let arr = []
			item.forEach(v => {
				arr.push(v, v, v)
			})
			res._plane.push(arr)
		}
	})

	// 判断顺子
	let wipeBNum = []; //去除炸弹后所有的数字
	vCount.forEach((item) => {
		if (item.count < 4 && item.val < 15) {
			wipeBNum.push(item.val)
		}
	})
	arrange(wipeBNum).forEach(item => {
		if (item.length >= 5) {
			res._progression.push(item)
		}
	})

	// 判断对子
	let pairsNum = []; //对子的数字
	vCount.forEach(item => {
		if (item.count == 2) {
			res._pairs.push([item.val, item.val])
			if (item.val < 15) {
				pairsNum.push(item.val)
			}

		}
	})

	// 判断连对
	arrange(pairsNum).forEach(item => {
		if (item.length > 2) {
			let arr = []
			item.forEach(v => {
				arr.push(v, v)
			})
			res._progressionPairs.push(arr)
		}
	})

	// 判断单张
	vCount.forEach(item => {
		// if (item.count == 1 && res._kingBomb.length == 0) {
		if (item.count == 1 ) {
			res._one.push([item.val])
		}
	})

	return res;
}

export default analyzeCards