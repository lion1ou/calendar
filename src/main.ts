import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { createStore } from 'vuex';
import { create, NDropdown, NButtonGroup, NButton, NSpin, NMessageProvider } from 'naive-ui';

import App from './App.vue';
import routes from './routes';
import stores from './store/index';
import './utils/type';
import '@/assets/iconfont.css';

const router = createRouter({ history: createWebHashHistory(), routes });
const store = createStore(stores);
const naive = create({ components: [NDropdown, NButtonGroup, NButton, NSpin, NMessageProvider] });

const app = createApp(App);

app.use(router);
app.use(store);
app.use(naive);

app.mount('#app');
