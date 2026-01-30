<template>
  <div class="calendar-view">
    <n-config-provider :theme-overrides="naiveUIConfig" style="flex: 0 0 100%">
      <n-message-provider placement="bottom">
        <router-view v-show="!loading" />
        <div v-show="loading" class="empty-loading flex-center">
          <n-spin size="large" />
        </div>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import { NConfigProvider } from 'naive-ui';
import { isUtools, getBaseInfo } from '@/utils';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'App',
  components: { NConfigProvider },
  setup() {
    const store = useStore();
    const loading = ref(true);

    onBeforeMount(() => {
      if (isUtools) {
        window.utools.onPluginReady(() => {
          loading.value = false;
          init();
        });
        const sT = setTimeout(() => {
          loading.value = false;
          clearTimeout(sT);
        }, 5000);
      } else {
        loading.value = false;
        init();
      }
    });

    const init = () => {
      const userConfig = getBaseInfo();
      store.commit('setUserConfig', userConfig);
    };

    const naiveUIConfig = computed(() => {
      // 设置naive UI的主题颜色
      const { mainColor } = store.state.curTheme?.config;
      return {
        common: {
          primaryColor: mainColor,
          primaryColorHover: mainColor,
          primaryColorPressed: mainColor,
          primaryColorSuppl: mainColor,
        },
      };
    });

    return {
      naiveUIConfig,
      loading,
    };
  },
});
</script>

<style lang="less">
html {
  @media (max-width: 5000px) {
    font-size: 26px;
  }

  @media (max-width: 1600px) {
    font-size: 24px;
  }

  @media (max-width: 1400px) {
    font-size: 22px;
  }

  @media (max-width: 1200px) {
    font-size: 20px;
  }

  @media (max-width: 1000px) {
    font-size: 18px;
  }

  @media (max-width: 800px) {
    font-size: 16px;
  }

  @media (max-width: 600px) {
    font-size: 14px;
  }

  @media (max-width: 500px) {
    font-size: 12px;
  }
}

@font-face {
  font-family: 'GemunuLibre-Regular';
  src: url('./assets/GemunuLibre-Regular.ttf');
}

body {
  background: var(--bg-color);
  width: 100%;
  height: 100%;
}

#app {
  background: var(--bg-color);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

* {
  margin: 0;
  padding: 0;
  user-select: none;
  font-family: 'GemunuLibre-Regular', Georgia, 'Times New Roman';
}

img {
  width: 100%;
  height: 100%;
}

:root {
  --main-color: #1439f6;
  --sub-main-color: #fc684c;
  --bg-color: #ffffff;
  --text-color: #2c2c2e;
  --sub-text-color: #a1a0a3;
  --dis-text-color: #dbdbdb;
  --white-color: #ffffff;
  --shadow-color: rgba(0, 0, 0, 0.1);
  color-scheme: light dark;
}

.calendar-view {
  background: var(--bg-color);
  color: var(--text-color);
  width: 100%;
  max-width: 1800px;
  box-shadow: 0px 0px 1rem 0.5rem var(--shadow-color);
  overflow: hidden;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-loading {
  height: 100vh;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-end {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
