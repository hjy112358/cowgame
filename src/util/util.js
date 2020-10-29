/**
 * 牌统计，统计各个牌有多少张，比如2张A，一张8
 * @param  {list} cards - 要统计的牌
 * @return {object array} val：值，count：数量
 */
function valCount(cards) {
	var result = [];
	for (var i = 0; i < cards.length; i++) {
		addCount(result, cards[i]);
	}

	function addCount(result, v) {
		for (var i = 0; i < result.length; i++) {
			if (result[i].val == v) {
				result[i].count++;
				return;
			}
		}
		result.push({
			val: v,
			count: 1
		});
	}

	return result;
}

/**
 * 获取指定张数的最大牌值
 * @param  {list} cards - 牌
 * @param  {list} cards - 张数
 * @return 值
 */
function getMaxVal(cards, n) {
	var c = valCount(cards);
	var max = 0;
	c.forEach(function(v) {
		if (v.count === n && v.val > max) {
			max = v.val;
		}
	});
	return max;
}

/**
 * 数组从小到大排序
 * @param {array} cards - 牌
 * @return {array} - 排序后的牌面数组
 */
function sortCard(arr) {
	let min;
	for (let i = 0; i < arr.length - 1; i++) {
		for (let j = i + 1; j < arr.length; j++) {
			if (arr[i] > arr[j]) {
				min = arr[j];
				arr[j] = arr[i];
				arr[i] = min;
			}
		}
	}
	return arr;
}


/**
 * 找出数组中连续的数字
 * @param {array} 数组
 * @return {array} 连续数字组成的数组
 */
function arrange(source) {
	var t;
	var ta;
	var r = [];

	for (var j = 0; j < source.length; j++) {
		var v = source[j];
		if (v != null) {
			//console.log(t, v);   // 跟踪调试用
			if (t === v) {
				ta.push(t);
				t++;
				continue;
			}

			ta = [v];
			t = v + 1;
			r.push(ta);
		}
	}

	return r;
}


export {
	valCount,
	getMaxVal,
	sortCard,
	arrange
}
