<template>
  <div
    ref="scrollContainer"
    class="max-h-[70vh] overflow-y-auto border maevsi-border-darken rounded-lg"
    @scroll.passive="onScroll"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { ResizeSensor } from 'css-element-queries'
import debounce from 'lodash-es/debounce'

import { defineComponent } from '#app'

export default defineComponent({
  props: {
    hasNextPage: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      resizeSensor: undefined as ResizeSensor | undefined,
    }
  },
  mounted() {
    const scrollContainer = this.$refs.scrollContainer as HTMLElement
    this.resizeSensor = new ResizeSensor(scrollContainer, () => {
      if (
        scrollContainer.scrollHeight === scrollContainer.clientHeight &&
        this.hasNextPage
      ) {
        this.$emit('loadMore')
      }
    })
  },
  beforeUnmount() {
    if (this.resizeSensor) {
      this.resizeSensor.detach()
    }
  },
  methods: {
    emit() {
      this.$emit('loadMore')
    },
    onScroll(e: Event) {
      const scrollBar = e.target as Element

      if (
        scrollBar &&
        scrollBar.scrollTop + scrollBar.clientHeight >=
          scrollBar.scrollHeight - 500
      ) {
        debounce(this.emit, 100)()
      }
    },
  },
})
</script>
