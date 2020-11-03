<template>
  <view class="content">
    <view class="card big cardwrap big-card" v-for="(item,index) in cardlist" :key="index">
      <img :src="item.src" mode />
    </view>
    <button @tap="judge">判断</button>
    <view class>
      <view class="card big cardwrap big-card" v-for="(item_1,index_1) in list" :key="index_1">
        <img :src="item_1.src" mode />
      </view>
    </view>
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
        {
          cardValue: 3,
          cardColor: 1,
          cardNum: 3,
          src: "../../static/image/card/3-fk.png"
        },
        {
          cardValue: 2,
          cardColor: 4,
          cardNum: 2,
          src: "../../static/image/card/2-fk.png"
        },
        {
          cardValue: 1,
          cardColor: 2,
          cardNum: 1,
          src: "../../static/image/card/1-mh.png"
        },
        {
          cardValue: 2,
          cardColor: 3,
          cardNum: 2,
          src: "../../static/image/card/2-hx.png"
        },
        {
          cardValue: 3,
          cardColor: 4,
          cardNum: 3,
          src: "../../static/image/card/3-ht.png"
        }
      ],
      list: []
    };
  },
  created() {
    this.remFn(); //加载rem
  },
  onLoad() {},
  methods: {
    judge() {
      // this.judgeCards(this.cardlist)
      this.list = this.judgeCards(this.cardlist).cardSort;
    }
  }
};
</script>

<style>
.card img {
  float: left;
  width: 1rem;
  height: 1rem;
}
button {
  clear: left;
}
</style>
