<template>
  <ButtonColored
    :aria-label="$t('signIn')"
    :to="
      localePath({
        path: '/task/account/sign-in',
        query: {
          tab: 'signIn',
          ...(isReferring && {
            referrer: $route.fullPath,
            isRedirectNoticeHidden: true,
          }),
        },
      })
    "
    @click="$emit('click')"
  >
    {{ $t('signIn') }}
    <template slot="prefix">
      <IconUser />
    </template>
  </ButtonColored>
</template>

<script lang="ts">
import { defineComponent } from '#app'

export default defineComponent({
  props: {
    isReferring: {
      default: true,
      type: Boolean,
    },
  },
})
</script>

<i18n lang="yml">
de:
  signIn: Anmelden
en:
  signIn: Sign in
</i18n>
