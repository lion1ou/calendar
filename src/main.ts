import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { createStore } from 'vuex';
import { create, NDropdown, NButtonGroup, NButton, NSpin, NMessageProvider } from 'naive-ui';

import App from './App.vue';
import routes from './routes';
import stores from './store/index';
import { isUtools } from './utils/common';
import './utils/type';
import '@/assets/iconfont.css';

const s = document.createElement('script');
s.defer = true;
s.src = 'https://umami.n.lion1ou.tech:16666/script.js';
s.dataset.websiteId = '9149cebd-0e3d-440c-8000-33871fc85ba6';
document.head.appendChild(s);

const router = createRouter({ history: createWebHashHistory(), routes });
const store = createStore(stores);
const naive = create({ components: [NDropdown, NButtonGroup, NButton, NSpin, NMessageProvider] });

const app = createApp(App);

app.use(router);
app.use(store);
app.use(naive);

app.mount('#app');
