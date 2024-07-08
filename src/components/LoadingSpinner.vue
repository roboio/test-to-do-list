<template>
  <div class="spinner" :class="{center: props.center}">
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    center: {
      type: Boolean,
      default: false
    },
  },
  setup(props) {
    return {props};
  },
};
</script>

<style scoped>
.spinner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border-top: 4px solid #4CAF50;
  border-left: 4px solid #cccccc;
  border-right: 4px solid #cccccc;
  border-bottom: 4px solid #cccccc;
  animation: rotate 1s linear infinite;

  &.center{
    margin: 16px auto;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
