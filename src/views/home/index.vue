<template>
  <div class="calendar">
    <div class="calendar-main" :class="{ 'calendar-main-close': !openSidebar }">
      <calendar-header :current-date="currentDate" @change="monthOrYearChange" @back="backToday" />
      <calendar-content :current-date="currentDate" @select="selectDay" />
      <div class="sidebar-open-btn" @click="changeSider">
        <i
          class="iconfont icon-right"
          :style="{ transform: openSidebar ? '' : 'rotate(180deg)' }"
        />
      </div>
    </div>
    <div
      class="calendar-sidebar-content"
      :class="{ 'calendar-sidebar-content-close': !openSidebar }"
    >
      <calendar-sidebar :current-date="currentDate">
        <template #weather>
          <weather />
        </template>
        <template #schedule />
      </calendar-sidebar>
    </div>

    <a
      class="github-corner"
      href="https://github.com/lion1ou/calendar"
      target="_blank"
      rel="noopener noreferrer"
      title="GitHub"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
        />
      </svg>
    </a>
    <div class="more-btn" @click="toggleSetting">
      <!-- <div class="dot" /> -->
      <i class="iconfont icon-more icon-style" />
    </div>

    <setting v-model:show="showSetting" />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed, onMounted } from 'vue';
import calendarHeader from './components/calendar-header.vue';
import calendarContent from './components/calendar-content.vue';
import calendarSidebar from './components/sidebar.vue';
import weather from './weather/index.vue';
import setting from '../setting/index.vue';
import { getDateInfo } from '@/utils';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Calendar',
  components: {
    calendarHeader,
    calendarContent,
    calendarSidebar,
    weather,
    setting,
  },
  setup() {
    const store = useStore();

    const openSidebar = computed(() => store.getters.getUserConfig.sideOpen);
    const currentDate = ref(getDateInfo());
    const monthOrYearChange = (type: string, unit: string) => {
      const { year: oYear, month: oMonth, day: oDay } = currentDate.value;
      let year = oYear;
      let month = oMonth;
      let day = oDay;
      if (unit === 'month') {
        month = type === '+' ? oMonth + 1 : oMonth - 1;
      } else if (unit === 'year') {
        year = type === '+' ? oYear + 1 : oYear - 1;
      } else if (unit === 'week') {
        day = type === '+' ? oDay + 7 : oDay - 7;
      } else if (unit === 'day') {
        day = type === '+' ? oDay + 1 : oDay - 1;
      }
      if (unit === 'month' || unit === 'year') {
        const maxDay = new Date(year, month, 0).getDate();
        day = Math.min(day, maxDay);
      }
      currentDate.value = getDateInfo([year, month, day]);
    };
    const selectDay = (data: any) => {
      currentDate.value = data;
    };
    const backToday = () => {
      currentDate.value = getDateInfo();
    };

    const showSetting = ref(false);
    const toggleSetting = () => {
      showSetting.value = !showSetting.value;
    };

    const changeSider = () => {
      store.commit('setUserConfig', { sideOpen: !openSidebar.value });
    };

    onMounted(() => {
      let sT: any = setTimeout(() => {
        (window as any).FantaReport.pageView();
        sT = null;
        clearTimeout(sT);
      }, 1000);
    });

    return {
      currentDate,
      monthOrYearChange,
      selectDay,
      backToday,
      showSetting,
      toggleSetting,
      openSidebar,
      changeSider,
    };
  },
});
</script>

<style lang="less" scoped>
.calendar {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100vh;
  @media (max-width: 700px) {
    flex-direction: column;
  }
}

.calendar-main {
  padding: 2rem 3.25rem;
  box-sizing: border-box;
  transition: all 0.5s;
  position: relative;
  transition: all 0.5s;
  width: 66%;
  @media (max-width: 700px) {
    width: 100%;
  }
}
.calendar-main-close {
  width: 100%;
  @media (max-width: 700px) {
    width: 100%;
  }
}
.calendar-sidebar-content {
  display: flex;
  justify-items: center;
  align-items: center;
  background: var(--main-color);
  width: 34%;
  transition: all 0.5s;
  overflow: hidden;
  align-self: stretch;
  @media (max-width: 700px) {
    width: 100%;
  }
}
.calendar-sidebar-content-close {
  width: 0%;
  @media (max-width: 700px) {
    width: 100%;
  }
}

.sidebar-open-btn {
  z-index: 100;
  height: 5rem;
  width: 0.6rem;
  background: var(--shadow-color);
  position: absolute;
  top: 15rem;
  right: 0;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    font-size: 0.5rem;
    transition: all 0.5s;
  }
  @media (max-width: 700px) {
    display: none;
  }
}

.github-corner {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  width: 2rem;
  height: 2rem;
  color: var(--text-color);
  opacity: 0.7;
  transition: opacity 0.2s;
  &:hover {
    opacity: 1;
  }
  svg {
    width: 100%;
    height: 100%;
  }
}

.more-btn {
  background: var(--bg-color);
  height: 2.5rem;
  width: 2.5rem;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  border-radius: 1.63rem;
  text-align: center;
  line-height: 2.5rem;
  font-weight: 100;
  box-shadow: 1px 1px 0.8rem 0.5rem var(--shadow-color);
  .icon-style {
    font-size: 1.5rem;
  }
  .dot {
    position: absolute;
    top: 0;
    right: 0;
    width: 0.5rem;
    height: 0.5rem;
    background: red;
    border-radius: 50%;
  }
}
</style>
