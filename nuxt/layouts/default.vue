<template>
  <div class="container mx-auto p-4 md:px-8">
    <Header @onMenuShow="menuShow" />
    <main class="min-h-screen flex-1 overflow-hidden">
      <nuxt />
    </main>
    <Footer />
    <div
      class="fixed bottom-0 left-0 right-0 top-0 z-10 transition duration-500"
      :class="[
        ...(isMenuVisible
          ? ['backdrop-brightness-50 backdrop-blur']
          : ['backdrop-brightness-100 backdrop-blur-0']),
        ...(isMenuVisiblePartly ? [] : ['invisible']),
      ]"
      @click="menuHide()"
    />
    <div
      class="fixed bottom-0 left-0 top-0 z-10 flex transform-gpu flex-col overflow-auto transition-transform duration-500 lg:hidden"
      :class="isMenuVisible ? 'translate-x-0' : '-translate-x-full'"
    >
      <Menu v-if="isMenuVisiblePartly" is-closable @onMenuHide="menuHide" />
    </div>
    <CookieControl :locale="$i18n.locale" />
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'

import { defineComponent } from '#app'

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      isMenuVisible: false,
      isMenuVisiblePartly: false,
    }
  },
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true })
  },
  computed: {
    ...mapGetters(['signedInUsername']),
  },
  beforeCreate() {
    this.$moment.locale(this.$i18n.locale)
  },
  methods: {
    menuHide() {
      this.isMenuVisible = false
      setTimeout(() => {
        this.isMenuVisiblePartly = false
      }, 500)
    },
    menuShow() {
      this.isMenuVisiblePartly = true
      this.isMenuVisible = true
    },
  },
})
</script>

<style>
#logo {
  background-image: url('/assets/static/logos/maevsi.svg');
  background-repeat: no-repeat;
}

html.dark #logo {
  background-image: url('/assets/static/logos/maevsi_with-text_white.svg');
}

html.light #logo {
  background-image: url('/assets/static/logos/maevsi_with-text_black.svg');
}
</style>
