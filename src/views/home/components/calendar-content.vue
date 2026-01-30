<template>
  <div class="calendar-content">
    <div class="content-week content-line">
      <span v-for="i in weekMap" :key="i.id" class="week-item">{{ i.label }}</span>
    </div>
    <div class="content-day">
      <div v-for="(item, i) in dayMap" :key="i" class="content-line">
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
            'not-current-month': !j.isCurrentMonth,
          }"
          @click="select(j)"
        >
          <span>{{ j.day }}</span>
          <span class="day-lunar" :class="{ 'is-festival': j.festivalStr && !j.isSelected }">
            {{
              j.festivalStr
                ? j.festivalStrAll
                : j.lunar.IDayCn === '初一'
                  ? j.lunar.IMonthCn
                  : j.lunar.IDayCn
            }}
          </span>
        </div>
      </div>
    </div>
    <div class="content-year-bg">
      {{ currentDate.year }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect, ref, onUnmounted } from 'vue';
import { getDateInfo } from '@/utils';
import { WEEK_NAME_MAP } from '@/config';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'CalendarContent',
  props: {
    currentDate: { type: Object, required: true },
  },
  setup(props, context) {
    const store = useStore();

    const monthMap = (selectDate: { year: number; month: number; day: number }) => {
      const { weekStart } = store.getters.getUserConfig;
      const DAY = 24 * 60 * 60 * 1000;
      const dateStr = `${selectDate.year}/${selectDate.month}/1`; // 每月1日
      const dateStrTime = new Date(dateStr).getTime();
      const dateStrWeek = new Date(dateStr).getDay();
      let firstDate = dateStrTime - (dateStrWeek - weekStart) * DAY; // 日历的第一个日期
      if (firstDate > dateStrTime) {
        firstDate -= 7 * DAY;
      }
      const result: any[] = [];
      for (let i = 0; i < 6 * 7; i++) {
        const dateItem = new Date(firstDate + i * DAY);
        const curDate: any = getDateInfo(dateItem);
        const isSelected =
          selectDate.day === curDate.day &&
          selectDate.month === curDate.month &&
          selectDate.year === curDate.year; // 是否选中

        const isCurrentMonth = curDate.month === selectDate.month; // 是否属于当前月
        // 6行，7天为一行
        const lineNum = Math.floor(i / 7);
        if (!result[lineNum]) {
          result[lineNum] = [];
        }
        result[lineNum].push({ ...curDate, isCurrentMonth, isSelected });
      }
      return result;
    };

    const { year, month, day } = props.currentDate;
    const dayMap = ref(monthMap({ year, month, day }));

    watchEffect(() => {
      const { year, month, day } = props.currentDate;
      dayMap.value = monthMap({ year, month, day });
    });

    const sI = setInterval(() => {
      const { year, month, day } = props.currentDate;
      dayMap.value = monthMap({ year, month, day });
    }, 60 * 1000);

    onUnmounted(() => {
      clearInterval(sI);
    });

    // 数组移位
    const rotateArray = (arr: any[], len: number) => {
      const n = arr.length;
      const tempArr = [];
      for (let i = 0; i < n; i++) {
        const j = i + len >= 0 ? (i + len) % n : (i + len + n) % n;
        tempArr[j] = arr[i];
      }
      return tempArr;
    };

    const weekMap = computed(() => {
      const { weekStart } = store.getters.getUserConfig;
      return rotateArray(WEEK_NAME_MAP, 0 - weekStart);
    });

    const select = (data: Object) => {
      context.emit('select', data);
    };

    return {
      select,
      dayMap,
      weekMap,
    };
  },
});
</script>

<style scoped lang="less">
.calendar-content {
  padding: 0.63rem 0;
  position: relative;
}

.content-line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.week-item {
  width: 4rem;
  height: 3rem;
  display: flex;
  cursor: pointer;
}

.day-item {
  width: 4rem;
  height: 4rem;
  display: flex;
  cursor: pointer;
}

.week-item {
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  color: var(--sub-text-color);
}

.day-item {
  margin: 0.5rem 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  font-size: 1.2rem;

  @media (max-width: 1200px) {
    margin: 0.2rem 0;
  }

  @media (max-width: 1000px) {
    margin: 0;
  }
}

.content-day {
  .day-lunar {
    font-size: 0.63rem;
  }

  .is-holiday,
  .is-workday {
    position: relative;

    &:before,
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 0.63rem;
      width: 0.88rem;
      height: 0.88rem;
      border-bottom-right-radius: 0.58rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--white-color);
    }
  }

  .is-holiday {
    &:before {
      content: '休';
      background: var(--sub-main-color);
    }
  }

  .is-workday {
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
    white-space: nowrap;
    overflow: hidden;
  }

  .is-today {
    border: 1px solid var(--sub-main-color);
    color: var(--sub-main-color);
  }

  .is-selected {
    background: var(--sub-main-color);
    color: var(--white-color);
  }

  .not-current-month {
    opacity: 0.4;
    color: var(--sub-text-color);
  }
}

.content-year-bg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--sub-main-color);
  opacity: 0.05;
  font-size: 13rem;
  pointer-events: none;
}
</style>
