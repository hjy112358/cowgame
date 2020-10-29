import judgeCards from './judgeCards.js'
import analyzeCards from './analyzeCards.js'

/**
 * hintCards   提示牌型，根据上家出的牌，给出当前牌面中合适的出牌
 * @param {array} previousCards - 上家出的牌
 * @param {array} allCards - 当前拥有的牌面
 * @return {array} res - 返回提示可以出的牌面
 */
function hintCards(previousCards, allCards) {
	let res = null;
	let prevCards = previousCards.length && judgeCards(previousCards).status ? judgeCards(previousCards) : null; //上家牌型
	let canHintCards = []; //还未被提示过的牌


	// 筛选出当前能提示的牌型
	allCards.forEach(item => {
		if (item.isHint) {
			canHintCards.push(item)
		}
	})

	let analCards = analyzeCards(canHintCards); //分析后的当前牌型

	// console.log(analCards);

	if (!prevCards) {
		// 1.如果上家不出牌，从单张开始提示
		if (analCards._one.length) {
			// 从单张里面找
			res = analCards._one[0]
			changeState(res, allCards)
		} else if (analCards._pairs.length) {
			// 从对子里面找
			res = analCards._pairs[0]
			changeState(res, allCards)
		} else if (analCards._three.length) {
			// 从三根里面找
			res = analCards._three[0]
			changeState(res, allCards)
		} else if (analCards._bomb.length) {
			// 从炸弹里面找
			res = analCards._bomb[0]
			changeState(res, allCards)
		} else if (analCards._kingBomb.length) {
			// 从王炸里面找
			res = analCards._kingBomb[0]
			allCards.forEach(item => {
				if (item.card == 16 || item.card == 17) {
					item.isHint = false
				}
			})
		}
	} else {
		// 2.如果上家出牌，按照出牌类型进行寻找，或者判断是否有王炸

		if (prevCards.cardKind == 'BOMB') {
			// 上家出炸弹
			if (analCards._bomb.length) {
				analCards._bomb.forEach(item => {
					if (item[0] > prevCards.val && !res) {
						res = item
						changeState(res, allCards)
					}
				})
			}
			if (analCards._kingBomb.length && !res) {
				res = analCards._kingBomb[0]
				allCards.forEach(item => {
					item.isHint = false
				})
			}
		} else if (prevCards.cardKind == "KINGBOMB") {
			// 上家出王炸
			res = null
		} else {
			// 在对方不出炸弹的情况下
			if (prevCards.cardKind == 'ONE') {
				// 上家出单张
				// 单张里面找
				analCards._one.forEach(item => {
					if (item[0] > prevCards.val && !res) {
						res = item
						changeState(res, allCards)
					}
				})

				// 对子里面找
				if (!res) {
					analCards._pairs.forEach(item => {
						if (item[0] > prevCards.val && !res) {
							res = [item[0]]
							changeState(res, allCards)
						}
					})
				}

				// 三张里面找
				if (!res) {
					analCards._three.forEach(item => {
						if (item[0] > prevCards.val && !res) {
							res = [item[0]]
							changeState(res, allCards)
						}
					})
				}
			} else if (prevCards.cardKind == 'PAIRS') {
				// 上家出对子
				// 对子里面找
				analCards._pairs.forEach(item => {
					if (item[0] > prevCards.val && !res) {
						res = item
						changeState(res, allCards)
					}
				})

				// 三张里面找
				if (!res) {
					analCards._three.forEach(item => {
						if (item[0] > prevCards.val && !res) {
							res = item.slice(0, 2)
							changeState(res, allCards)
						}
					})
				}

			} else if (prevCards.cardKind == 'THREE' && analCards._three.length) {
				// 上家出三根
				analCards._three.forEach(item => {
					if (item[0] > prevCards.val && !res) {
						res = item
						changeState(res, allCards)
					}
				})
			} else if (prevCards.cardKind == 'THREE_ONE' && analCards._three.length) {
				// 上家出三带一

				if (analCards._one.length || analCards._pairs.length) {
					analCards._three.forEach(item => {
						if (item[0] > prevCards.val && !res) {
							// 先确定三根
							res = item
							changeState(res, allCards)
							// 确定一张，从单张和对子里面找
							if (analCards._one.length) {
								res.push(analCards._one[0][0])
							} else if (analCards._pairs.length) {
								res.push(analCards._pairs[0][0])
							}
						}
					})
				} else {
					// 在没有单张和对子的情况下,去三张里面找
					if (analCards._three.length >= 2) {
						analCards._three.forEach((item, index) => {
							if (index && item[0] > prevCards.val && !res) {
								res = analCards._three[0].slice(0, 1)
								res = res.concat(item)
								changeState(item, allCards)
							}
						})
					}
				}
			} else if (prevCards.cardKind == 'THREE_TWO' && analCards._three.length) {
				// 上家出三带二

				if (analCards._pairs.length) {
					analCards._three.forEach(item => {
						if (item[0] > prevCards.val && !res) {
							// 先确定三根
							res = item
							changeState(res, allCards)
							// 确定对子，对子里面找
							res = res.concat(analCards._pairs[0])
						}
					})
				} else {
					// 在没有对子的情况下,去三张里面找
					if (analCards._three.length >= 2) {
						analCards._three.forEach((item, index) => {
							if (index && item[0] > prevCards.val && !res) {
								res = analCards._three[0].slice(0, 2)
								res = res.concat(item)
								changeState(item, allCards)
							}
						})
					}
				}
			} else if (prevCards.cardKind == 'PROGRESSION' && analCards._progression.length) {
				analCards._progression.forEach(item => {
					// 上家出顺子
					if (item.length >= prevCards.size) {
						item.forEach((v, index) => {
							if (v + prevCards.size - 1 > prevCards.val && v + prevCards.size - 1 <= item[item.length - 1] && !res) {
								res = item.slice(index, prevCards.size + index)
								changeState([v], allCards)
							}
						})
					}
				})
			} else if (prevCards.cardKind == "PROGRESSION_PAIRS" && analCards._progressionPairs.length) {
				// 上家出连对
				analCards._progressionPairs.forEach(item => {
					if (item.length >= prevCards.size) {
						item.forEach((v, index) => {
							if (v + (prevCards.size / 2) - 1 > prevCards.val && v + (prevCards.size / 2) - 1 <= item[item.length - 1] && !res) {
								res = item.slice(index, prevCards.size + index)
								changeState([v, v], allCards)
							}
						})
					}
				})
			} else if (prevCards.cardKind == "PLANE" && analCards._plane.length) {
				// 上家出飞机
				analCards._plane.forEach(item => {
					if (item.length >= prevCards.size) {
						item.forEach((v, index) => {
							if (v + (prevCards.size / 3) - 1 > prevCards.val && v + (prevCards.size / 3) - 1 <= item[item.length - 1] && !res) {
								res = item.slice(index, prevCards.size + index)
								changeState([v, v, v], allCards)
							}
						})
					}
				})
			} else if (prevCards.cardKind == "PLANE_ONE" && analCards._plane.length) {
				// 上家出飞机带单
				// 判断单张和对子的数量大于飞机中单张的数量
				// if (analCards._one.length + analCards._pairs.length * 2 >= prevCards.size / 4) {
				analCards._plane.forEach(item => {
					if (item.length >= prevCards.size / 4 * 3) {
						item.forEach((v, index) => {
							// 先找出飞机部分
							if (v + (prevCards.size / 4) - 1 > prevCards.val && v + (prevCards.size / 4) - 1 <= item[item.length - 1] && !res) {
								res = item.slice(index, prevCards.size / 4 * 3 + index)
								changeState([v, v, v], allCards)
								// 在单张或者对子中找出两张单牌
								analCards._one.forEach(k => {
									if (res.length < prevCards.size) {
										res.push(k[0])
									}
								})
								// 单张牌数不够，到对子里面找
								if (res.length < prevCards.size) {
									analCards._pairs.forEach(k => {
										k.forEach(i => {
											if (res.length < prevCards.size) {
												res.push(i)
											}
										})
									})
								}

								analCards = analyzeCards(allCards)

								// 对子里面不够，去三张里面找
								if (res.length < prevCards.size) {
									analCards._three.forEach(k => {
										k.forEach(i => {
											let isthree = item.findIndex(val => i == val)
											if (res.length < prevCards.size && isthree == -1) {
												res.push(i)
											}
										})
									})
								}

								if (res.length < prevCards.size) {
									res = null
								}
							}

						})
					}
				})
				// }
			} else if (prevCards.cardKind == "PLANE_PAIRS" && analCards._plane.length) {
				// 上家出飞机带双
				// 判断对子的数量大于飞机的数量
				// if (analCards._pairs.length >= prevCards.size / 5) {
				analCards._plane.forEach(item => {
					if (item.length >= prevCards.size / 5 * 3) {
						item.forEach((v, index) => {
							// 先找出飞机部分
							if (v + (prevCards.size / 5) - 1 > prevCards.val && v + (prevCards.size / 5) - 1 <= item[item.length - 1] && !res) {
								res = item.slice(index, prevCards.size / 5 * 3 + index)
								changeState([v, v, v], allCards)
								// 找出对子
								analCards._pairs.forEach(k => {
									if (res.length < prevCards.size) {
										res = res.concat(k)
									}
								})

								// 对子里面不够去三张里面找
								if (res.length < prevCards.size) {
									analCards._three.forEach(k => {
										k.forEach(i => {
											let isthree = item.findIndex(val => i == val)
											if (res.length < prevCards.size && isthree == -1) {
												res.push(i, i)
											}
										})
									})
								}
							}
						})
					}
				})
				// }
			} else if (prevCards.cardKind == "FOUR_TWO" || prevCards.cardKind == "FOUR_PAIRS") {
				// 上家出四带二或者出四带两对，找炸弹
				if (analCards._bomb.length && !res) {
					analCards._bomb.forEach(item => {
						res = item
						changeState(item, allCards)
					})
				} else if (analCards._kingBomb.length && !res) {
					res = analCards._kingBomb[0]
					allCards.forEach(item => {
						item.isHint = false
					})
				}
			}

			// 上家不出炸弹且没有牌可以接的情况下找炸弹
			if (!res) {
				if (analCards._bomb.length) {
					res = analCards._bomb[0]
					changeState(res, allCards)
				} else if (analCards._kingBomb.length) {
					res = analCards._kingBomb[0]
					allCards.forEach(item => {
						item.isHint = false
					})
				}
			}
		}

	}

	// 所有提示出完后，isHint全部变成true，重新开始提示
	if (!res) {
		allCards.forEach(item => {
			item.isHint = true
		})
	}

	// console.log(res);
	return res;
}


/**
 * changeState  遍历所有牌面的信息，改变牌的isHint属性
 * @param {array} res 
 * @param {array} allCards 
 */
function changeState(res, allCards) {
	allCards.forEach(item => {
		if (item.card == res[0]) {
			item.isHint = false
		}
	})
}

export default hintCards