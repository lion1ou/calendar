<template>
  <div class="calendar-sidebar" :style="{ width: openSidebar ? '250px' : '0px' }">
    <div class="sidebar-weather">
      <!-- 天气现象代码说明: https://docs.seniverse.com/api/start/code.html -->
      <img class="weather-img" :src="`http://cdn.chuyunt.com/weather/white/${weatherData.daily.length ? weatherData.daily[0].code_day : '99'}@2x.png`" alt="" />
      <!-- 用于切换黑夜模式 -->
      <!-- <img class="weather-img" :src="`http://cdn.chuyunt.com/weather/black/${weatherData.daily[0].code_day}@2x.png`" alt="" /> -->
      <div class="weather-info">
        {{ weatherData.location.name }} {{ weatherData.daily.length ? weatherData.daily[0].text_day : '未知' }} {{ weatherData.daily.length ? weatherData.daily[0].low + ' - ' : '' }}
        {{ weatherData.daily.length ? weatherData.daily[0].high : 0 }} ℃
      </div>
      <div class="last-update" @click="getWeather">{{ weatherData.daily.length ? `更新时间：${lastUpdate}` : '点击刷新' }}</div>
    </div>
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
export default defineComponent({
  name: 'CalendarHeader',
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
    async getWeather() {
      // 'http://api.seniverse.com/v3/weather/daily.json?key=WWLXWJGTJL&location=hangzhou&language=zh-Hans&unit=c&start=0&days=1'
      try {
        let res = await window.exports.request.getWeatherDaily()
        console.log(res)
        if (res.results && res.results.length) {
          this.weatherData = res.results[0]
          let { year, month, day, hour, minutes } = getYearMonthDay(res.results[0].last_update)
          this.lastUpdate = `${year}-${month}-${day} ${this.addZero(hour)}:${this.addZero(minutes)}`
        }
      } catch (error) {
        console.log('console.log(error)', error)
      }
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
    window.utools &&
      window.utools.onPluginEnter(({ code, type, payload, optional }) => {
        console.log('用户进入插件', code, type, payload, optional)
        this.getWeather()
      })
    this.getWeather()
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
.sidebar-weather {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 250px;
  .weather-img {
    width: 90px;
    height: auto;
    margin-bottom: 24px;
  }
  .weather-info {
    font-weight: 100;
    font-size: 20px;
  }
  .last-update {
    font-size: 10px;
    margin-top: 8px;
    font-weight: 100;
    opacity: 0.5;
  }
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
