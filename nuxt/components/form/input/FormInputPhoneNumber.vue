<template>
  <FormInput
    v-if="formInput"
    :is-optional="isOptional"
    :id-label="`input-${id}`"
    :placeholder="$t('globalPlaceholderPhoneNumber')"
    :title="$t('phoneNumber')"
    type="tel"
    :value="formInput"
    @input="$emit('input', $event)"
  >
    <template slot="stateInfo">
      <FormInputStateInfo
        :form-input="formInput"
        validation-property="formatPhoneNumber"
      >
        {{ $t('validationFormat') }}
      </FormInputStateInfo>
    </template>
    <template slot="stateError">
      <FormInputStateError
        :form-input="formInput"
        validation-property="formatPhoneNumber"
      >
        {{ $t('globalValidationFormat') }}
      </FormInputStateError>
    </template>
  </FormInput>
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
    id: {
      default: 'phone-number',
      type: String,
    },
    isOptional: {
      default: false,
      type: Boolean,
    },
  },
})
</script>

<i18n lang="yml">
de:
  phoneNumber: Telefonnummer
  validationFormat: Muss mit einem Plus beginnen und darf ansonsten nur Ziffern enthalten (z.B. +1234567890)
en:
  phoneNumber: Phone number
  validationFormat: Must start with a plus and may otherwise only contain digits (e.g. +1234567890)
</i18n>
