<template>
  <div class="calendar-header">
    <div class="calendar-date">
      <span>{{ currentDate.year }} 年 {{ currentDate.month }} 月</span>
      <span v-if="currentDate.juJin !== 0" class="jujin"
        >{{ Math.abs(currentDate.juJin) }}天{{ currentDate.juJin > 0 ? '后' : '前' }}</span
      >
    </div>

    <div class="calendar-change-btn">
      <div v-if="!currentDate.isToday" class="icon-btn-jin" @click="back">今</div>
      <div class="icon-btn-unit icon-color icon-arrow" @click="change('-')">-</div>
      <div
        class="icon-btn-unit"
        :class="{ 'icon-color': unit === 'year' }"
        style="margin-right: 0.5rem"
        @click="unit = 'year'"
      >
        年
      </div>
      <div
        class="icon-btn-unit"
        :class="{ 'icon-color': unit === 'month' }"
        @click="unit = 'month'"
      >
        月
      </div>
      <div class="icon-btn-unit icon-color icon-arrow" @click="change('+')">+</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CalendarHeader',
  props: {
    currentDate: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      unit: 'month', // month or year or day
      keyDownCode: '',
    };
  },
  mounted() {
    window.onkeyup = e => {
      switch (e.key) {
        case 'Shift':
          this.keyDownCode = '';
          break;

        default:
          break;
      }
    };
    window.onkeydown = e => {
      switch (e.key) {
        case 'Shift':
          this.keyDownCode = 'Shift';
          break;
        case 'ArrowRight':
          if (!this.keyDownCode) {
            this.$emit('change', '+', 'day');
          } else {
            this.$emit('change', '+', 'month');
          }
          break;
        case 'ArrowLeft':
          if (!this.keyDownCode) {
            this.$emit('change', '-', 'day');
          } else {
            this.$emit('change', '-', 'month');
          }
          break;
        case 'ArrowDown':
          if (!this.keyDownCode) {
            this.$emit('change', '+', 'week');
          } else {
            this.$emit('change', '+', 'year');
          }
          break;
        case 'ArrowUp':
          if (!this.keyDownCode) {
            this.$emit('change', '-', 'week');
          } else {
            this.$emit('change', '-', 'year');
          }
          break;
        case ' ':
        case 'Escape':
        case 'Enter':
          this.back();
          break;

        default:
          break;
      }
    };
  },
  unmounted() {
    window.onkeyup = null;
    window.onkeydown = null;
  },
  methods: {
    change(type: string) {
      this.$emit('change', type, this.unit);
    },
    back() {
      this.$emit('back');
    },
  },
});
</script>

<style lang="less" scoped>
.calendar-header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  height: 3.75rem;
}
.calendar-date {
  display: flex;
  line-height: 2.25rem;
  font-size: 1.38rem;
  font-weight: bold;
  flex-wrap: wrap;
  .jujin {
    font-size: 0.75rem;
    color: #aaa;
    height: 1.38rem;
    line-height: 1rem;
    align-self: flex-end;
    margin-left: 0.63rem;
  }
}
.calendar-change-btn {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
}
.icon-btn-jin {
  background: var(--sub-main-color);
  height: 1.75rem;
  width: 1.75rem;
  border-radius: 1.75rem;
  font-size: 0.88rem;
  margin-right: 0.5rem;
  color: var(--white-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.icon-btn-unit {
  height: 1.38rem;
  width: 1.38rem;
  color: var(--sub-text-color);
  background: var(--dis-text-color);
  border-radius: 0.13rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  cursor: pointer;
}
.icon-color {
  background: var(--main-color);
  color: var(--white-color);
}

.icon-arrow {
  margin: 0 0.5rem;
  font-size: 0.88rem;
  background: var(--sub-text-color);
  border-radius: 1.38rem;
  padding-bottom: 0.13rem;
  box-sizing: border-box;
}
.icon-btn-unit:hover {
  background: var(--main-color);
}
</style>
