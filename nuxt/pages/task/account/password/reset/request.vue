<template>
  <div>
    <h1>{{ title }}</h1>
    <FormAccountPasswordResetRequest />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '#app'

export default defineComponent({
  name: 'IndexPage',
  transition: {
    name: 'layout',
  },
  data() {
    return {
      title: this.$t('title'),
    }
  },
  head() {
    const title = this.title as string
    return {
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content:
            'https://' +
            (process.env.NUXT_ENV_STACK_DOMAIN || 'maevsi.test') +
            this.$router.currentRoute.fullPath,
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: title,
        },
      ],
      title,
    }
  },
})
</script>

<i18n lang="yml">
de:
  title: Passwort zurücksetzen
en:
  title: Reset password
</i18n>
