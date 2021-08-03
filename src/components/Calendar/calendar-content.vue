<template>
  <div class="calendar-content">
    <div class="content-week">
      <span v-for="i in weekMap" :key="i">{{ i }}</span>
    </div>
    <div class="content-day">
      <div class="content-line" v-for="(item, i) in dayMap" :key="i">
        <div
          v-for="j in item"
          :key="j.day"
          class="day-item"
          :class="{
            'is-today': j.isToday,
            'is-holiday': j.isHoliday,
            'is-weekend': j.isWeekend,
            'is-selected': j.isSelected,
            'is-workday': j.isWorkDay,
            'not-current-month': !j.isCurrentMonth
          }"
          @click="select(j)"
        >
          <span>{{ j.day }}</span>
          <span class="day-lunar" :class="{ 'is-festival': j.isFestival && !j.isSelected }">
            {{ j.lunar.festival ? j.lunar.festival : j.lunar.lunarFestival ? j.lunar.lunarFestival : j.lunar.IDayCn === '初一' ? j.lunar.IMonthCn : j.lunar.IDayCn }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { getYearMonthDay } from '../../utils/tools.ts'
import { holidayList, workdayList } from '../../utils/config.ts'
export default defineComponent({
  name: 'CalendarContent',
  data() {
    return {
      weekMap: ['日', '一', '二', '三', '四', '五', '六']
    }
  },
  components: {},
  props: {
    currentDate: { type: Object, required: true }
  },
  computed: {
    dayMap(): Array<T> {
      const dateStr = `${this.currentDate.year}/${this.currentDate.month}/1` // 每月1日
      let dateStrTime = new Date(dateStr).getTime()
      let dateStrWeek = new Date(dateStr).getDay()
      const firstDate = dateStrTime - dateStrWeek * 24 * 60 * 60 * 1000 // 日历的第一个日期
      const result = []
      for (let i = 0; i < 6 * 7; i++) {
        const current = new Date(firstDate + i * 24 * 60 * 60 * 1000)
        const { year, month, day, week, lunar } = getYearMonthDay(current)
        const now = getYearMonthDay()
        let isHoliday = false // 是否是假日
        holidayList.map((item: string) => {
          if (item === `${year}-${month}-${day}`) {
            isHoliday = true
          }
        })
        let isWorkDay = false // 是否是工作日
        workdayList.map((item: string) => {
          if (item === `${year}-${month}-${day}`) {
            isWorkDay = true
          }
        })
        const isSelected = this.currentDate.day === day && this.currentDate.month === month && this.currentDate.year === year // 是否选中
        const isToday = now.day === day && now.month === month && now.year === year // 是否是今天
        const isWeekend = week === 6 || week === 0 // 是否是周末
        const isCurrentMonth = month === this.currentDate.month // 是否属于当前月
        const isFestival = lunar.festival || lunar.lunarFestival
        // 6行，7天为一行
        if (!result[Math.floor(i / 7)]) {
          result[Math.floor(i / 7)] = []
        }
        result[Math.floor(i / 7)].push({ year, month, day, week, isHoliday, isWorkDay, isWeekend, isCurrentMonth, isToday, lunar, isSelected, isFestival })
      }
      return result
    }
  },
  methods: {
    select(data: Object) {
      this.$emit('select', data)
    }
  }
})
</script>

<style scoped lang="less">
.calendar-content {
  padding: 10px 0;
}
.content-week {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  span {
    display: inline-block;
    width: 60px;
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: var(--sub-text-color);
  }
}
.content-day {
  .content-line {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .day-item {
    display: inline-block;
    width: 60px;
    height: 60px;
    margin: 3px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    font-size: 20px;
    cursor: pointer;
    .day-lunar {
      font-size: 10px;
    }
  }
  .is-holiday,
  .is-workday {
    position: relative;
    &:before,
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 10px;
      width: 14px;
      height: 14px;
      border-radius: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
    }
  }
  .is-holiday {
    // border: 1px solid var(--sub-main-color);
    &:before {
      content: '休';
      background: var(--sub-main-color);
    }
  }
  .is-workday {
    // border: 1px solid var(--sub-text-color);
    &:before {
      content: '班';
      background: var(--sub-text-color);
    }
  }
  .is-weekend {
    color: var(--sub-text-color);
  }
  .is-festival {
    color: var(--sub-main-color);
  }
  .is-today,
  .is-selected {
    background: var(--sub-main-color);
    color: #ffffff;
  }
  .not-current-month {
    opacity: 0.4;
    color: var(--sub-text-color);
  }
}
</style>
