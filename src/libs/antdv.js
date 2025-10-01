import Vue from "vue";

import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Card,
  message,
  Modal,
  Space,
  Slider,
  Radio,
} from "ant-design-vue";

Vue.use(Radio);
Vue.use(Slider);
Vue.use(Space);
Vue.use(Card);
Vue.use(Form);
Vue.use(Input);
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);

Vue.prototype.$message = message;

Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$error = Modal.error;
