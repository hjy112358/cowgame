<template>
  <view class="content">
    <!-- <view class="test">
      <p>{{userID}}</p>
      <p>{{seatId}}</p>
    </view>-->
    <!-- 返回 -->
    <view class="back" @tap="exitRoomFn()">
      <img src="../../static/image/back.png" />
    </view>
    <!-- 用户列表 -->
    <ul class="usersListbox">
      <li
        v-for="(item, index) in usersList"
        class="userbox"
        :key="index"
        :class="`userbox${index + 1}`"
      >
        <!-- 右侧玩家牌面在前 -->
        <div class="cardbox" v-if="item && (index == 5 || index == 6 || index == 7)">
          <!-- 输赢结果 -->
          <div class="wlCoin" v-if="winLose[index]">
            <p class="win" v-if="winLose[index].win==1">+{{winLose[index].goldcoin}}</p>
            <p class="lose" v-else>{{winLose[index].goldcoin}}</p>
          </div>
          <!-- 庄家 -->
          <div class="readytext">
            <p>{{bankerClist[index]?bankerClist[index].hint:''}}</p>
          </div>
          <!-- 翻牌 -->
          <div class="readytext flaptext">
            <p>{{flapClist[index]?flapClist[index].hint:''}}</p>
          </div>
          <!-- 准备 -->
          <p class="readytext" v-if="ishowready">{{readylist[index]&&readylist[index]==1?'准备':''}}</p>
          <div>
            <div class="imgbox" v-for="(k, k_index) in showCardsList[index]" :key="k_index">
              <img :src="k.src" alt v-if="flapClist[index]&&flapClist[index].hint" />
              <img src="../../static/image/card/cardBack.png" v-else />
            </div>
          </div>
        </div>
        <!-- 下注 -->
        <div
          class="betdetail otherbet flex juscon-start alignitem-center"
          v-if="betClist[index]&&(index == 5 || index == 6 || index == 7)&&betClist[index].type&&goldcoin"
        >
          <img src="../../static/image/dou.png" alt />
          <p>{{betClist[index]?betClist[index].type:''}}</p>
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
          <UserInfo :usermsg="item" :key="userInfokey"></UserInfo>
        </div>

        <!-- 我的豆子显示区域 -->
        <div>
          <!-- 我的下注 -->
          <div
            class="betdetail flex juscon-start alignitem-center"
            v-show="betClist[index]&&betClist[index].type&&index == 4&&goldcoin"
          >
            <img src="../../static/image/dou.png" alt />
            <p>{{betClist[index]?betClist[index].type:''}}</p>
          </div>
          <div class="mymoneybox" v-if="index == 4 && myUser&&usersList[4]">
            <i class="dou"></i>
            <p>{{ usersList[4].goldCoin | moneyFilter }}</p>
            <div class="addmoney"></div>
          </div>
        </div>

        <!-- 左侧玩家牌面在后 -->
        <div
          class="cardbox"
          v-if="item && (index == 0 || index == 1 || index == 2 || index == 3)"
          :class="`${index == 4 ? 'mycardbox' : ''}`"
        >
          <!-- 输赢结果 -->
          <div class="wlCoin leftwlcoin" v-if="winLose[index]" :class="index==0?'topcoin':''">
            <p class="win" v-if="winLose[index].win==1">+{{winLose[index].goldcoin}}</p>
            <p class="lose" v-else>{{winLose[index].goldcoin}}</p>
          </div>
          <!-- 庄家 -->
          <div class="readytext">
            <p>{{bankerClist[index]?bankerClist[index].hint:''}}</p>
          </div>
          <!-- 翻牌 -->
          <div class="readytext flaptext">
            <p>{{flapClist[index]?flapClist[index].hint:''}}</p>
          </div>
          <!-- 准备 -->
          <p class="readytext" v-if="ishowready">{{readylist[index]&&readylist[index]==1?'准备':''}}</p>
          <div>
            <div class="imgbox" v-for="(k, k_index) in showCardsList[index]" :key="k_index">
              <img :src="k.src" alt v-if="flapClist[index]&&flapClist[index].hint" />
              <img src="../../static/image/card/cardBack.png" v-else />
            </div>
          </div>
        </div>
        <!-- 下注 -->
        <div
          class="betdetail otherbet leftbet flex juscon-start alignitem-center"
          v-if="betClist[index]&&(index == 0 || index == 1 || index == 2 || index == 3)&&betClist[index].type&&goldcoin"
        >
          <img src="../../static/image/dou.png" alt />
          <p>{{betClist[index]?betClist[index].type:''}}</p>
        </div>

        <!-- 我的牌面区域 -->

        <!-- 准备 -->
        <p
          class="readytextme"
          v-if="item&&ishowready&&index == 4"
        >{{readylist[index]&&readylist[index]==1?'准备':''}}</p>

        <!-- 提示 -->
        <p class="hintmsg" v-if="item&&hintmsg!=''&&index == 4">{{hintmsg}}</p>
        <!-- 抢庄 -->
        <div class="readytextme" v-if="item&&index == 4">
          <p>{{bankerClist[4]?bankerClist[4].hint:''}}</p>
        </div>
        <div class="cardbox mycardbox" v-if="item&&index == 4">
          <div class="imgbox" v-for="(k, k_index) in showCardsList[4]" :key="k_index">
            <img src="../../static/image/card/cardBack.png" v-if="k_index==4&&ishowlast" />
            <img :src="k.src" v-else />
          </div>
          <!-- 翻牌 -->
          <div class="readytext myflap" v-if="item&&index == 4">
            <p>{{flapClist[4]?flapClist[4].hint:''}}</p>
          </div>
          <!-- 输赢结果 -->
          <div class="wlCoin" v-if="item&&index == 4&&winLose[4]">
            <p class="win" v-if="winLose[4].win==1">+{{winLose[4].goldcoin}}</p>
            <p class="lose" v-else>{{winLose[4].goldcoin}}</p>
          </div>
        </div>
      </li>
    </ul>

    <!-- 底分 -->
    <div class="showDi">
      <p>底分:{{bottomScore}}</p>
    </div>
    <!-- 翻牌 -->
    <div class="optionsbox" v-show="isFlop" @tap="flop(showCardsList[4])">
      <!--  -->
      <div class="btnlist">
        <button class="flopbtn">开牌({{ floptime }}s)</button>
      </div>
    </div>
    <!-- 准备游戏按钮 -->
    <div class="readybtn" v-if="!isReady">
      <button @click="clickReady()">准备({{ readyTime }}s)</button>
    </div>
    <!-- 倒计时 -->
    <div class="coutdown">
      <span>{{coutdownmsg}}</span>
      <span v-show="iscoutdown">:{{counTime}}s</span>
    </div>
    <!-- 显示当前操作信息 -->
    <div class="coutdown" v-show="nowmsg!=''">
      <span>{{nowmsg}}</span>
    </div>
    <!-- 抢庄 -->
    <div class="doublebox" v-if="doublebtn">
      <button class @tap="chooseB(-1)">不抢</button>
      <button v-for="(key,index) in doublelist" :key="index" @tap="chooseB(key)">{{key}}倍</button>
    </div>
    <!-- 下注-->
    <div class="bet" v-if="betbtn">
      <!-- -->
      <!--  -->
      <button
        v-show="!showEditself"
        v-for="(key,index) in betlist"
        :key="index"
        @tap="chooseBet(key)"
      >{{key}}分</button>
      <button @tap="editSelf()" v-show="!showEditself">自定义</button>
      <view class="flex alignitem-center editselfbtn" v-if="showEditself">
        <!--  -->
        <view class="rowBox mrg50T">
          <view class="sliderBox">
            <RangeSlider
              :width="slideWidth"
              :height="slideHeight"
              :blockSize="slideBlockSize"
              :min="slideMin"
              :max="slideMax"
              :values="rangeValues"
              :step="step"
              :liveMode="isLiveMode"
              @rangechange="onRangeChange"
            >
              <view slot="maxBlock" class="range-slider-block"></view>
            </RangeSlider>
          </view>
        </view>
        <p>{{sum}}</p>
        <!-- <input type="text" v-model="sum" disabled /> -->
        <button @tap="chooseBet(sum)">确定</button>
        <button class="banoption" @tap="editCancel()">取消</button>
      </view>
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
import RangeSlider from "../../components/range-slider/range-slider.vue";

export default {
  data() {
    return {
      // 模拟数据
      originUsers: [], // 所有用户信息列表
      originCards: null, // 所有用户的牌面列表
      playUserslen: 0, //玩家人数

      // 原生传入的当前用户的信息
      userID: "", // 当前页面的userID
      token: "", // 当前页面的token
      roomID: "", // 当前房间号---------------------
      seatId: "", //用户的座位号
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
      ishowready: true, //显示ready文字
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
      isLeave: true, //是否可以离开

      // 操作
      coutdownmsg: "", //当前操作名称
      iscoutdown: false, //是否显示倒计时
      timer: 15, //倒计时时间
      nowmsg: "", //当前操作名称显示
      isFlop: false, //是否翻牌
      beginTime: "", //游戏开始时间---结算需要的参数
      endgame: [], //结束游戏的用户id

      // 抢庄
      isbanker: [], // 记录抢庄操作的人数
      bankers: [], //存放抢庄的用户id
      counTime: "10", //倒计时
      waitTimeInterval: null, //倒计时
      doublebtn: false, //抢庄按钮
      bankerClist: [], //记录抢庄详情
      bankerId: "", //庄家id
      userInfokey: 0, //控制子组件变化（庄家头像）
      goldcoin: false, //庄家显示下注分
      bankerBet: 0, //庄家分的三分之一

      // 下注
      betbtn: false, //下注按钮
      waitbetTimeInterval: null, //倒计时
      betClist: [], //记录下注详情
      bets: [], //存放下注的用户id
      betsum: 0, //记录下注总和
      hintmsg: "", //提示文字
      // 开牌
      flaps: [], //存放下注的用户id
      flapClist: [], //记录下注详情
      floptime: 10, //开牌时间
      floptimer: null, //开牌定时器名字

      // 输赢
      winLose: [], //记录输赢

      // 我的牌
      ishowlast: true, //是否显示最后一张牌true 显示背景   false 显示排面

      // range参数
      rangeValues: [0, 0],
      slideWidth: 100, //组件宽度
      slideHeight: 80, //组件高度
      slideBlockSize: 15, //滑块大小
      slideMin: 0, //最小值
      slideMax: 0, //最大值
      isLiveMode: true, //是否即时刷新数值，默认true
      step: 10, //步长值
      sum: 0, //选择的自定义下注分
      showEditself: false, //显示自定义滑块

      // 音频
      audio: null,
      mp3: "/static/f.mp3" //发牌
    };
  },
  components: {
    UserInfo,
    RangeSlider
  },
  onLoad() {},
  created() {
    // 页面自适应
    this.remFn();
  },
  mounted() {
    // 从原生获取
    window.getUserInfo = this.getUserInfo;
    window.exitRoomFn = this.exitRoomFn;
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
          // console.log("websocket连接成功");
          // 连接成功后开始准备倒计时
          // ----
          this.readyFn();
        };
        // websocket连接接受消息
        this.websocket.onmessage = event => {
          let data = JSON.parse(event.data);
          console.log(data);

          // 获取桌面所有用户信息、牌面，并设置出牌顺序
          if (data.card) {
            // 获取牌
            this.ishowready = false;
            this.originCards = JSON.parse(data.card); // card的结果是个对象，属性名是用户id，属性值是用户的牌
            this.playUserslen = Object.keys(this.originCards).length;
            this.step = this.betlist[0];
            this.beginTime = this.formatDate();
            console.log("this.originCards", this.originCards);
          }

          // 获取进入用户的信息
          if (data.userInfo) {
            this.originUsers = data.userInfo;
            console.log("this.originUsers", this.originUsers);
          }

          if (data.funcType == 10) {
            let readyindex = this.readylist.indexOf(data.userId);
            if (readyindex == -1) {
              var which = this.getseat(data.userId, false);
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
                var which = this.getseat(msgRes.data.uid, false);
                if (msgRes.data.type == -1) {
                  var myaudio = new Audio();
                  myaudio.src = "/static/audio/nobanker.mp3";
                  myaudio.play();
                } else {
                  var myaudio = new Audio();
                  myaudio.src = "/static/audio/banker.mp3";
                  myaudio.play();
                }
                // console.log(which, this.bankerClist);
                this.bankerClist[which].type = msgRes.data.type;
                this.bankerClist[which].hint = msgRes.data.hint;
                this.bankerClist = this.bankerClist.slice(0);
                // console.log(this.bankerClist);
              }
              // 存放想要抢庄的人
              if (msgRes.data.type != -1) {
                let isbankerindex = this.isbanker.indexOf(msgRes.data.uid);
                if (isbankerindex == -1) {
                  this.isbanker.push(msgRes.data.uid);
                }
              }
            }
            // 下注
            else if (msgRes.eventType == "choosebet") {
              let betindex = this.bets.indexOf(msgRes.data.uid);
              if (betindex == -1) {
                this.betsum =
                  parseInt(this.betsum) + parseInt(msgRes.data.type);
                this.bets.push(msgRes.data.uid);
                var which = this.getseat(msgRes.data.uid, false);
                this.betClist[which].type = msgRes.data.type;
                this.betClist[which].userid = msgRes.data.uid;
                this.betClist = this.betClist.slice(0);

                this.slideMax =
                  parseInt(this.bankerBet) -
                  this.betlist[0] *
                    parseInt(this.playUserslen - 2 - this.bets.length) -
                  parseInt(this.betsum);
                // console.log('max'+this.slideMax)
              }
            }
            // 翻牌
            else if (msgRes.eventType == "flap") {
              // console.log(msgRes.data);
              let flapindex = this.flaps.indexOf(msgRes.data.uid);
              if (flapindex == -1) {
                this.flaps.push(msgRes.data.uid);
                console.log(msgRes.data.audioname);
                switch (msgRes.data.audioname) {
                  // 无牛
                  case "nocows":
                    var myaudio = new Audio();
                    myaudio.src = "/static/audio/nocows.mp3";
                    myaudio.play();
                    break;
                  // 五花
                  case "is5flower":
                    var myaudio = new Audio();
                    myaudio.src = "/static/audio/is5flower.mp3";
                    myaudio.play();
                    break;
                  // 五小
                  case "is5small":
                    var myaudio = new Audio();
                    myaudio.src = "/static/audio/is5small.mp3";
                    myaudio.play();
                    break;
                  // 四炸
                  case "isboom":
                    var myaudio = new Audio();
                    myaudio.src = "/static/audio/isboom.mp3";
                    myaudio.play();
                    break;
                  // 牛牛
                  case "iscows":
                    var myaudio = new Audio();
                    myaudio.src = "/static/audio/iscows.mp3";
                    myaudio.play();
                    break;
                  // 牛1
                  case "cow1":
                    var myaudio = new Audio();
                    myaudio.src = "/static/audio/cow1.mp3";
                    myaudio.play();
                    break;
                  // 牛2
                  case "cow2":
                    var myaudio = new Audio();
                    myaudio.src = "/static/audio/cow2.mp3";
                    myaudio.play();
                    break;
                  // 牛3
                  case "cow3":
                    var myaudio = new Audio();
                    myaudio.src = "/static/audio/cow3.mp3";
                    myaudio.play();
                    break;
                  // 牛4
                  case "cow4":
                    var myaudio = new Audio();
                    myaudio.src = "/static/audio/cow4.mp3";
                    myaudio.play();
                    break;
                  // 牛5
                  case "cow5":
                    var myaudio = new Audio();
                    myaudio.src = "/static/audio/cow5.mp3";
                    myaudio.play();
                    break;
                  // 牛6
                  case "cow6":
                    var myaudio = new Audio();
                    myaudio.src = "/static/audio/cow6.mp3";
                    myaudio.play();
                    break;
                  // 牛7
                  case "cow7":
                    var myaudio = new Audio();
                    myaudio.src = "/static/audio/cow7.mp3";
                    myaudio.play();
                    break;
                  // 牛8
                  case "cow8":
                    var myaudio = new Audio();
                    myaudio.src = "/static/audio/cow8.mp3";
                    myaudio.play();
                    break;
                  // 牛9
                  case "cow9":
                    var myaudio = new Audio();
                    myaudio.src = "/static/audio/cow9.mp3";
                    myaudio.play();
                    break;
                }

                var which = this.getseat(msgRes.data.uid, false);
                this.flapClist[which].type = msgRes.data.type;
                this.flapClist[which].hint = msgRes.data.hint;
                this.flapClist[which].userId = msgRes.data.uid;
                this.flapClist[which].result = msgRes.data.result;
                this.flapClist[which].double = msgRes.data.double;
                this.flapClist = this.flapClist.slice(0);
              }
            }
            // 结束游戏
            else if (msgRes.eventType == "endgame") {
              console.log(msgRes.eventType);
              let endindex = this.endgame.indexOf(msgRes.data.uid);
              if (endindex == -1) {
                this.endgame.push(msgRes.data.uid);
              }
            }
          }
        };

        // 连接关闭的回调方法
        this.websocket.onclose = res => {
          console.log(event);

          // alert(JSON.parse(event.data))
          if (event.data) {
            var data = JSON.parse(event.data);
          } else {
            var data = {
              userid: this.userID,
              token: this.token,
              room_id: this.roomID,
              seat_id: this.seatId
            };

            // 退出房间
            // uni.request({
            //   url: requestUrl.exitRoom,
            //   method: "POST",
            //   data: data,
            //   header: {
            //     "Content-Type": "application/x-www-form-urlencoded"
            //   },
            //   success: res => {
            //     if (res.data.success) {
            //       H5Interactive.exit_room() //退出房间
            //     }
            //   }
            // });
            H5Interactive.exit_room(); //退出房间
            H5Interactive.exit_room_Cattle_flower(this.roomID.toString(), this.seatId.toString()); //退出房间接口
          }
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

    // 监听牌是否处理完--开始抢庄
    cardsList() {
      if (this.cardsList.length == 8) {
        // 开始抢庄
        this.coutdownmsg = "抢庄中";
        this.waitbanerinterval(); //倒计时
        this.doublebtn = true; //抢庄按钮显示
        this.iscoutdown = true; //显示倒计时
        this.isLeave = false;
      }
    },

    // 监听是否开始动画，开始发牌
    isAni() {
      if (this.isAni) {
        this.sendAniFn();
      } else {
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

    // 监听是否所有玩家都发完牌---开始下注
    aniFinish() {
      if (this.aniFinish.length == this.shouldAniList.length) {
        this.goldcoin = true; //庄家显示下注分数
        // 开始下注
        this.coutdownmsg = "下注中";

        if (this.userID != this.bankerId) {
          this.iscoutdown = true; //显示倒计时
          this.waitbetinterval(); //倒计时
          this.betbtn = true; //开始下注
        }
      }
    },
    // 监听是否所有玩家都抢完庄--开始发牌
    bankers() {
      var _this = this;
      var whichuser = "";
      if (_this.bankers.length == _this.shouldAniList.length) {
        // 开始倒计时下注
        // console.log("抢庄完毕");
        if (_this.isbanker.length >= 1) {
          _this.bankerId = _this.isbanker[0];
          var which = _this.getseat(_this.isbanker[0], false);
          whichuser = _this.getseat(_this.isbanker[0], true);
          _this.usersList[which].isbanker = true;
          _this.betClist[which].type =
            _this.bottomScore * _this.bankerClist[which].type;
          _this.betClist[which].userid = _this.bankerId;
          _this.bankerBet = Math.floor(
            (_this.bottomScore * _this.bankerClist[which].type) / 3
          ); //记录庄家分
        } else {
          _this.bankerId = this.originUsers[0].userId;
          whichuser = this.originUsers[0].nickName;

          for (var i = 0; i < _this.usersList.length; i++) {
            if (_this.usersList[i]) {
              if (_this.usersList[i].userId == _this.bankerId) {
                var which = _this.getseat(_this.usersList[i].userId, false);
                _this.usersList[i].isbanker = true;
                _this.betClist[which].type = _this.bottomScore;
                _this.betClist[which].userid = _this.bankerId;
                _this.bankerBet = Math.floor(_this.bottomScore / 3); //记录庄家分

                break;
              }
            }
          }
        }
        console.log("庄家" + _this.bankerId);
        _this.usersList = _this.usersList.slice();
        _this.userInfokey = _this.userInfokey + 1;
        _this.nowmsg = whichuser + "成为庄家";
        setTimeout(function() {
          _this.bankerClist = [];
          _this.bankerClist = _this.bankerClist.slice();
          _this.nowmsg = "";
          _this.slideMax =
            parseInt(_this.bankerBet) -
            _this.betlist[0] * parseInt(_this.playUserslen - 2);
          // console.log('max'+_this.slideMax);
          // 开始发牌
          _this.isAni = true;
        }, 1200);
      }
    },
    //监听是否所有玩家都下完注--显示最后一张牌
    bets() {
      if (this.bets.length + 1 == this.shouldAniList.length) {
        this.ishowlast = false;
        this.coutdownmsg = "";
        this.isFlop = true;
        this.flopTime(); //开牌倒计时
      }
    },
    // 监听是否所有玩家都开完牌--判断输赢
    flaps() {
      if (this.flaps.length == this.shouldAniList.length) {
        console.log("开牌完毕");
        this.settle(); //结算
      }
    },
    // 监听是否所有玩家都结束--新一局准备
    endgame() {
      var _this = this;
      if (_this.endgame.length == _this.shouldAniList.length) {
        console.log("全部结束");
        _this.nowmsg = "即将开始下一局";
        _this.isLeave = true;
        setTimeout(function() {
          var websocket = _this.websocket;
          var userId = _this.userID;
          var userToken = _this.token;
          var roomId = _this.roomID;
          var seatId = _this.seatId;
          var originuser = _this.originUsers;
          var myuser = _this.myUser;
          var userlist = _this.usersList;
          Object.assign(_this.$data, _this.$options.data());
          _this.websocket = websocket;
          _this.userID = userId;
          _this.token = userToken;
          _this.roomID = roomId;
          _this.seatId = seatId;
          _this.originUsers = originuser;
          _this.myUser = myuser;
          _this.usersList = userlist;
          _this.readyFn();
        }, 8000);
      }
    }
  },
  methods: {
    // 输赢最后的扣分
    showGoldcion(list) {
      var winloselist = this.usersList;
      for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < winloselist.length; j++) {
          if (winloselist[j]) {
            if (list[i].userId == winloselist[j].userId) {
              winloselist[j].win = list[i].iswin;
              winloselist[j].goldcoin = list[i].goldCoin;
              winloselist[j].goldCoin =
                parseInt(winloselist[j].goldCoin) + parseInt(list[i].goldCoin);
            }
          }
        }
      }
      this.winLose = winloselist;
      console.log(winloselist);
      this.usersList = winloselist;
      this.userInfokey = this.userInfokey + 1;
      console.log(winloselist);
      this.websocket.send(
        JSON.stringify({
          userId: this.userID,
          funcType: 11,
          msg: {
            eventType: "endgame", // 事件名称 -- 结束游戏
            data: {
              uid: this.userID
            }
          }
        })
      );
    },
    // 结算
    settle() {
      console.log(this.usersList);
      console.log(this.flapClist);
      console.log(this.betClist);

      var resultlist = []; //存放牌型结果
      for (var i = 0; i < this.flapClist.length; i++) {
        if (this.flapClist[i]) {
          this.flapClist[i].beginTime = this.beginTime;
          resultlist.push(this.flapClist[i]);
        }
      }
      for (var i = 0; i < resultlist.length; i++) {
        for (var j = 0; j < this.betClist.length; j++) {
          if (this.betClist[j]) {
            if (resultlist[i].userId == this.betClist[j].userid) {
              resultlist[i].bet = this.betClist[j].type;
            }
          }
        }
      }
      console.log(resultlist);
      // 比牌并排序
      for (var i = resultlist.length - 1; i > 0; i--) {
        for (var j = 0; j < i; j++) {
          var follow = this.follow(
            resultlist[j].result,
            resultlist[j + 1].result
          );
          console.log(follow);
          if (follow) {
            [resultlist[j], resultlist[j + 1]] = [
              resultlist[j + 1],
              resultlist[j]
            ];
          }
        }
      }
      if (resultlist[resultlist.length - 1].userId == this.bankerId) {
        // 庄家赢
        var double = resultlist[resultlist.length - 1].double;
        var sumwin = 0;
        for (var i = 0; i < resultlist.length - 1; i++) {
          console.log(resultlist[i].bet);
          var goldcoin = resultlist[i].bet * double;
          resultlist[i].userid = resultlist[i].userId;
          resultlist[i].iswin = 0;
          resultlist[i].point = 0;
          resultlist[i].goldCoin = -goldcoin;
          resultlist[i].gametype = 5;
          sumwin = parseInt(sumwin) + parseInt(goldcoin);
        }
        resultlist[resultlist.length - 1].userid =
          resultlist[resultlist.length - 1].userId;
        resultlist[resultlist.length - 1].iswin = 1;
        resultlist[resultlist.length - 1].point = 0;
        resultlist[resultlist.length - 1].goldCoin = sumwin;
        resultlist[resultlist.length - 1].gametype = 5;
      } else {
        // 庄家输
        var bankerindex = 0;
        var sumlose = 0;
        for (var i = 0; i < resultlist.length; i++) {
          if (resultlist[i].userId == this.bankerId) {
            bankerindex = i;
          }
        }
        // 比庄家大
        for (var i = bankerindex + 1; i < resultlist.length; i++) {
          console.log(resultlist[i].bet);
          console.log(resultlist[i].double);
          var goldcoin = resultlist[i].bet * resultlist[i].double;
          resultlist[i].userid = resultlist[i].userId;
          resultlist[i].iswin = 1;
          resultlist[i].point = 0;
          resultlist[i].goldCoin = goldcoin;
          resultlist[i].gametype = 5;
          sumlose = parseInt(sumlose) + parseInt(goldcoin);
        }
        //  比庄家小
        for (var i = 0; i < bankerindex; i++) {
          resultlist[i].userid = resultlist[i].userId;
          resultlist[i].iswin = 0;
          resultlist[i].point = 0;
          resultlist[i].goldCoin = 0;
          resultlist[i].gametype = 5;
        }
        resultlist[bankerindex].userid = resultlist[i].userId;
        resultlist[bankerindex].iswin = 0;
        resultlist[bankerindex].point = 0;
        resultlist[bankerindex].goldCoin = -sumlose;
        resultlist[bankerindex].gametype = 5;
      }
      this.showGoldcion(resultlist);
      console.log(resultlist);
      var settlelist = [];
      for (var i = 0; i < resultlist.length; i++) {
        var obj = {};
        var nowarr = resultlist[i];
        for (var key in nowarr) {
          obj[key] = nowarr[key];
        }
        settlelist.push(obj);
      }
      console.log(settlelist);
      if (this.userID == this.bankerId) {
        uni.request({
          url: requestUrl.finishGame,
          method: "POST",
          data: JSON.stringify(settlelist),
          header: {
            "Content-Type": "application/json"
          },
          success: res => {
            console.log(res.data);
          }
        });
      }
    },

    // 翻牌倒计时定时器
    flopTime() {
      this.floptime = this.timer;
      clearInterval(this.floptimer);
      this.floptimer = setInterval(() => {
        if (this.floptime <= 1) {
          clearInterval(this.floptimer);
          this.flop(this.showCardsList[4]);
        }
        this.floptime--;
      }, 1000);
    },
    // 翻牌
    flop(list) {
      // console.log(this.showCardsList);
      // console.log(list);
      clearInterval(this.floptimer);
      var result = this.judgeCards(list);
      console.log(result);
      var text = "无牛";
      var audioname = "nocows"; //对应音频名字
      var double = 1;
      if (result.status) {
        if (result.kindvalue == 6) {
          text = "五花X3";
          double = 3;
          audioname = "is5flower";
        } else if (result.kindvalue == 5) {
          text = "五小X3";
          double = 3;
          audioname = "is5small";
        } else if (result.kindvalue == 4) {
          text = "四炸X3";
          double = 3;
          audioname = "isboom";
        } else if (result.kindvalue == 3) {
          text = "牛牛X3";
          double = 3;
          audioname = "iscows";
        } else if (result.kindvalue == 2) {
          var cow = result.cardKind.split("cow")[1];
          audioname = "cow" + cow;
          if (cow >= 7) {
            text = "牛" + cow + "X2";
            double = 2;
          } else {
            text = "牛" + cow;
            double = 1;
          }
        }
      }
      this.websocket.send(
        JSON.stringify({
          userId: this.userID,
          funcType: 1,
          msg: {
            eventType: "flap", // 事件名称 -- 开牌
            data: {
              uid: this.userID,
              type: result.kindvalue,
              hint: text,
              result: result,
              double: double,
              audioname: audioname
            }
          }
        })
      );
      this.isFlop = false;
    },
    // 选择下注自定义
    editSelf() {
      this.showEditself = true;
    },
    // 自定义下注取消
    editCancel() {
      this.showEditself = false;
    },

    // 获取位置
    getseat(id, getname) {
      for (var i = 0; i < this.usersList.length; i++) {
        if (this.usersList[i] && this.usersList[i].userId == id) {
          if (getname) {
            return this.usersList[i].nickName;
          } else {
            return i;
          }
        }
      }
    },
    // 从原生获取用户信息
    getUserInfo(str) {
      // 判断当前用户登录是否有问题
      if (str) {
        this.userID = str.split(",")[0].split("=")[1];
        this.token = str.split(",")[1].split("=")[1];
        this.roomID = str.split(",")[2].split("=")[1];
        this.seat_id = str.split(",")[3].split("=")[1];
        //  alert(str)
      } else {
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
          "2276e9f4dfb54afcad1425846cb05140",
          "",
          "fed18676bc4e47e5bd27964aa54f86f5",
          "4c6b968a92ed4b459b679ac54ce40761"
        ];

        this.userID = location.search
          .split("?")[1]
          .split("&")[0]
          .split("=")[1];
        this.seatId = location.search
          .split("?")[1]
          .split("&")[1]
          .split("=")[1];
        this.token = tokenlist[this.userID];
        this.roomID='2001' 
        //测试用后期删除 end--------
      }

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
              // console.log(res.data.data);
              this.myUser = res.data.data;
            }
          }
        });
      }
    },

    // 处理用户信息和排座位
    handleUserInfo() {
      // console.log("处理用户信息和排座位");
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
      console.log(this.usersList);
      console.log(this.originUsers);
    },

    // 准备倒计时定时器
    readyFn() {
      this.readyTime = this.timer;
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
      //创建音频
      this.audio = new Audio();
      this.audio.src = this.mp3;
      this.audio.loop = true;
      // 播放音频
      this.audio.play();
      let sendCardTimer = setInterval(() => {
        if (nowCardLength >= this.shouldAniList.length * 5 - 1) {
          clearInterval(sendCardTimer);
          // 最后一个动画结束后隐藏动画
          let aniOverTimer = setTimeout(() => {
            this.isAni = false;
            this.audio.pause();
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
              this.flapClist.push([]);
            }
          }
        } else {
          cardsList.push(null);
          showlist.push(null);
          this.bankerClist.push(null);
          this.betClist.push(null);
          this.flapClist.push(null);
        }
      }
      // 处理后台返回的数据
      for (var j = 0; j < cardsList.length; j++) {
        var nowdata = cardsList[j];
        if (nowdata) {
          for (var i = 0; i < nowdata.length; i++) {
            var cardValue, cardNum;
            if (nowdata[i].num == "J") {
              cardValue = "11";
              cardNum = "10";
            } else if (nowdata[i].num == "Q") {
              cardValue = "12";
              cardNum = "10";
            } else if (nowdata[i].num == "K") {
              cardValue = "13";
              cardNum = "10";
            } else if (nowdata[i].num == "A") {
              cardValue = "1";
              cardNum = "1";
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
      // console.log(cardsList);
      _this.cardsList = cardsList;
      _this.showCardsList = showlist;
    },
    // 抢庄
    chooseB(type) {
      // console.log(type);
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
                  type: "-1",
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
          _this.coutdownmsg = "";
          _this.hintmsg = "";
          _this.betbtn = false; //下注按钮显示
          _this.iscoutdown = false; //显示倒计时
          var type = 0;
          if (
            parseInt(_this.bankerBet) - parseInt(_this.betsum) >=
            _this.betlist[0]
          ) {
            type = _this.betlist[0];
          } else {
            type = parseInt(_this.bankerBet) - parseInt(_this.betsum);
          }
          // console.log(parseInt(_this.bankerBet));
          // console.log(parseInt(_this.betsum));

          _this.websocket.send(
            JSON.stringify({
              userId: _this.userID,
              funcType: 1,
              msg: {
                eventType: "choosebet", // 事件名称 -- 下注
                data: {
                  uid: _this.userID,
                  type: type
                }
              }
            })
          );
        }
      }, 1000);
    },
    // 下注
    chooseBet(type) {
      var sum =
        parseInt(this.betsum) +
        (parseInt(this.playUserslen) - 2 - parseInt(this.bets.length)) *
          this.betlist[0] +
        parseInt(type);

      if (sum > this.bankerBet) {
        this.hintmsg = "下注超出";
      } else if (type == 0) {
        this.hintmsg = "下注不能为0";
      } else {
        this.hintmsg = "";
        this.websocket.send(
          JSON.stringify({
            userId: this.userID,
            funcType: 1,
            msg: {
              eventType: "choosebet", // 事件名称 -- 下注
              data: {
                uid: this.userID,
                type: type
              }
            }
          })
        );
        clearInterval(this.waitTimeInterval);
        this.coutdownmsg = "";
        this.betbtn = false; //下注按钮显示
        this.iscoutdown = false; //显示倒计时
      }
    },
    // 自定义下注分滑动
    onRangeChange: function(e) {
      this.rangeValues = [e.minValue, e.maxValue, e.originalValue];
      this.sum = e.maxValue;
      // console.log(e);
    },
    // 获取当前时间
    formatDate() {
      // inputTime  时间戳
      var date = new Date();
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },
    //退出房间
    exitRoomFn() {
      if (this.isLeave && this.websocket) {
        this.websocket.close();
      } else if (!this.websocket) {
        H5Interactive.exit_room(); //退出房间
        H5Interactive.exit_room_Cattle_flower(this.roomID.toString(), this.seatId.toString()); //退出房间接口
      } else {
        
      }
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
  .back {
    position: absolute;
    left: 0.1rem;
    top: 0.1rem;
    width: 0.35rem;
    height: 0.35rem;
    z-index: 2;
    img {
      width: 100%;
    }
  }
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
      // font-style: italic;
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

      @bianW1: 5%; // 距离左右两侧的宽度1
      @bianW2: 2%; // 距离左右两侧的宽度2
      @bianH1: 12%; // 距离上边的高度1
      @bianH2: 34%; // 距离上边的高度2
      @bianH3: 54%; // 距离上边的高度3

      // 其他玩家位置
      &.userbox1 {
        top: 2%;
        left: 50%;
        transform: translateX(-50%);
        .leftbet {
          bottom: -0.25rem;
          right: 53%;
        }
        .wlCoin {
          left: 50%;
          transform: translateX(-50%);
          top: auto;
          bottom: -0.5rem;
        }
      }
      &.userbox2 {
        top: @bianH1;
        left: @bianW1;
      }
      &.userbox3 {
        top: @bianH2;
        left: 1%;
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
        right: 1%;
      }
      &.userbox8 {
        top: @bianH1;
        right: @bianW1;
      }
      // 其他玩家牌面区域
      .cardbox {
        margin: 0 0.1rem;
        // overflow: hidden;
        padding-left: 0.1rem;
        position: relative;
        .wlCoin {
          position: absolute;
          top: 50%;
          left: -0.4rem;
          /* z-index: 4; */
          transform: translateY(-50%);
          color: #ffe400;
          font-size: 0.2rem;
          font-weight: bold;
          &.leftwlcoin {
            left: auto;
            right: -0.4rem;
          }
          &.topcoin {
            left: 50%;
            transform: translateX(-50%);
            top: auto;
            bottom: -0.35rem;
            text-align: center;
          }

          p {
            &.lose {
              color: #4985b9;
            }
            &.win {
              color: #ffe400;
            }
          }
        }
        .readytext {
          font-weight: 700;
          background-image: -webkit-linear-gradient(top, #f6f39d, #b46500);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          // font-style: italic;
          font-size: 0.26rem;
          &.flaptext {
            position: absolute;
            bottom: -5px;
            left: 50%;
            /* transform: translateY(-19%); */
            width: 100%;
            margin-left: -50%;
            text-align: center;
            font-style: italic;
            font-weight: bold;
            font-size: 0.3rem;
          }
          p {
            padding: 0 0.03rem;
          }
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
            // font-style: italic;
            font-size: 0.26rem;
          }
        }
        .imgbox {
          width: 0.3rem;
          float: left;
          margin-left: -0.1rem;
          height: 0.45rem;
          img {
            width: 100%;
            height: 0.45rem;
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
          .wlCoin {
            left: 50%;
            transform: translateX(-50%);
            top: -0.3rem;
          }
          .imgbox {
            width: 0.42rem;
            float: left;
            margin-left: 0.05rem;
            height: 0.63rem;
            img {
              width: 100%;
              height: 0.63rem;
            }
          }
          // 我的牌型
          .myflap {
            position: absolute;
            bottom: 0.05rem;
            /* width: 100%; */
            left: 50%;
            z-index: 2;
            font-weight: 700;
            background-image: -webkit-linear-gradient(top, #f6f39d, #b46500);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-size: 0.35rem;
            font-style: italic;
            transform: translateX(-50%);
            p {
              padding: 0 0.03rem;
            }
          }
        }
      }
    }
  }

  // 下注
  .betdetail {
    margin-left: 0.2rem;
    margin-bottom: 0.1rem;

    &.otherbet {
      position: absolute;
      bottom: -0.2rem;
      right: 42%;
    }
    &.leftbet {
      right: 30%;
    }
    p {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 0.05rem;
      margin-left: -0.05rem;
      padding-left: 0.02rem;
      text-indent: 0.08rem;
      padding-right: 0.05rem;
      color: #fff;
    }
    img {
      width: 0.2rem;
      height: 0.2rem;
      position: relative;
      z-index: 2;
    }
  }
  // 下注超出
  .hintmsg {
    position: absolute;
    top: 50%;
    right: 10%;
    z-index: 3;
    transform: translateY(-50%);
    color: #e49215;
    font-weight: bold;
    font-size: 0.18rem;
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
    width: 1.6rem;
    text-align: center;
  }
  // 操作区域
  .optionsbox {
    position: absolute;
    right: 0.3rem;
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
      .flopbtn {
        padding: 0.05rem 0.1rem;
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
    align-items: center;
    button {
      width: 0.7rem;
      margin-right: 0.1rem;
      padding: 0.01rem 0;
    }
    .editselfbtn {
      margin-top: -0.25rem;
      p {
        border: 0.02rem solid #ffe400;
        background: #ffe400;
        text-align: center;
        color: #fff;
        margin: 0 0.1rem;
        padding: 0.02rem;
        font-size: 0.18rem;
        border-radius: 0.06rem;
        min-width: 0.3rem;
      }
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

/* flex */
.flex {
  display: -webkit-flex;
  display: flex;
}

.juscon-start {
  justify-content: start;
}
.juscon-center {
  justify-content: center;
}

.juscon-between {
  justify-content: space-between;
}

.alignitem-center {
  align-items: center;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 0.5rem;
}
.test {
  position: fixed;
  right: 0.5rem;
  top: 0;
}
</style>
