<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="classes"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
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
