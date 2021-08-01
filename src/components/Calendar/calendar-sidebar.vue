<template>
  <div class="calendar-sidebar" :style="{ width: openSidebar ? '250px' : '0px' }">
    <weather></weather>
    <div class="current-time">{{ addZero(getYearMonthDay().hour) }}<span class="time-symbol">:</span>{{addZero(getYearMonthDay().minutes)}}</div>
    <div class="sidebar-info-group">
      <div class="sidebar-info">
        <div class="sidebar-info-main">{{ currentDate.lunar.gzYear }}年 农历{{ currentDate.lunar.IMonthCn }}{{ currentDate.lunar.IDayCn }}</div>
        <div class="sidebar-info-sub">第 {{ getWeek }} 周</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getYearMonthDay } from './utils.ts'
import { ref, defineComponent } from 'vue'
import weather from '../Weather/index.vue'
export default defineComponent({
  name: 'CalendarHeader',
  components: {
    weather
  },
  data() {
    return {
      weatherData: {
        location: {
          name: ''
        },
        daily: [],
        last_update: ''
      },
      sI: null,
      lastUpdate: ''
    }
  },
  props: {
    currentDate: {
      type: Object,
      required: true
    },
    openSidebar: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showJin(): Boolean {
      const now = getYearMonthDay()
      return now.year !== this.currentDate.year || now.month !== this.currentDate.month || now.day !== this.currentDate.day
    },
    getWeek(sunday = false): Number {
      const milliseconds = 24 * 3600000
      let start = new Date(this.currentDate.year + '/01/01')
      let offset = start.getDay() > 0 ? 8 - start.getDay() : 1
      offset = sunday ? offset - 1 : offset
      return Math.abs(Math.ceil((new Date(`${this.currentDate.year}/${this.currentDate.month}/${this.currentDate.day}`).getTime() - start.getTime() - offset * milliseconds) / milliseconds / 7))
    }
  },
  methods: {
    getYearMonthDay(){
      return getYearMonthDay()
    },
    
    getTime() {
      this.sI = setInterval(() => {
        let { hour, minutes } = getYearMonthDay()
        this.time = `${this.addZero(hour)}:${this.addZero(minutes)}`
      }, 1000)
    },
    addZero(num: number) {
      let temp = num.toString()
      return temp.length === 1 ? '0' + num : num
    }
  },
  created() {
    this.getTime()
  },
  beforeUnmount() {
    clearInterval(this.sI)
  }
})
</script>
<style lang="less">
@keyframes identifier {
    0%{
      opacity: 1;
    }
    50%{
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }
  
</style>
<style lang="less" scoped>
.calendar-sidebar {
  height: 600px;
  background: var(--main-color);
  padding: 64px 0px;
  color: #ffffff;
  position: relative;
  box-sizing: border-box;
  transition: all 0.5s;
}
.current-time {
  margin: 48px 0;
  color: #ffffff;
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .time-symbol {
    animation: 2s infinite identifier;
    margin-bottom: 8px;
  }
}
.sidebar-info-group {
  height: 240px;
  overflow-x: hidden;
  overflow-y: auto;
}
.sidebar-info {
  width: 250px;
  &::before {
    content: ' ';
    width: 4px;
    height: 4px;
    border-radius: 4px;
    box-shadow: 0px 0px 8px var(--main-color);
    background: var(--main-color);
    position: absolute;
    left: 12px;
    top: 30px;
  }
  position: relative;
  margin: 12px 0px 12px 24px;
  padding: 12px 0 12px 32px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  background: #ffffff;
  height: 64px;
  box-sizing: border-box;
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  .sidebar-info-sub {
    font-size: 12px;
    color: var(--sub-text-color);
  }
}
</style>
