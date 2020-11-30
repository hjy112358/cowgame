<template>
  <div class="userinfobox">
    <div class="userhead" v-if="usermsg">
      <div class="bankerhead" v-if='usermsg.isbanker'>
        <img src="/static/image/banker.png" alt />
      </div>
      <img :src="usermsg.avatar" alt />
    </div>
    <div class="userhead" v-else>
      <div class="nouser">?</div>
    </div>
    <div class="info" v-if="usermsg">
      <p>
        <!-- <i class="user"></i> -->
        <span>{{ usermsg.nickName }}</span>
      </p>
      <p class="doup">
        <!-- <i class="dou"></i> -->
        <span>{{ usermsg.goldCoin | moneyFilter }}</span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    usermsg: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {};
  },
  filters: {
    moneyFilter(value) {
      if (value >= 10000) {
        return (value / 10000).toFixed(2) + `万`;
      } else {
        return value;
      }
    }
  },
  mounted() {},
 
};
</script>
<style lang="less" scoped>
@imgurl-pre: "/static/image";
.userinfobox {
  // background: pink;
  position: relative;
  .userhead {
    width: 0.3rem;
    height: 0.3rem;
    background: #025f7c;
    position: relative;
    border: 0.03rem solid rgba(232, 139, 58, 0.8);
    border-radius: 0.04rem;
    img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .nouser {
      text-align: center;
      line-height: 0.3rem;
      color: #fff;
      font-size: 0.2rem;
    }
    .bankerhead {
      position: absolute;
      top: -0.1rem;
      left: -0.1rem;
      z-index: 2;
      width: 0.3rem;
      height: 0.3rem;
      img {
        width: 0.3rem;
        height: 0.3rem;
      }
    }
  }

  .info {
    width: 0.8rem;
    padding: 0.02rem 0;
    font-size: 0.12rem;
    color: rgba(255, 255, 255, 1);
    background: url("@{imgurl-pre}/infobg.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    p {
      // width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        // display: inline-block;
        // width: 0.7rem;
        max-width: 0.7rem;
        padding-right: 0.1rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-left: 0.05rem;
        line-height: 16px;
      }

      .dou {
        width: 0.15rem;
        height: 0.15rem;
        background: url("@{imgurl-pre}/dou.png") no-repeat;
        background-size: 100%;
        background-position: center;
      }

      .user {
        width: 0.15rem;
        height: 0.15rem;
        background: url("@{imgurl-pre}/user.png") no-repeat;
        background-size: 100%;
        background-position: center;
      }
    }
  }

  // 横排样式
  &.userinfo-row {
    width: 1.2rem;
    height: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  // 竖排样式
  &.userinfo-col {
    // height: 0.6rem;
    width: 0.8rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
}
</style>