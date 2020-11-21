<template>
  <view class="content">
    <!-- 用户列表 -->

    <view class="">
      <!-- <slider-range
  :value="rangeValue"
  :min="rangeMin"
  :max="rangMax"
  :step="10"
  :bar-height="3"
  :block-size="26"
  background-color="#EEEEF6"
  active-color="#FF6B00"
  :format="format"
  :decorationVisible="true"
  @change="handleRangeChange"
></slider-range> -->
<VueInputRange :width="200" size="small"></VueInputRange >
    </view>
    <ul class="usersListbox">
      <li
        v-for="(item, index) in usersList"
        class="userbox"
        :key="index"
        :class="`userbox${index + 1}`"
      >
        <!-- 右侧玩家牌面在前 -->
        <div class="cardbox" v-if="item && (index == 5 || index == 6 || index == 7)">
          <div class="operatext" v-show="true">
            <p>{{bankerClist[index]?bankerClist[index].hint:''}}</p>
          </div>
        
          <p class="readytext" v-if='ishowready'>{{readylist[index]&&readylist[index]==1?'准备':''}}</p>
          <div class="imgbox" v-for="(k, k_index) in showCardsList[index]" :key="k_index">
            <!-- <img :src="k.src" alt="" /> -->
            <img src="../../static/image/card/cardBack.png" alt />
          </div>
        </div>

        <!-- 用户头像和昵称组件 -->
        <div v-if="item">
          <!-- 用户头像和昵称组件 -->
          <UserInfo
            :usermsg="item"
            :key="userInfokey"
            :class="`${index % 4 == 0 ? 'userinfo-row' : 'userinfo-col'} ${ index == 4 ? 'myuserinfo' : '' }`"
          ></UserInfo>
        </div>
        <div v-else>
          <UserInfo :usermsg="item"></UserInfo>
        </div>

        <!-- 我的豆子显示区域 -->
        <div class="mymoneybox" v-if="index == 4 && myUser">
          <i class="dou"></i>
          <p>{{ myUser.goldcoin | moneyFilter }}</p>
          <div class="addmoney"></div>
        </div>

        <!-- 左侧玩家牌面在后 -->
        <div
          class="cardbox"
          v-if="item && (index == 0 || index == 1 || index == 2 || index == 3)"
          :class="`${index == 4 ? 'mycardbox' : ''}`"
        >
       
          <div class="operatext" v-show="true">
            <p>{{bankerClist[index]?bankerClist[index].hint:''}}</p>
          </div>
          <p class="readytext" v-if='ishowready'>{{readylist[index]&&readylist[index]==1?'准备':''}}</p>
          <div class="imgbox" v-for="(k, k_index) in showCardsList[index]" :key="k_index">
            <!-- <img :src="k.src" alt="" /> -->
            <img src="../../static/image/card/cardBack.png" alt />
          </div>
        </div>

        <!-- 我的牌面区域 -->
       
        <p
          class="readytextme"
          v-if="item&&ishowready&&index == 4"
        >{{readylist[index]&&readylist[index]==1?'准备':''}}</p>
        <div class="cardbox mycardbox" v-if="item&&index == 4">
          <div class="operatext" v-show="true">
            <p>{{bankerClist[index]?bankerClist[index].hint:''}}</p>
          </div>

          <div class="imgbox" v-for="(k, k_index) in showCardsList[index]" :key="k_index">
            <img src="../../static/image/card/cardBack.png" v-if="k_index==4&&ishowlast" />
            <img :src="k.src" v-else />
          </div>
        </div>
      </li>
    </ul>

    <!-- 底分 -->
    <div class="showDi">
      <p>底分:{{bottomScore}}</p>
    </div>
    <!-- 翻牌 -->
    <div class="optionsbox" v-show="false">
      <div class="btnlist">
        <button @tap="test()">翻牌</button>
      </div>
    </div>
    <!-- 准备游戏按钮 -->
    <div class="readybtn" v-if="!isReady">
      <button @click="clickReady()">准备({{ readyTime }}s)</button>
    </div>
    <!-- 倒计时 -->
    <div class="coutdown" v-show="iscoutdown">
      <span>{{coutdownmsg}}:</span>
      {{counTime}}s
    </div>
    <!-- 显示当前操作信息 -->
    <div class="coutdown" v-show="showmsg">
      <span>{{nowmsg}}</span>
    </div>
    <!-- 抢庄 -->
    <div class="doublebox" v-if="doublebtn">
      <button class="banoption" @tap="chooseB(-1)">不抢</button>
      <button v-for="(key,index) in doublelist" :key="index" @tap="chooseB(key)">{{key}}倍</button>
    </div>
    <!-- 下注-->
    <div class="bet" >
      <!-- v-if="betbtn" -->
      <button v-for="(key,index) in betlist" :key="index" :class="index==0?'banoption':''">{{key}}分</button>
    
    </div>

     

    <!-- 发牌动画 -->
    <div class="anibox" v-if="isAni">
      <div class="ani-item">
        <img src="../../static/image/card/cardBack.png" alt />
      </div>
      <div v-for="(item, index) in shouldAniList" :key="index">
        <transition name="cardani0">
          <div class="ani-item" :class="`ani${item + 1}`" v-if="isShowAni[index]">
            <img src="../../static/image/card/cardBack.png" alt />
          </div>
        </transition>
      </div>
    </div>
  </view>
</template>


<script>
import UserInfo from "../../components/userInfo";
import { requestUrl } from "../../util/common.js";
import SliderRange from '../../components/primewind-sliderrange/components/primewind-sliderrange/index.vue'


export default {
  data() {
    return {
      // 模拟数据
      originUsers: [], // 所有用户信息列表
      originCards: null, // 所有用户的牌面列表

      // 原生传入的当前用户的信息
      userID: "", // 当前页面的userID
      token: "", // 当前页面的token
      roomID: "2001", // 当前房间号
      // 我的信息相关
      myUser: null, // 我的用户信息

      // websocket相关
      websocket: null,

      // 整理后的初始相关数据
      usersList: [null, null, null, null, null, null, null, null], // 用户列表
      cardsList: [], // 牌面列表
      showCardsList: [], // 牌面展示列表

      // 准备游戏相关
      isReady: false, // 是否准备
      readyTime: 30, // 准备倒计时时间
      readyTimer: null, // 准备倒计时定时器
      ishowready:true,//显示ready文字
      readylist: [null, null, null, null, null, null, null, null], //记录准备

      // 发牌动画相关
      isAni: false, // 是否显示动画
      shouldAniList: [], // 需要显示发牌动画的index
      isShowAni: [], // 每张牌的动画是否显示列表
      aniFinish: [], // 记录玩家是否发完牌

      // 基础参数---需后台获取
      bottomScore: 100, //底分
      doublelist: [1, 2, 3, 4], //抢庄倍数参数
      betlist: [10, 20, 30], //下注参数

      // 操作
      coutdownmsg: "抢庄中", //当前操作名称
      iscoutdown: false, //是否显示倒计时
      timer: 10, //倒计时时间
      showmsg: false, //当前操作
      nowmsg: "", //当前操作名称显示

      // 抢庄
      isbanker: [], // 记录抢庄操作的人数
      bankers: [], //存放抢庄的用户id
      counTime: "10", //倒计时
      waitTimeInterval: null, //倒计时
      doublebtn: false, //抢庄按钮
      bankerClist: [], //记录抢庄详情
      bankerId: "", //庄家id
      userInfokey: 0, //控制子组件变化（庄家头像）
      // 下注
      betbtn: false, //下注按钮
      waitbetTimeInterval: null, //倒计时
      betClist: [], //记录下注详情

      // 我的牌
      ishowlast: true, //是否显示最后一张牌true 显示背景   false 显示排面

      rangeMin: 5,
      rangMax: 200,
      rangeValue: [0,50]
    };
  },
  components: {
    UserInfo,
    SliderRange
  },
  onLoad() {},
  created() {
    // 页面自适应
    this.remFn();
  },
  mounted() {
    // 从原生获取信息
    this.getUserInfo();
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
  computed: {
    // 同时监听originUser和myUser
    userWatch() {
      const { originUsers, myUser } = this;
      return {
        originUsers,
        myUser
      };
    },

    // 同时监听用户列表和后端是否发牌
    cardsWatch() {
      const { usersList, originCards } = this;
      return {
        usersList,
        originCards
      };
    }
  },
  watch: {
    // 监听websocket是否创建
    websocket() {
      if (this.websocket) {
        this.websocket.onopen = () => {
          console.log("websocket连接成功");
          // 连接成功后开始准备倒计时
          // ----
          // this.readyFn();
        };
        // websocket连接接受消息
        this.websocket.onmessage = event => {
          let data = JSON.parse(event.data);
          // console.log(data);

          // 获取桌面所有用户信息、牌面，并设置出牌顺序
          if (data.card) {
            // 获取牌
            this.ishowready=false;
            this.originCards = JSON.parse(data.card); // card的结果是个对象，属性名是用户id，属性值是用户的牌
            // console.log("this.originCards", this.originCards);
          }

          // 获取进入用户的信息
          if (data.userInfo) {
            this.originUsers = data.userInfo;
            // console.log("this.originUsers", this.originUsers);
          }

          if (data.funcType == 10) {
            let readyindex = this.readylist.indexOf(data.userId);
            if (readyindex == -1) {
              var which = this.getseat(data.userId);
              this.readylist[which] = 1;
            }
            this.readylist = this.readylist.slice();
          }

          // 客户端发送的消息
          if (data.msg) {
            let msgRes = data.msg;
            // 记录几位玩家发牌完成
            if (msgRes.eventType == "aniFinish") {
              let index = this.aniFinish.indexOf(msgRes.data.uid);
              if (index == -1) {
                this.aniFinish.push(msgRes.data.uid);
              }
            }
            // 抢庄
            else if (msgRes.eventType == "choosebanker") {
              let bankerindex = this.bankers.indexOf(msgRes.data.uid);
              // 存放是否抢庄操作的人
              if (bankerindex == -1) {
                this.bankers.push(msgRes.data.uid);
                var which = this.getseat(msgRes.data.uid);
                this.bankerClist[which].type = msgRes.data.type;
                this.bankerClist[which].hint = msgRes.data.hint;
                this.bankerClist = this.bankerClist.slice(0);
                console.log(this.bankerClist);
              }
              // 存放想要抢庄的人
              if (msgRes.data.type != -1) {
                let isbankerindex = this.isbanker.indexOf(msgRes.data.uid);
                if (isbankerindex == -1) {
                  this.isbanker.push(msgRes.data.uid);
                }
              }
            }
          }
        };

        // 连接关闭的回调方法
        this.websocket.onclose = res => {
          console.log("closeRes", res);
        };

        this.websocket.onerror = res => {
          console.log(res);
        };
      }
    },

    // 监听所有用户信息和我的用户信息
    userWatch(val) {
      if (val.originUsers.length && val.myUser) {
        // 处理用户信息和排位置
        this.handleUserInfo();
      }
    },

    // 监听用户列表是否排好，原始牌面是否拿到
    originCards() {
      if (this.usersList && this.originCards) {
        // 整理牌的属性
        this.setcard();
      }
    },

    // 监听牌是否处理完
    cardsList() {
      if (this.cardsList.length == 8) {
        // 开始发牌
        
        console.log("开始发牌");
        this.isAni = true;
      }
    },

    // 监听是否开始动画，开始发牌
    isAni() {
      if (this.isAni) {
        console.log("开始发牌动画");
        this.sendAniFn();
      } else {
        console.log("我的牌发完啦");
        this.websocket.send(
          JSON.stringify({
            userId: this.userID,
            funcType: 1,
            msg: {
              eventType: "aniFinish", // 事件名称 -- 发牌动画结束
              data: {
                uid: this.userID
              }
            }
          })
        );
      }
    },

    // 监听是否所有玩家都发完牌
    aniFinish() {
      if (this.aniFinish.length == this.shouldAniList.length) {
        // 开始倒计时抢庄
        this.coutdownmsg = "抢庄中";
        this.waitbanerinterval(); //倒计时
        this.doublebtn = true; //抢庄按钮显示
        this.iscoutdown = true; //显示倒计时
      }
    },
    // 监听是否所有玩家都抢完庄
    bankers() {
      var _this=this;
      if (_this.bankers.length == _this.shouldAniList.length) {
        // 开始倒计时下注
        console.log("抢庄完毕");
        if (_this.isbanker.length >= 1) {
          _this.bankerId = _this.isbanker[0];
          var which = _this.getseat(_this.isbanker[0]);
          _this.usersList[which].isbanker = true;
        } else {
          for (var i = 0; i < _this.usersList.length; i++) {
            if (_this.usersList[i]) {
              _this.bankerId = _this.usersList[i].userId;
              _this.usersList[i].isbanker = true;

              break;
            }
          }
        }

        console.log(_this.bankerId);
        console.log(_this.usersList);
        _this.usersList = _this.usersList.slice();
        _this.userInfokey = _this.userInfokey + 1;
        setTimeout(function(){
            _this.bankerClist = [];
            _this.bankerClist =  _this.bankerClist.slice();

            // _this.coutdownmsg = "下注中";
            // _this.waitbetinterval(); //倒计时
            // _this.betbtn = true; //开始下注
            // _this.iscoutdown = true; //显示倒计时
        },500)
       
      }
    }
  },
  methods: {

     format(val) {
      return val 
    },
    handleRangeChange(e) {
      this.rangeValue = e
    },
    test() {
      this.ishowlast = false;
    },

    // 获取位置
    getseat(id) {
      // console.log(this.usersList);
      // console.log(this.bankerClist)
      for (var i = 0; i < this.usersList.length; i++) {
        if (this.usersList[i] && this.usersList[i].userId == id) {
          return i;
        }
      }
    },
    // 从原生获取用户信息
    getUserInfo(str) {
      // 判断当前用户登录是否有问题
      // if (str) {
      //   this.userID = str.split(",")[0].split("=")[1];
      //   this.token = str.split(",")[1].split("=")[1];
      //    this.roomID = str.split(",")[1].split("=")[1];
      // }
      // ----
      //测试用后期删除 start--------
      let tokenlist = [
        "",
        "9383c08eed1644b58055c68e9341e172",
        "9383c08eed1644b58055c68e9341e177",
        "304b957948a34c4594b41f0beda38d62",
        "304b957948a34c4594b41f0beda38d86",
        "9383c08eed1644b58055c68e9341e174",
        "bf4ffbc973274308ad6312381160f697",
        "9df401483eff4d5b805f5f0259e68412",
        "2276e9f4dfb54afcad1425846cb05140"
      ];
      this.userID = location.search.split("?")[1].split("=")[1];
      this.token = tokenlist[this.userID];
      //测试用后期删除 end--------

      if (this.userID && this.roomID) {
        // 获取用户信息后连接websocket
        this.websocket = new WebSocket(
          requestUrl.websocketUrl + this.roomID + "/" + this.userID
        );
        // 获取当前用户信息
        uni.request({
          url: requestUrl.getUserDetail,
          method: "POST",
          data: {
            userid: parseInt(this.userID),
            token: this.token
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: res => {
            if (res.data.success) {
              console.log(res.data.data);
              this.myUser = res.data.data;
            }
          }
        });
      }
    },

    // 处理用户信息和排座位
    handleUserInfo() {
      console.log("处理用户信息和排座位");
      // 根据seatId在相应的位置排序
      let tempUsers = [];
      for (let i = 0; i < 8; i++) {
        tempUsers.push(null);
      }

      this.originUsers.forEach(item => {
        tempUsers[item.seatId - 1] = item;
      });

      // 始终保持自己在index为4的位置
      let myIndex = tempUsers.findIndex(
        item => item && item.userId == this.myUser.userid
      ); // 我在tempUsers中的位置
      // 根据自己的index和4之间的差距，将数组进行平移
      this.shouldAniList = [];
      tempUsers.forEach((item, index) => {
        let i = index + 4 - myIndex;
        if (i >= 8) {
          i -= 8;
        } else if (i < 0) {
          i += 8;
        }

        // 插入需要发牌的动画的index值
        if (item) {
          item.isbanker = false;
          this.shouldAniList.push(i);
        }
        this.usersList[i] = item;
      });
      // for (var i = 0; i < this.usersList.length; i++) {
      //   if (this.usersList[i]) {
      //     this.usersList[i].isbanker = false;
      //   }
      // }
      this.usersList = this.usersList.slice(0);
    },

    // 准备倒计时定时器
    readyFn() {
      this.readyTime = 30;
      clearInterval(this.readyTimer);
      this.readyTimer = setInterval(() => {
        if (this.readyTime <= 1) {
          clearInterval(this.readyTimer);
          this.exitRoomFn();
        }
        this.readyTime--;
      }, 1000);
    },

    // 点击准备按钮
    clickReady() {
      if (this.websocket) {
        this.isReady = true;
        // 清空准备倒计时定时器
        clearInterval(this.readyTimer);
        // 点击准备发送消息
        this.websocket.send(
          JSON.stringify({
            userId: this.userID,
            funcType: 10
          })
        );
      }
    },

    // 发牌动画方法，和一张一张插入牌面到showCardsList当中
    sendAniFn() {
      let nowCardLength = 0; //当前发牌的数量

      // 判断有几个动画需要发生
      let newShowArr = [];
      this.shouldAniList.forEach(() => {
        this.isShowAni.push(false);
        newShowArr.push(false);
      });

      let sendCardTimer = setInterval(() => {
        if (nowCardLength >= this.shouldAniList.length * 5 - 1) {
          clearInterval(sendCardTimer);
          // 最后一个动画结束后隐藏动画
          let aniOverTimer = setTimeout(() => {
            this.isAni = false;
          }, 300);
        }

        let aniIndex = nowCardLength % this.shouldAniList.length; // 第几个index
        let roundIndex = Math.floor(nowCardLength / this.shouldAniList.length); // 第几轮
        this.isShowAni = newShowArr.slice(0);
        this.isShowAni[aniIndex] = !this.isShowAni[aniIndex];

        // 给每位玩家发牌
        // 加载图片路径
        this.cardsList[this.shouldAniList[aniIndex]][
          roundIndex
        ].src = this.cardsList[this.shouldAniList[aniIndex]][roundIndex].src;

        this.showCardsList[this.shouldAniList[aniIndex]].push(
          this.cardsList[this.shouldAniList[aniIndex]][roundIndex]
        );

        nowCardLength++;
      }, 300); // 发牌定时器
    },

    // 修改牌的属性
    setcard() {
      var _this = this;
      var cardsList = [];
      var showlist = [];
      for (var i = 0; i < _this.usersList.length; i++) {
        if (_this.usersList[i]) {
          for (var v in _this.originCards) {
            if (_this.usersList[i].userId == v) {
              cardsList.push(_this.originCards[v]);
              showlist.push([]);
              this.bankerClist.push([]);
              this.betClist.push([]);
            }
          }
        } else {
          cardsList.push(null);
          showlist.push(null);
          this.bankerClist.push(null);
          this.betClist.push(null);
        }
      }
      // 处理后台返回的数据
      for (var j = 0; j < cardsList.length; j++) {
        var nowdata = cardsList[j];
        if (nowdata) {
          for (var i = 0; i < nowdata.length; i++) {
            var cardValue, cardNum;
            if (nowdata[i].num == "J") {
              cardValue = 11;
              cardNum = 10;
            } else if (nowdata[i].num == "Q") {
              cardValue = 12;
              cardNum = 10;
            } else if (nowdata[i].num == "K") {
              cardValue = 13;
              cardNum = 10;
            } else if (nowdata[i].num == "A") {
              cardValue = 4;
              cardNum = 1;
            } else {
              cardValue = nowdata[i].num;
              cardNum = nowdata[i].num;
            }
            // 黑桃4   红桃3  梅花2 方块1
            if (nowdata[i].color == "ht") {
              nowdata[i].cardColor = 4;
            } else if (nowdata[i].color == "hx") {
              nowdata[i].cardColor = 3;
            } else if (nowdata[i].color == "mh") {
              nowdata[i].cardColor = 2;
            } else if (nowdata[i].color == "fk") {
              nowdata[i].cardColor = 1;
            }
            nowdata[i].src =
              "../../static/image/card/" +
              cardValue +
              "-" +
              nowdata[i].color +
              ".png";
            nowdata[i].cardValue = cardValue;
            nowdata[i].cardNum = cardNum;
          }
        }
      }
      console.log(cardsList);
      _this.cardsList = cardsList;
      _this.showCardsList = showlist;
    },
    // 抢庄
    chooseB(type) {
      console.log(type);
      var text = type + "倍";
      if (type == -1) {
        text = "不抢";
      }
      this.websocket.send(
        JSON.stringify({
          userId: this.userID,
          funcType: 1,
          msg: {
            eventType: "choosebanker", // 事件名称 -- 抢庄
            data: {
              uid: this.userID,
              type: type,
              hint: text
            }
          }
        })
      );
      clearInterval(this.waitTimeInterval);
      this.coutdownmsg = "";
      this.doublebtn = false; //抢庄按钮显示
      this.iscoutdown = false; //显示倒计时
    },
    // 抢庄操作显示倒计时
    waitbanerinterval() {
      var _this = this;
      _this.counTime = _this.timer;
      _this.waitTimeInterval = setInterval(function() {
        _this.counTime--;
        if (_this.counTime == 0) {
          _this.websocket.send(
            JSON.stringify({
              userId: _this.userID,
              funcType: 1,
              msg: {
                eventType: "choosebanker", // 事件名称 -- 抢庄
                data: {
                  uid: _this.userID,
                  type: -1,
                  hint: "不抢"
                }
              }
            })
          );
          clearInterval(_this.waitTimeInterval);
          _this.coutdownmsg = "";
          _this.doublebtn = false; //抢庄按钮显示
          _this.iscoutdown = false; //显示倒计时
        }
      }, 1000);
    },
    // 下注操作显示倒计时
    waitbetinterval() {
      var _this = this;
      _this.counTime = _this.timer;
      _this.waitbetTimeInterval = setInterval(function() {
        _this.counTime--;
        if (_this.counTime == 0) {
          clearInterval(_this.waitbetTimeInterval);
        }
      }, 1000);
    },

    // 退出房间
    exitRoomFn() {
      console.log("退出房间");
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  // 变量
  @imgurl-pre: "../../static/image"; // 图片地址前缀

  background: url("@{imgurl-pre}/deskbg.png") no-repeat;
  // background-size: 100% 100%;
  background-size: 110% 110%;
  background-position: center;
  font-size: 0.12rem;
  width: 100vw;
  height: 100vh;
  position: relative;

  // 按钮共用样式
  button {
    background: url("@{imgurl-pre}/btn1.png") no-repeat;
    background-size: 100% 100%;
    font-size: 0.15rem;
    color: #ffffff;
    text-shadow: 1px 0px 1px rgba(232, 139, 58, 0.8),
      -1px 0px 1px rgba(232, 139, 58, 0.8), 0px 1px 1px rgba(232, 139, 58, 0.8),
      0px -1px 1px rgba(232, 139, 58, 0.8);
    text-align: center;
    &::after {
      display: none;
    }
    // 禁止操作
    &.banoption {
      background: url("@{imgurl-pre}/nobtn1.png") no-repeat;
      background-size: 100% 100%;
      text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3),
        -1px 0px 1px rgba(0, 0, 0, 0.3), 0px 1px 1px rgba(0, 0, 0, 0.3),
        0px -1px 1px rgba(0, 0, 0, 0.3);
    }
  }

  // 用户区域
  .usersListbox {
    width: 100%;
    height: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
    .readytextme {
      font-weight: 700;
      background-image: -webkit-linear-gradient(top, #f6f39d, #b46500);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      font-style: italic;
      font-size: 0.26rem;
      position: fixed;
      bottom: 0.8rem;
      left: 50%;
      transform: translateX(-50%);
    }
    .userbox {
      display: flex;
      align-items: center;
      position: absolute;

      @bianW1: 3%; // 距离左右两侧的宽度1
      @bianW2: 0%; // 距离左右两侧的宽度2
      @bianH1: 8%; // 距离上边的高度1
      @bianH2: 30%; // 距离上边的高度2
      @bianH3: 52%; // 距离上边的高度3

      // 其他玩家位置
      &.userbox1 {
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      &.userbox2 {
        top: @bianH1;
        left: @bianW1;
      }
      &.userbox3 {
        top: @bianH2;
        left: 0;
      }
      &.userbox4 {
        top: @bianH3;
        left: @bianW2;
      }
      &.userbox6 {
        top: @bianH3;
        right: @bianW2;
      }
      &.userbox7 {
        top: @bianH2;
        right: 0;
      }
      &.userbox8 {
        top: @bianH1;
        right: @bianW1;
      }
      // 其他玩家牌面区域
      .cardbox {
        margin: 0 0.1rem;
        overflow: hidden;
        padding-left: 0.1rem;
        position: relative;
        .readytext {
          font-weight: 700;
          background-image: -webkit-linear-gradient(top, #f6f39d, #b46500);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-style: italic;
          font-size: 0.26rem;
        }
        .operatext {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          position: absolute;
          text-align: center;
          // background:-webkit-linear-gradient(left, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 0.1) 20%, rgba(0, 0, 0, 0.15) 30%, rgba(0, 0, 0, 0.2) 40%, rgba(0, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0.15) 70%, rgba(0, 0, 0, 0.1) 80%, rgba(0, 0, 0, 0) 90%, rgba(0, 0, 0, 0) 100%);
          // background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 0.1) 20%, rgba(0, 0, 0, 0.15) 30%, rgba(0, 0, 0, 0.2) 40%, rgba(0, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0.15) 70%, rgba(0, 0, 0, 0.1) 80%, rgba(0, 0, 0, 0) 90%, rgba(0, 0, 0, 0) 100%);
          p {
            font-weight: 700;
            background-image: -webkit-linear-gradient(top, #f6f39d, #b46500);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-style: italic;
            font-size: 0.26rem;
          }
        }
        .imgbox {
          width: 0.3rem;
          float: left;
          margin-left: -0.1rem;
          img {
            width: 100%;
          }
        }
      }

      // 我的区域
      &.userbox5 {
        // background: skyblue;
        bottom: 1%;
        left: 2%;
        align-items: flex-end;

        // 我的用户信息
        .myuserinfo {
          align-items: flex-end;
        }

        // 我的豆子
        .mymoneybox {
          padding: 0 0.25rem;
          height: 0.18rem;
          border-radius: 0.09rem;
          background: rgba(0, 0, 0, 0.25);
          margin-left: 0.2rem;
          margin-bottom: 0.01rem;
          line-height: 0.18rem;
          position: relative;
          color: white;

          .dou {
            width: 0.18rem;
            height: 0.18rem;
            background: url("@{imgurl-pre}/dou.png") no-repeat;
            background-size: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }

          .addmoney {
            width: 0.18rem;
            height: 0.18rem;
            border-radius: 50%;
            background: white url("@{imgurl-pre}/addmoney.png") no-repeat;
            background-size: 100%;
            position: absolute;
            top: 0;
            right: 0;
          }
        }

        // 我的牌面
        .mycardbox {
          margin-left: 0.1rem;
          .imgbox {
            width: 0.42rem;
            float: left;
            margin-left: 0.05rem;
            img {
              width: 100%;
            }
          }
        }
      }
    }
  }

  // 操作区域
  .optionsbox {
    position: absolute;
    right: 1.4rem;
    bottom: 0.05rem;
    display: flex;
    justify-content: space-between;

    // 按钮区域
    .btnlist {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: center;
      button {
        padding: 0.05rem 0.26rem;
      }
    }
  }
  // 底分
  .showDi {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(0, 0, 0, 0.4);
    font-size: 0.16rem;
  }

  // 抢庄下注
  .doublebox,
  .bet {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;

    button {
      width: 0.7rem;
      margin-right: 0.1rem;
      padding: 0.01rem 0;
    }
  }

  // 倒计时
  .coutdown {
    position: absolute;
    top: 63%;
    left: 50%;
    transform: translateX(-50%);
    width: 2.1rem;
    text-align: center;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0.1) 20%,
      rgba(0, 0, 0, 0.15) 30%,
      rgba(0, 0, 0, 0.2) 40%,
      rgba(0, 0, 0, 0.25) 50%,
      rgba(0, 0, 0, 0.2) 60%,
      rgba(0, 0, 0, 0.15) 70%,
      rgba(0, 0, 0, 0.1) 80%,
      rgba(0, 0, 0, 0) 90%,
      rgba(0, 0, 0, 0) 100%
    );
    color: #fff;
  }

  // 发牌动画
  .anibox {
    width: 100%;
    height: 100%;
    // background: pink;
    position: absolute;
    top: 0;
    left: 0;

    .ani-item {
      width: 0.3rem;
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
      }

      &.cardani0-enter-active {
        animation: cardani 0.3s forwards reverse linear;
      }

      //动画变量
      @topList: 16%, 13%, 35%, 58%, 75%, 58%, 35%, 13%;
      @leftList: 50%, 18%, 16%, 16%, 50%, 84%, 84%, 82%;

      // 循环生成样式
      .loop (@i) when(@i<9) {
        &.ani@{i} {
          top: extract(@topList, @i);
          left: extract(@leftList, @i);
        }
        .loop(@i+1);
      }
      .loop(0);

      @keyframes cardani {
        0% {
        }
        100% {
          top: 45%;
          left: 50%;
        }
      }
    }
  }

  // 准备游戏按钮
  .readybtn {
    position: absolute;
    bottom: 0.05rem;
    right: 0.3rem;

    button {
      padding: 0.05rem 0.1rem;
    }
  }
}
</style>
