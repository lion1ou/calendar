<template>
  <div class="setting-item">
    <div class="setting-title">
      {{ title }}
      <slot name="title" />
    </div>
    <div class="setting-value">
      <slot name="default" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  setup() {},
});
</script>
<style lang="less" scoped>
.setting-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.63rem 0;
  border-bottom: 0.5px solid var(--shadow-color);
  .setting-title {
    font-size: 0.88rem;
    font-weight: 300;
  }
  .setting-value {
    width: calc(100% - 10rem);
    display: flex;
    justify-content: flex-end;
    font-size: 0.75rem;
  }
}
</style>
