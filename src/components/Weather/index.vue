<template>
  <div class="sidebar-weather">
    <!-- 天气现象代码说明: https://docs.seniverse.com/api/start/code.html -->
    <img class="weather-img" :src="`http://cdn.chuyunt.com/weather/white/${weatherData.daily.length ? weatherData.daily[0].code_day : '99'}@2x.png`" alt="" />
    <!-- 用于切换黑夜模式 -->
    <!-- <img class="weather-img" :src="`http://cdn.chuyunt.com/weather/black/${weatherData.daily[0].code_day}@2x.png`" alt="" /> -->
    <div class="weather-info">{{ weatherData.daily.length ? weatherData.daily[0].text_day : '未知' }} {{ weatherData.daily.length ? `${weatherData.daily[0].wind_direction} 风` : '未知' }}</div>
    <div class="weather-info">
      {{ weatherData.daily.length ? weatherData.daily[0].low + ' - ' : '' }}
      {{ weatherData.daily.length ? weatherData.daily[0].high : 0 }} ℃
    </div>
    <div class="weather-info">
      {{ weatherData.location.name }}
    </div>
    <div class="last-update" @click="getWeather">{{ weatherData.daily.length ? `更新时间：${lastUpdate}` : '点击刷新' }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getWeatherDaily } from '../../utils/api'
export default defineComponent({
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
  setup() {},
  methods: {
    async getWeatherDaily() {
      let res = await getWeatherDaily()
      this.weatherData = res.results[0]
      this.lastUpdate = res.results[0].last_update
    }
  },
  created() {
    window.utools &&
      window.utools.onPluginEnter(({ code, type, payload, optional }) => {
        console.log('用户进入插件', code, type, payload, optional)
        this.getWeatherDaily()
      })
    this.getWeatherDaily()
  }
})
</script>
<style lang="less" scoped>
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
</style>