<template>
  <div class="sidebar-weather">
    <!-- 天气现象代码说明: https://docs.seniverse.com/api/start/code.html -->
    <img class="weather-img" :src="`http://cdn.chuyunt.com/weather/white/${weatherData.daily.length ? weatherData.daily[0].code_day : '99'}@2x.png`" alt="" />
    <!-- 用于切换黑夜模式 -->
    <!-- <img class="weather-img" :src="`http://cdn.chuyunt.com/weather/black/${weatherData.daily[0].code_day}@2x.png`" alt="" /> -->
    <div class="weather-info">{{ weatherData.daily.length ? weatherData.daily[0].text_day : '未知' }}</div>
    <div class="weather-info-temp">
      {{ weatherData.daily.length ? weatherData.daily[0].low + ' ~ ' : '' }}
      {{ weatherData.daily.length ? weatherData.daily[0].high : 0 }} ℃
    </div>
    <div class="weather-info-location" @click="showCitySelect = !showCitySelect" v-if="weatherData.location.name">
      {{ weatherData.location.name }}
      <img :src="arrowIcon" alt="" :style="{ transform: showCitySelect ? 'rotate(90deg)' : 'rotate(270deg)' }" />
    </div>
    <div class="last-update" @click="getWeatherDaily">{{ weatherData.daily.length ? `来自心知天气，更新于：${lastUpdateFormate}` : '点击刷新' }}</div>
    <div class="city-select" :style="{ height: showCitySelect ? '300px' : '0px' }">
      <div class="city-search">
        <input class="city-search-input" type="text" v-model="filterText" placeholder="可搜索所在城市" />
      </div>
      <div class="city-item" v-for="(item, index) in filterCityList" :key="item.cityId + index" @click="selectCity(item)">{{ item.city }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getWeatherDaily } from '../../utils/api'
import { getYearMonthDay, getBaseInfo, setBaseInfo } from '../../utils/tools'
import cityList from './cityList.json'
import arrowIcon from '../../assets/arrow.svg'
export default defineComponent({
  data() {
    return {
      cityList,
      arrowIcon,
      filterText: '',
      selectCityData: { cityId: 'WTMKQ069CCJ7', province: '浙江省/杭州市', city: '浙江/杭州/杭州', pinyin: 'Hangzhou' },
      weatherData: {
        location: {
          name: ''
        },
        daily: [],
        last_update: ''
      },
      lastUpdate: '',
      loading: false,
      showCitySelect: false
    }
  },
  computed: {
    lastUpdateFormate() {
      const obj = getYearMonthDay(this.lastUpdate)
      return `${obj.hour}:${obj.minutes}`
    },
    filterCityList() {
      const result = cityList.filter((item) => {
        return (
          item.city.split('/').includes(this.filterText) || item.city.split('/').some((i) => i.indexOf(this.filterText) === 0) || item.pinyin.toLowerCase().indexOf(this.filterText.toLowerCase()) === 0
        )
      })
      return result
    }
  },
  setup() {},
  methods: {
    getYearMonthDay,
    async getWeatherDaily(location: any) {
      if (this.loading) {
        return
      }
      this.loading = true
      let res = await getWeatherDaily(location)
      this.weatherData = res.results[0]
      this.lastUpdate = res.results[0].last_update
      let sT = setTimeout(() => {
        this.loading = false
        clearTimeout(sT)
      }, 500)
    },
    selectCity(item: object) {
      this.selectCityData = item
      this.showCitySelect = false
      this.getWeatherDaily(item.cityId)
      setBaseInfo({ selectCityData: item })
    }
  },
  created() {
    if (getBaseInfo().selectCityData && Object.keys(getBaseInfo().selectCityData).length) {
      this.selectCityData = getBaseInfo().selectCityData
    }
    if (window.utools) {
      window.utools.onPluginEnter(() => {
        this.getWeatherDaily(this.selectCityData.cityId)
      })
    }
    this.getWeatherDaily(this.selectCityData.cityId)
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
  .weather-info-temp {
    font-weight: 100;
    font-size: 14px;
  }
  .weather-info-location {
    font-weight: 100;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      transition: all 0.5s;
      width: 18px;
      color: #ffffff;
    }
  }
  .last-update {
    font-size: 10px;
    margin-top: 8px;
    font-weight: 100;
    opacity: 0.5;
    cursor: pointer;
  }
  .city-select {
    position: absolute;
    top: 235px;
    left: 10px;
    z-index: 100;
    transition: all 0.5s;
    max-height: 300px;
    width: 210px;
    overflow-y: auto;
    overflow-x: hidden;
    background: #fff;
    color: #333;
    border-radius: 4px;
    padding: 0 10px;
    box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.3);
    &::-webkit-scrollbar {
      width: 0px;
    }
    .city-search {
      padding: 10px 0;
      position: sticky;
      top: 0;
    }
    .city-search-input {
      width: 210px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 2px;
      height: 24px;
      line-height: 18px;
      font-size: 14px;
      outline: none;
      padding: 0 5px;
      &::placeholder {
        color: #ccc;
      }
    }
    .city-item {
      padding: 5px 0px;
    }
  }
}
</style>