<template>
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="user-check"
    :class="classes"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 512"
  >
    <path
      fill="currentColor"
      d="M274.7 304H173.3C77.61 304 0 381.6 0 477.3C0 496.5 15.52 512 34.66 512H413.3C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304zM224 256c70.7 0 128-57.31 128-128S294.7 0 224 0C153.3 0 96 57.31 96 128S153.3 256 224 256zM632.3 134.4c-9.703-9-24.91-8.453-33.92 1.266l-87.05 93.75l-38.39-38.39c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94l56 56C499.5 285.5 505.6 288 512 288h.4375c6.531-.125 12.72-2.891 17.16-7.672l104-112C642.6 158.6 642 143.4 632.3 134.4z"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from '#app'

export default defineComponent({
  props: {
    classes: {
      default: 'h-5 md:h-6 w-5 md:w-6 shrink-0',
      type: String,
    },
  },
})
</script>
