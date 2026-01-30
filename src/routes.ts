const Home = () => import('./views/home/index.vue');
// const Setting = () => import('../pages/setting.vue')

export const routes = [
  { path: '/', component: Home, name: 'Home' },
  // { path: '/setting', component: Setting, name: 'Setting' },
];

export default [...routes];
