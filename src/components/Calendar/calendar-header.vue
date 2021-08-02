<template>
  <div class="calendar-header">
    <div class="calendar-date">{{ currentDate.year }} 年 {{ currentDate.month }} 月 {{ currentDate.day }} 日</div>
    <div class="calendar-change-btn">
      <div class="icon-btn-jin" @click="back" v-if="showJin">今</div>
      <div class="icon-btn-unit icon-color icon-arrow" @click="change('-')">-</div>
      <div class="icon-btn-unit" :class="{ 'icon-color': unit === 'year' }" @click="unit = 'year'" style="margin-right: 6px">年</div>
      <div class="icon-btn-unit" :class="{ 'icon-color': unit === 'month' }" @click="unit = 'month'">月</div>
      <div class="icon-btn-unit icon-color icon-arrow" @click="change('+')">+</div>
    </div>
  </div>
</template>

<script lang="ts">
import { getYearMonthDay } from '../../utils/tools.ts'
import { ref, defineComponent } from 'vue'
export default defineComponent({
  name: 'CalendarHeader',
  data() {
    return {
      unit: 'month' // month or year
    }
  },
  props: {
    currentDate: {
      type: Object,
      required: true
    }
  },
  computed: {
    showJin(): Boolean {
      const now = getYearMonthDay()
      return now.year !== this.currentDate.year || now.month !== this.currentDate.month || now.day !== this.currentDate.day
    }
  },
  methods: {
    change(type: String) {
      this.$emit('change', type, this.unit)
    },
    back() {
      this.$emit('back')
    }
  }
})
</script>

<style scoped>
.calendar-header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  height: 60px;
}
.calendar-date {
  line-height: 36px;
  font-size: 22px;
  font-weight: bold;
}
.calendar-change-btn {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
}
.icon-btn-jin {
  background: var(--sub-main-color);
  height: 30px;
  width: 30px;
  margin-right: 15px;
  color: #ffffff;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
}
.icon-btn-unit {
  height: 22px;
  width: 22px;
  color: #ffffff;
  background: var(--dis-text-color);
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  cursor: default;
}
.icon-color {
  background: var(--main-color);
  color: #ffffff;
}

.icon-arrow {
  margin: 0 6px;
  font-size: 14px;
  background: var(--sub-text-color);
  border-radius: 22px;
  padding-bottom: 2px;
  box-sizing: border-box;
}
.icon-btn-unit:hover {
  background: var(--main-color);
}
</style>
