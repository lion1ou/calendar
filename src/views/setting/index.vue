<template>
  <div class="calendar-setting" :class="{ 'show-setting': !!show }">
    <div>
      <div class="header-title">设置</div>
      <div class="header-close" @click="close">
        <i class="iconfont icon-delete" />
      </div>
    </div>
    <div class="setting-container">
      <div class="setting-category">样式设置</div>
      <setting-item title="主题选择">
        <n-dropdown
          trigger="click"
          placement="bottom-end"
          :options="themeConfig"
          key-field="value"
          :render-label="renderLabel"
          @select="handleSelect($event, 'themeKey')"
        >
          <div class="flex-end">
            <span>{{ curTheme.themeName || '请选择' }}</span>
            <span
              class="theme-color-block"
              :style="{ backgroundColor: curTheme.config.mainColor || '' }"
            />
          </div>
        </n-dropdown>
      </setting-item>

      <setting-item title="黑暗模式">
        <n-dropdown
          trigger="click"
          placement="bottom-end"
          :options="DARKMODE_CONFIG"
          key-field="value"
          @select="handleSelect($event, 'darkMode')"
        >
          <div class="dark-mode-item">
            <i
              class="iconfont"
              :class="{
                'icon-outline-moon': curTheme.darkMode === 'dark',
                'icon-outline-sun': curTheme.darkMode === 'light',
              }"
            />
            <span>{{ curTheme.darkModeName || '请选择' }}</span>
          </div>
        </n-dropdown>
      </setting-item>

      <div class="setting-category">日历设置</div>
      <setting-item title="周起始">
        <n-dropdown
          trigger="click"
          placement="bottom-end"
          :options="WEEK_NAME_MAP"
          key-field="id"
          @select="handleSelect($event, 'weekStart')"
        >
          <div>周{{ WEEK_NAME_MAP[userConfig.weekStart].label }}</div>
        </n-dropdown>
      </setting-item>

      <div class="setting-category">关于</div>
      <setting-item title="GitHub">
        <a
          class="github-link"
          href="https://github.com/lion1ou/calendar"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg class="github-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
          <span>github.com/lion1ou/calendar</span>
        </a>
      </setting-item>
      <setting-item title="快捷键">
        <n-dropdown
          placement="bottom-end"
          trigger="click"
          :options="[{ key: 'header', type: 'render', render: renderShortcuts }]"
        >
          <span class="click">查看</span>
        </n-dropdown>
      </setting-item>
      <setting-item title="作者微信">
        <n-dropdown
          trigger="click"
          placement="bottom-end"
          :options="[{ key: 'header', type: 'render', render: renderQRCode }]"
        >
          <span class="click">二维码</span>
        </n-dropdown>
      </setting-item>
      <setting-item v-if="isUtools" title="网页版">
        <div class="flex-end">
          <span class="link click" @click="copy">https://toy.lion1ou.tech/calendar/#/</span>
          <span class="link-tip">(更新更及时)</span>
        </div>
      </setting-item>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, h } from 'vue';
import settingItem from './components/settingItem.vue';
import { THEME_CONFIG, DARKMODE_CONFIG, WEEK_NAME_MAP } from '@/config';
import { useStore } from 'vuex';
import { isUtools } from '@/utils';
import { useMessage } from 'naive-ui';

export default defineComponent({
  components: {
    settingItem,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const store = useStore();
    const curTheme = computed(() => store.state.curTheme);
    const userConfig = computed(() => store.getters.getUserConfig);

    // 控制设置页面展示
    const close = () => {
      context.emit('update:show', false);
    };

    // 主题相关
    const themeConfig = computed(() =>
      THEME_CONFIG.map(i => ({
        label: i.themeName,
        value: i.themeKey,
        config: i.config,
      }))
    );
    const renderLabel = (options: any) =>
      h(
        'div',
        {
          style: {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        },
        [
          h('div', { style: { marginRight: '30px' } }, options.label),
          h(
            'div',
            {
              style: {
                width: '1rem',
                height: '1rem',
                backgroundColor: `${options.config.mainColor}`,
              },
            },
            ''
          ),
        ]
      );

    const handleSelect = (key: Event, dataKey: string) => {
      store.commit('setUserConfig', { [dataKey]: key });
    };

    // 自定义渲染dropdown

    const renderCustom = (url: string, text: string) =>
      h(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '1rem',
          },
        },
        [
          h(
            'div',
            {
              style: {
                width: 'auto',
                minWidth: '8rem',
                height: '12rem',
                marginBottom: '.8rem',
              },
            },
            h('img', { src: url })
          ),
          h('div', { style: { fontSize: '0.8rem' } }, text),
        ]
      );
    const renderQRCode = () =>
      renderCustom('https://cdn.chuyunt.com/chuyun-qrcode.png?imageslim', '作者微信');
    const renderShortcuts = () =>
      renderCustom('https://cdn.chuyunt.com/PicGo/shortcuts.png?imageslim', `快捷键`);

    const message = useMessage();
    const copy = () => {
      if (isUtools) {
        window.utools.copyText('https://toy.lion1ou.tech/calendar/#/');
        message.success('链接复制成功');
      }
    };

    return {
      isUtools,
      close,
      curTheme,
      userConfig,
      themeConfig,
      renderLabel,
      handleSelect,
      DARKMODE_CONFIG,
      renderQRCode,
      renderShortcuts,
      WEEK_NAME_MAP,
      copy,
    };
  },
});
</script>

<style lang="less" scoped>
.click {
  cursor: pointer;
}
.calendar-setting {
  position: absolute;
  top: 100%;
  left: 100%;
  background: var(--bg-color);
  width: 100%;
  height: 100%;
  transition: all 0.5s;
  z-index: 1000;
}
.show-setting {
  top: 0;
  left: 0;
}
.header-title {
  font-weight: 500;
  width: 100%;
  text-align: center;
  height: 2.5rem;
  line-height: 2.5rem;
  font-size: 1.13rem;
  padding: 0.63rem 0;
}
.header-close {
  position: absolute;
  top: 1.2rem;
  right: 3rem;
  line-height: 1.4rem;
  i {
    color: var(--text-color);
    font-size: 1.5rem;
  }
}

.setting-container {
  max-width: 30rem;
  height: calc(100% - 5rem);
  overflow: auto;
  margin: auto;
  &::-webkit-scrollbar {
    width: 0.1rem;
  }
  .setting-category {
    font-size: 1rem;
    font-weight: 500;
    padding: 1.25rem 0;
  }
}

.theme-color-block {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
}

.dark-mode-item {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  span {
    margin-left: 0.5rem;
  }
  i {
    font-size: 0.8rem;
  }
}

.link {
  color: var(--main-color);
}
.link-tip {
  font-size: 0.6rem;
  margin-left: 0.5rem;
  color: var(--sub-text-color);
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--main-color);
  text-decoration: none;
  font-size: 0.88rem;
  &:hover {
    text-decoration: underline;
  }
  .github-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }
}
</style>
