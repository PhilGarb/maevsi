<template>
  <AppLink
    v-if="to"
    ref="button"
    :append="append"
    :aria-label="ariaLabel"
    :class="isBlock ? 'block' : 'inline-flex items-center gap-2'"
    :disabled="disabled"
    :is-colored="false"
    :to="to"
  >
    <slot name="prefix" />
    <slot />
    <slot name="suffix" />
  </AppLink>
  <button
    v-else
    ref="button"
    :aria-label="ariaLabel"
    :class="isBlock ? 'block' : 'inline-flex items-center gap-2'"
    :disabled="disabled"
    :type="type"
    @click="$emit('click')"
  >
    <slot name="prefix" />
    <slot />
    <slot name="suffix" />
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from '#app'

export default defineComponent({
  name: 'MaevsiButton',
  props: {
    append: {
      default: false,
      type: Boolean,
    },
    ariaLabel: {
      required: true,
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    isBlock: {
      default: false,
      type: Boolean,
    },
    to: {
      default: undefined,
      type: String as PropType<string | undefined>,
    },
    type: {
      default: 'button',
      type: String,
    },
  },
  methods: {
    click() {
      ;(this.$refs.button as HTMLButtonElement).click()
    },
  },
})
</script>
