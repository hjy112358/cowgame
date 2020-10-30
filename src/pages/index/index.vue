<template>
  <view class="content">
    <view class="card big cardwrap big-card" v-for="(item,index) in cardlist" :key="index">
      <img :src="item.src" mode />
    </view>
    <button @tap="judge">判断</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 黑桃4   红桃3  梅花2 方块1
      // cardValue 牌面值  J-11 Q-12 K-13
      // cardColor 花色值
      // cardNum 牌值  J-Q-K=10
      cardlist: [
        { cardValue: 1, cardColor: 2, cardNum: 1, src: "../../static/image/card/1-mh.png" },
        { cardValue: 1, cardColor: 2, cardNum: 1 , src: "../../static/image/card/1-mh.png" },
        { cardValue: 13, cardColor: 2, cardNum: 13 , src: "../../static/image/card/13-mh.png" },
        { cardValue: 1, cardColor: 3, cardNum: 1 , src: "../../static/image/card/1-hx.png" },
        { cardValue: 1, cardColor: 2, cardNum: 1 , src: "../../static/image/card/1-mh.png" }
      ]
    };
  },
  created() {
    this.remFn(); //加载rem
  },
  onLoad() {},
  methods: {
    judge() {
      console.log(this.cardlist);
      this.judgeCards(this.cardlist);
    }
  }
};
</script>

<style>
.card img{
	float:left;
	width:1rem;
	height:1rem;
}
button{
	clear:left;
}
</style>
