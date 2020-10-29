import Vue from 'vue'
import App from './App'

// import judgeCards from '@/util/judgeCards.js'
import remFn from './util/rem.js'

Vue.config.productionTip = false
// Vue.prototype.hintCards = hintCards
Vue.prototype.remFn = remFn


App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
