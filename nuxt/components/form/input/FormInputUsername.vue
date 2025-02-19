<template>
  <FormInput
    v-if="formInput"
    :is-optional="isOptional"
    :is-validatable="isValidatable"
    :id-label="`input-${id}`"
    :placeholder="$t('globalPlaceholderUsername')"
    :success="isValidatable && formInput.$model && !formInput.$invalid"
    :title="$t(id.replace(/(-registration|-sign-in)$/, ''))"
    type="text"
    :validation-property="formInput"
    :value="formInput"
    @input="$emit('input', $event)"
  >
    <template slot="icon">
      <slot name="icon" />
    </template>
    <template slot="stateError">
      <FormInputStateError
        :form-input="formInput"
        :is-validation-live="!isValidationInverted"
        validation-property="existence"
      >
        {{ $t('globalValidationExistence') }}
      </FormInputStateError>
      <FormInputStateError
        :form-input="formInput"
        :is-validation-live="isValidationInverted"
        validation-property="existenceNone"
      >
        {{ $t('globalValidationExistenceNone') }}
      </FormInputStateError>
      <FormInputStateError
        :form-input="formInput"
        validation-property="formatSlug"
      >
        {{ $t('validationFormat') }}
      </FormInputStateError>
      <FormInputStateError
        :form-input="formInput"
        validation-property="required"
      >
        {{ $t('globalValidationRequired') }}
      </FormInputStateError>
    </template>
    <template slot="stateInfo">
      <FormInputStateInfo
        :form-input="formInput"
        :is-validation-live="!isValidationInverted"
        validation-property="existence"
      >
        {{ $t('validationExistenceHint') }}
      </FormInputStateInfo>
    </template>
    <template v-if="isValidatable" slot="stateSuccess">
      <FormInputStateSuccess
        :form-input="formInput"
        validation-property="existence"
      >
        {{
          isValidationInverted
            ? $t('globalVerificationExistenceNone')
            : $t('globalVerificationExistence')
        }}
      </FormInputStateSuccess>
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
      required: true,
      type: String,
    },
    isOptional: {
      default: false,
      type: Boolean,
    },
    isValidatable: {
      default: false,
      type: Boolean,
    },
    isValidationInverted: {
      default: false,
      type: Boolean,
    },
  },
})
</script>

<i18n lang="yml">
de:
  iconCheck: Verifiziert
  username: Nutzername
  validationExistenceHint: Hast du Groß- und Kleinbuchstaben richtig verwendet?
  validationFormat: Darf nur Buchstaben, Ziffern und Bindestriche enthalten.
en:
  iconCheck: Verified
  username: Username
  validationExistenceHint: Did you use upper and lower case letters correctly?
  validationFormat: May only contain letter, digits and dashes.
</i18n>
