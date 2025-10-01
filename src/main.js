import Vue from "vue";
import App from "./App.vue";

import "ant-design-vue/dist/antd.less";
import "./libs/antdv";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
