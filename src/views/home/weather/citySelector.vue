<template>
  <div>
    <div class="weather-info-location" @click="toggleCitySelect">
      <span>{{ curCity.countyName }}</span>
      <i class="iconfont icon-up" :class="{ 'img-expand': showCitySelect }" />
    </div>
    <div
      class="city-select"
      :class="{ 'city-select-open': showCitySelect }"
      :style="{ top: `${citySelectorPosition}px` }"
    >
      <div class="city-search">
        <input
          v-model="filterText"
          class="city-search-input"
          type="text"
          placeholder="可搜索所在城市"
        />
      </div>
      <div class="city-list">
        <div
          v-for="item in filterCityList"
          :key="item.cityCode + item.adCode"
          class="city-item"
          @click="selectCity(item)"
        >
          <span v-if="item.cityName">{{ item.cityName }} /</span> {{ item.countyName }}
        </div>
      </div>
    </div>
    <div
      v-if="showCitySelect && citySelectorPosition"
      class="city-select-bg"
      @click.stop="showCitySelect = false"
    />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import cityList from '../../../constant/CityAdCode2020';

export default defineComponent({
  props: {
    curCity: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, content) {
    const showCitySelect = ref(false);
    const filterText = ref('');
    const allCityList = ref(cityList);

    const citySelectorPosition = ref(null);

    const toggleCitySelect = (_event: any) => {
      citySelectorPosition.value = _event.target.offsetTop + _event.target.offsetHeight;
      showCitySelect.value = !showCitySelect.value;
    };

    watch(showCitySelect, () => {
      const inputEl = document.querySelector('.city-search-input') as HTMLInputElement | null;
      inputEl?.focus();
    });

    const filterCityList = computed(() =>
      allCityList.value.filter(
        item =>
          `${item.cityName} ${item.countyName}`.indexOf(filterText.value) > -1 ||
          `${item.cityPy.join(',')} ${item.countyPy.join(',')}`.indexOf(filterText.value) > -1
      )
    );

    watch(filterCityList, () => {
      document.querySelector('.city-list')?.scrollTo(0, 0);
    });

    return {
      showCitySelect,
      filterText,
      filterCityList,
      selectCity(item: any) {
        content.emit('selected', item);
        showCitySelect.value = false;
      },
      citySelectorPosition,
      toggleCitySelect,
    };
  },
});
</script>

<style lang="less" scoped>
.weather-info-location {
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  opacity: 0.8;

  span {
    margin-right: 0.31rem;
  }

  i {
    transition: all 0.5s;
    font-size: 0.7rem;
  }

  .img-expand {
    transform: rotate(180deg);
  }
}

.city-select-bg {
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}

.city-select {
  position: absolute;
  top: 9rem;
  right: 1rem;
  z-index: 101;
  width: 10rem;
  height: 0;
  font-size: 0.75rem;
  transition: all 0.5s;
  overflow: hidden;
  background: var(--bg-color);
  color: var(--text-color);
  border-radius: 0.25rem;
  padding: 0 0.5rem;
  box-shadow: 0.13rem 0.13rem 0.75rem rgba(0, 0, 0, 0.3);

  .city-search {
    padding: 0.5rem 0;
    position: sticky;
    top: 0;
  }

  .city-search-input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 0.13rem;
    height: 1.5rem;
    line-height: 1.13rem;
    font-size: 0.75rem;
    outline: none;
    padding: 0 0.31rem;
    background: var(--bg-color);
    color: var(--text-color);

    &::placeholder {
      color: #ccc;
      background: var(--bg-color);
    }
  }

  .city-list {
    height: calc(100% - 3rem);
    overflow: auto;
  }

  .city-item {
    padding: 5px 0px;
  }
}

.city-select-open {
  height: 18rem;
}
</style>
