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
      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
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
