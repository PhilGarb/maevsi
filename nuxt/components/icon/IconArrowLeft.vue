<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="classes"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
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
