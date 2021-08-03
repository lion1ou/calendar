<template>
  <div class="calendar">
    <div class="calendar-main" :style="{ width: openSidebar ? '600px' : '850px' }">
      <calendar-header :currentDate="currentDate" @change="monthOrYearChange" @back="backToday"></calendar-header>
      <calendar-content :currentDate="currentDate" @select="selectDay"></calendar-content>
      <div class="sidebar-open" @click="changeSider">
        <img :src="arrowIcon" alt="" :style="{ transform: openSidebar ? 'rotate(180deg)' : '' }" />
      </div>
    </div>
    <calendar-sidebar :currentDate="currentDate" :openSidebar="openSidebar"></calendar-sidebar>
  </div>
</template>

<script lang="ts">
import calendarHeader from './calendar-header.vue'
import calendarContent from './calendar-content.vue'
import calendarSidebar from './calendar-sidebar.vue'
import { getYearMonthDay, getLunar, getBaseInfo, setBaseInfo } from '../../utils/tools.ts'
import { ref, defineComponent } from 'vue'
import arrowIcon from '../../assets/arrow.svg'
export default defineComponent({
  name: 'Calendar',
  components: {
    calendarHeader,
    calendarContent,
    calendarSidebar
  },
  data() {
    return {
      currentDate: { year: 0, month: 0, day: 0, lunar: {} },
      openSidebar: true,
      arrowIcon
    }
  },
  props: {},
  methods: {
    monthOrYearChange(type: String, unit: String) {
      if (unit === 'month') {
        let month = type === '+' ? this.currentDate.month + 1 : this.currentDate.month - 1
        if (month < 1) {
          this.currentDate.month = 12
          this.currentDate.year = this.currentDate.year - 1
        } else if (month > 12) {
          this.currentDate.month = 1
          this.currentDate.year = this.currentDate.year + 1
        } else {
          this.currentDate.month = month
        }
      } else {
        let year = type === '+' ? this.currentDate.year + 1 : this.currentDate.year - 1
        this.currentDate.year = year
      }
      const { year, month, day } = this.currentDate
      this.currentDate.lunar = getLunar(year, month, day)
    },
    selectDay(data: Object) {
      this.currentDate = data
    },
    backToday() {
      this.currentDate = getYearMonthDay()
    },
    changeSider() {
      this.openSidebar = !this.openSidebar
      setBaseInfo({ isShowSideBar: this.openSidebar })
    }
  },
  created() {
    console.log(getBaseInfo().isShowSideBar)
    if (getBaseInfo().isShowSideBar !== undefined) {
      this.openSidebar = getBaseInfo().isShowSideBar
    }
    this.currentDate = getYearMonthDay()
  }
})
</script>
<style>
:root {
  --main-color: #1439f6;
  --sub-main-color: #fc684c;
  --bg-color: #ffffff;
  --text-color: #2c2c2e;
  --sub-text-color: #a1a0a3;
  --dis-text-color: #dbdbdb;
}
</style>
<style lang="less" scoped>
.calendar {
  background: var(--bg-color);
  color: var(--text-color);
  max-width: 850px;
  min-width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-shadow: 0px 0px 16px 8px rgba(0, 0, 0, 0.1);
}
.calendar-main {
  padding: 32px 52px;
  box-sizing: border-box;
  transition: all 0.5s;
  position: relative;
}
.sidebar-open {
  z-index: 100;
  height: 120px;
  width: 24px;
  background: rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 240px;
  right: 0;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    transition: all 0.5s;
    width: 24px;
    color: #ffffff;
  }
}
</style>
