<template>
  <div class="flex flex-col gap-4">
    <!-- eslint-disable vue/no-v-html -->
    <i18n
      path="maevNo"
      class="flex items-center justify-center gap-1 text-xl font-black"
    >
      <template slot="emojiFacePleading">
        <EmojiFacePleading />
      </template>
    </i18n>
    <!--eslint-enable-->
    <h1>{{ statusCode ? `${statusCode} - ` : '' }}{{ statusReason }}</h1>
    <p v-if="statusCode === 403" class="text-center">
      {{ $t('403description') }}
      <br />
      {{ $t('403hint') }}
    </p>
    <ButtonList>
      <ButtonSignIn v-if="statusCode === 403" />
      <ButtonHome />
    </ButtonList>
  </div>
</template>

<script lang="ts">
import { status } from '@http-util/status-i18n'

import { defineComponent, PropType } from '#app'

export default defineComponent({
  name: 'MaevsiError',
  props: {
    statusCode: {
      default: undefined,
      type: Number as PropType<number | undefined>,
    },
  },
  computed: {
    statusReason(): string {
      return (
        status(this.statusCode, this.$i18n.locale) ||
        (this.$t('error') as string)
      )
    },
  },
})
</script>

<i18n lang="yml">
de:
  403description: Du bist aktuell nicht berechtigt, auf diese Seite zuzugreifen.
  403hint: Hast du dich schon angemeldet oder von diesem Gerät aus einen Einladungscode eingegeben?
  error: Fehler
  maevNo: maev.no? {emojiFacePleading}
en:
  403description: "You're currently missing permissions to view this site."
  403hint: Did you already sign in or enter an invitation code on this device?
  error: Error
  maevNo: maev.no? {emojiFacePleading}
</i18n>
