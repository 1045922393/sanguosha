import { createApp, createRenderer } from 'vue';
// import App from './App.vue'
import Villiam from './view/sanguosha/index.vue';
import './index.less';
// import resize from './utils/resize';
import 'vue-global-api';
import 'element-plus/dist/index.css';

// resize();
// vue3变动 不再使用 new Vue();
const app = createApp(Villiam);

app.mount('#app');

// 自定义渲染函数 createRenderer
// createElement insert
const nodeOps = {
  createElement(tag, isSVG, is) {
    return { tag };
  },
  insert(child, parent, anchor) {
    // 处理元素插入逻辑
    // 1.如果是真是dom元素 在这里会是canvas 需要绘制
    child.parent = parent;
    if (!parent.childs) {
      parent.childs = [child];
    } else {
      parent.childs.push(child);
    }
  },
};
