<template>
  <div class="sidebar-weather">
    <div class="weather-content">
      <div class="weather-img">
        <img :src="curImage" alt="天气图标" />
      </div>
      <div class="weather-info">
        <div class="weather-info-base">
          {{ weatherDetails.text }}
        </div>
        <div class="weather-info-base">
          <span class="big-size">{{ weatherDetails.temp }} ℃</span>
        </div>
        <div class="weather-info-base">
          <!-- <span class="small-size">{{ weatherDetails.windDir }}</span> -->
          <span class="small-size">湿度：{{ weatherDetails.humidity }}%</span>
        </div>
      </div>
    </div>

    <div class="weather-footer">
      <div class="last-update" @click="reloadWeather">
        {{ loadingTip || weatherDetails.reportTime }}
      </div>
      <city-selector :cur-city="curCity" @selected="selectCity" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue';
import citySelector from './citySelector.vue';
import { fetchNowWeather, WeatherInfo } from '@/api';
import { useStore } from 'vuex';
import { getStorage, setStorage } from '@/utils';
import { DEFAULT_CITY } from '@/config';

const emptyData: WeatherInfo = {
  province: '',
  city: '',
  text: '--',
  temp: '-',
  windDir: '', // 不准
  windPower: '', // 不准
  humidity: '-',
  code: '99',
  adCode: '',
  whiteImg: 'https://cdn.lion1ou.tech/weather/white/99@2x.png',
  blackImg: 'https://cdn.lion1ou.tech/weather/black/99@2x.png',
  reportTime: '',
};

export default defineComponent({
  components: {
    citySelector,
  },
  setup() {
    const Store = useStore();
    const loadingTip = ref('');
    const weatherDetails = ref(emptyData);
    const store = getStorage('current-city')
    const curCityStore = store?.adCode ? store : DEFAULT_CITY;

    console.log('curCityStore', curCityStore);
    const curCity = ref(curCityStore);

    const curImage = computed(() => {
      const { darkMode } = Store.getters.getCurTheme;
      if (darkMode === 'dark') {
        return weatherDetails.value.blackImg;
      }
      return weatherDetails.value.whiteImg;
    });

    const getNowWeatherFn = async (location: string) => {
      console.log('getNowWeatherFn', location);
      loadingTip.value = 'loading...';
      const res = await fetchNowWeather(location);
      loadingTip.value = '';
      weatherDetails.value = res || emptyData;
      const { adCode, city: countyName } = res || emptyData;
      setStorage('current-city', { adCode, countyName });
      loadingTip.value = res ? '' : '加载失败，请重试。';
    };

    watchEffect(() => {
      getNowWeatherFn(curCity.value.adCode);
    });

    // // 获取定位
    // const getLocationData = async () => {
    //   try {
    //     loadingTip.value = "定位中...";
    //     const { coords } = (await getLocation()) as any;
    //     loadingTip.value = "定位成功";
    //     getNowWeatherFn(`${coords.latitude},${coords.longitude}`);
    //   } catch (error) {
    //     loadingTip.value = "定位失败";
    //     getNowWeatherFn(curCity.value.adCode);
    //     console.error(error);
    //   }
    // };

    // onMounted(() => {
    //   getLocationData();
    // });

    return {
      weatherDetails,
      loadingTip,
      async reloadWeather() {
        getNowWeatherFn(curCity.value.adCode);
      },
      curImage,
      curCity,
      selectCity(item: any) {
        curCity.value = item;
      },
    };
  },
});
</script>

<style lang="less" scoped>
.sidebar-weather {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin: auto;
  white-space: nowrap;

  .weather-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 19rem;
    min-width: 14rem;
    padding: 0.5rem 1.25rem;
    box-sizing: border-box;

    .weather-img {
      width: 5rem;
      height: auto;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .weather-info-base {
      font-size: 0.88rem;

      span {
        margin-left: 0.63rem;

        &:first-child {
          margin-left: 0;
        }
      }

      .big-size {
        font-size: 1.38rem;
      }

      .small-size {
        font-size: 0.5rem;
      }
    }
  }

  .weather-footer {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;

    .last-update {
      font-size: 0.7rem;
      font-weight: 300;
      opacity: 0.8;
      cursor: pointer;
    }
  }
}
</style>
