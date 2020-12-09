<template>
  <view class>
    <button @tap="test()">text</button>
  </view>
</template>


<script>
export default {
  data() {
    return {
      resultlist: [
        {
          result: [
            {
              color: "fk",
              num: "6",
              cardColor: 1,
              src: "../../static/image/card/6-fk.png",
              cardValue: "6"
            },
            {
              color: "ht",
              num: "5",
              cardColor: 4,
              src: "../../static/image/card/5-ht.png",
              cardValue: "5"
            },
            {
              color: "hx",
              num: "5",
              cardColor: 3,
              src: "../../static/image/card/5-hx.png",
              cardValue: "5"
            },
            {
              color: "hx",
              num: "4",
              cardColor: 3,
              src: "../../static/image/card/4-hx.png",
              cardValue: "4"
            },
            {
              color: "mh",
              num: "4",
              cardColor: 2,
              src: "../../static/image/card/4-mh.png",
              cardValue: "4"
            }
          ]
        },
        {
          result: [
            {
              color: "hx",
              num: "J",
              cardColor: 3,
              src: "../../static/image/card/11-hx.png",
              cardValue: 11
            },
            {
              color: "mh",
              num: "8",
              cardColor: 2,
              src: "../../static/image/card/8-mh.png",
              cardValue: "8"
            },
            {
              color: "fk",
              num: "8",
              cardColor: 1,
              src: "../../static/image/card/8-fk.png",
              cardValue: "8"
            },
            {
              color: "mh",
              num: "6",
              cardColor: 2,
              src: "../../static/image/card/6-mh.png",
              cardValue: "6"
            },
            {
              color: "ht",
              num: "10",
              cardColor: 4,
              src: "../../static/image/card/10-ht.png",
              cardValue: "10"
            }
          ]
        },

        {
          result: [
            {
              color: "fk",
              num: "6",
              cardColor: 1,
              src: "../../static/image/card/6-fk.png",
              cardValue: "8"
            },
            {
              color: "ht",
              num: "5",
              cardColor: 4,
              src: "../../static/image/card/5-ht.png",
              cardValue: "5"
            },
            {
              color: "hx",
              num: "5",
              cardColor: 3,
              src: "../../static/image/card/5-hx.png",
              cardValue: "5"
            },
            {
              color: "hx",
              num: "4",
              cardColor: 3,
              src: "../../static/image/card/4-hx.png",
              cardValue: "4"
            },
            {
              color: "mh",
              num: "4",
              cardColor: 2,
              src: "../../static/image/card/4-mh.png",
              cardValue: "4"
            }
          ]
        }
      ]
    };
  },

  methods: {
    test() {
      //   var last = this.sortCard(this.cardlist);
      //   var yours = this.sortCard(this.list2);
      //   console.log(last);
      //   console.log(yours);
      //  console.log( this.follow(last, yours));
      var resultlist = this.resultlist;
      for (var i = resultlist.length - 1; i > 0; i--) {
        for (var j = 0; j < i; j++) {
          var follow = this.follows(
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
      console.log(resultlist);
    },
    // 排序
    sortCard(arr) {
      var min;
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (parseInt(arr[i].cardValue) < parseInt(arr[j].cardValue)) {
            min = arr[j];
            arr[j] = arr[i];
            arr[i] = min;
          }
        }
      }
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (
            parseInt(arr[i].cardValue) == parseInt(arr[j].cardValue) &&
            parseInt(arr[i].cardColor) < parseInt(arr[j].cardColor)
          ) {
            min = arr[j];
            arr[j] = arr[i];
            arr[i] = min;
          }
        }
      }
      return arr;
    },
    follows(one, two) {
      var last = this.sortCard(one);
      var yours = this.sortCard(two);
      if (parseInt(last[0].cardValue) > parseInt(yours[0].cardValue)) {
        // console.log('不一样')
        // console.log(last[i])
        // console.log(yours[i])
        return true;
      } else if (
        parseInt(last[0].cardValue) == parseInt(yours[0].cardValue) &&
        parseInt(last[0].cardColor) > parseInt(yours[0].cardColor)
      ) {
        // console.log('一样')
        // console.log(last[i])
        // console.log(yours[i])
        return true;
      }

      return false;
    }
  }
};
</script>
