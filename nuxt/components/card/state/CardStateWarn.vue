<template>
  <CardState background-color="bg-yellow-600" :is-edgy="isEdgy">
    <slot />
  </CardState>
</template>

<script lang="ts">
import { defineComponent } from '#app'

export default defineComponent({
  props: {
    isEdgy: {
      default: false,
      type: Boolean,
    },
  },
})
</script>
