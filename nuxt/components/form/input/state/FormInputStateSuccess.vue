<template>
  <FormInputState
    v-if="formInput.$model && !formInput.$invalid"
    class="text-green-600"
  >
    <IconCheckCircle />
    <slot />
  </FormInputState>
</template>

<script lang="ts">
import { defineComponent, PropType } from '#app'
import { FormInputType } from '~/components/form/input/FormInput.vue'

export default defineComponent({
  props: {
    formInput: {
      required: true,
      type: Object as PropType<FormInputType>,
    },
  },
})
</script>
