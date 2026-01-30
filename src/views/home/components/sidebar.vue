<template>
  <div class="calendar-sidebar">
    <slot name="weather" />
    <div class="sidebar-info-group">
      <div class="current-time">
        {{ time.hour }}
        <span class="time-symbol">:</span>
        {{ time.minute }}
      </div>
      <div class="sidebar-info">
        <div class="sidebar-info-main">
          <span>{{ currentDate.lunar.gzYear }}{{ currentDate.lunar.Animal }}年</span>
          <span
            >农历{{ currentDate.lunar.isLeap ? '闰' : '' }}
            {{ currentDate.lunar.IMonthCn }}
            {{ currentDate.lunar.IDayCn }}</span
          >
        </div>
        <div class="sidebar-info-sub">
          <span>{{ currentDate.lunar.astro }}</span>
          <span>第 {{ currentDate.yearNumWeek }} 周</span>
          <span>{{ currentDate.festivalStrAll }}</span>
        </div>
      </div>
    </div>
    <slot name="schedule" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getDate } from '@/utils';

export default defineComponent({
  name: 'CalendarHeader',
  props: {
    currentDate: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      sI: null,
      time: {
        hour: getDate().hour,
        minute: getDate().minute,
      },
    };
  },
  created() {
    this.getTime();
  },
  beforeUnmount() {
    clearInterval(this.sI);
  },
  methods: {
    getTime() {
      this.sI = setInterval(() => {
        const { hour, minute } = getDate();
        this.time = { hour, minute };
      }, 1000);
    },
  },
});
</script>

<style lang="less" scoped>
.calendar-sidebar {
  width: 100%;
  color: var(--white-color);
  position: relative;
  box-sizing: border-box;
  transition: all 0.5s;
  white-space: nowrap;
}

.current-time {
  margin: 2.25rem 0;
  color: var(--white-color);
  font-size: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .time-symbol {
    animation: 2s infinite identifier;
    margin-bottom: 0.5rem;
  }
}
.sidebar-info-group {
  height: 15rem;
  overflow-x: hidden;
  overflow-y: auto;
}
.sidebar-info {
  &::before {
    content: ' ';
    width: 0.25rem;
    height: 0.25rem;
    border-radius: 0.25rem;
    box-shadow: 0px 0px 0.6rem 0.1rem var(--main-color);
    background: var(--main-color);
    position: absolute;
    left: 0.75rem;
    top: 0;
    bottom: 0;
    margin: auto 0;
  }

  position: relative;
  margin: 0px 0.75rem;
  padding: 0.75rem 0.75rem 0.75rem 2rem;
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  background: var(--bg-color);
  box-sizing: border-box;
  color: var(--text-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  .sidebar-info-main {
    font-size: 0.88rem;
    span + span {
      margin-left: 0.63rem;
    }
  }
  .sidebar-info-sub {
    font-size: 0.75rem;
    color: var(--sub-text-color);
    span + span {
      margin-left: 0.63rem;
    }
  }
}
</style>
<style lang="less">
@keyframes identifier {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
