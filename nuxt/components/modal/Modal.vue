<template>
  <div :class="{ invisible: !isVisibleComputed }">
    <div
      class="fixed bottom-0 left-0 right-0 top-0 z-10 transition"
      :class="[
        ...($config.STORYBOOK ? [] : ['fixed']),
        ...(isVisibleComputed
          ? ['backdrop-blur backdrop-brightness-50']
          : ['backdrop-blur-0 backdrop-brightness-100']),
      ]"
      @click="close"
    />
    <Card
      class="fixed top-[10%] max-h-[80%] left-1/2 -translate-x-1/2 z-20 flex w-5/6 flex-col gap-2 overflow-auto bg-background-brighten dark:bg-background-darken sm:w-2/3 lg:w-1/2 xl:w-1/3"
      :class="{ fixed: !$config.STORYBOOK }"
    >
      <div class="flex justify-end">
        <ButtonIcon
          :aria-label="$t('cancel')"
          class="invisible"
          :disabled="isSubmitting"
          @click="close()"
        >
          <IconX />
        </ButtonIcon>
        <h2 v-if="$slots.header" class="m-0 flex-1 px-4 text-center">
          <slot name="header" />
        </h2>
        <ButtonIcon
          :aria-label="$t('cancel')"
          class="self-start"
          :disabled="isSubmitting"
          @click="close()"
        >
          <IconX />
        </ButtonIcon>
      </div>
      <div
        class="overflow-y-auto"
        :class="{ 'pointer-events-none relative disabled': isSubmitting }"
      >
        <div v-if="contentBodyComputed">
          {{ contentBodyComputed }}
        </div>
        <slot v-else />
        <div v-if="isSubmitting" class="absolute bottom-0 left-0 right-0 top-0">
          <LoaderIndicatorSpinner class="m-auto h-8 w-8" />
        </div>
      </div>
      <div class="flex gap-8 justify-center">
        <slot name="footer">
          <ButtonColored
            :aria-label="submitName"
            :disabled="isSubmitting || isSubmitDisabled"
            type="submit"
            @click="submit()"
          >
            {{ submitName }}
            <template slot="prefix">
              <slot name="submit-icon">
                <IconCheckCircle />
              </slot>
            </template>
          </ButtonColored>
        </slot>
      </div>
      <Loader v-if="errors" class="mb-4" :errors="errors" />
    </Card>
  </div>
</template>

<script lang="ts">
import consola from 'consola'

import { defineComponent, PropType } from '#app'
import { Modal } from '~/types/modal'

export default defineComponent({
  name: 'MaevsiModal',
  props: {
    // contentBody is provided by the default slot above.
    id: {
      default: 'ModalGlobal',
      type: String,
    },
    isSubmitDisabled: {
      default: false,
      type: Boolean,
    },
    submitName: {
      default(): string {
        return this.$t('ok') as string
      },
      type: String,
    },
    submitTaskProvider: {
      default: () => Promise.resolve(),
      type: Function as PropType<() => Promise<any>>,
    },
  },
  data() {
    return {
      errors: undefined,
      isVisible: false,
      isSubmitting: false,
      onSubmit: () => {},
    }
  },
  computed: {
    contentBodyComputed(): any {
      return this.modalComputed?.contentBody // The default slot above is used as alternative.
    },
    isVisibleComputed(): boolean {
      return this.modalComputed?.isVisible || this.isVisible
    },
    // onSubmitComputed(): () => void {
    //   return this.modalComputed?.onSubmit || this.onSubmit
    // },
    modalComputed(): Modal | undefined {
      const modals: Modal[] = this.$store.getters.modals

      if (!modals || modals.length === 0) {
        return undefined
      }

      const modalsFiltered = modals.filter((modal) => modal.id === this.id)

      if (!modalsFiltered || modalsFiltered.length === 0) {
        return undefined
      }

      return modalsFiltered[0]
    },
  },
  watch: {
    isVisibleComputed(newState: boolean) {
      if (newState) {
        window.addEventListener('keydown', this.modalKeydowns)
      } else {
        window.removeEventListener('keydown', this.modalKeydowns)

        this.errors = undefined
        this.$emit('close')
      }
    },
  },
  methods: {
    close() {
      // NOT = "cancel"! Used by `submit` too.

      if (this.modalComputed) {
        this.$store.commit('modalRemove', this.id)
      } else {
        this.isVisible = false
      }
    },
    modalKeydowns(e: KeyboardEvent) {
      if (!this.isVisibleComputed) {
        return
      }

      switch (e.key) {
        // // Temporarily disabled until https://github.com/maevsi/maevsi/issues/765
        // case 'Enter': // Enter
        //   if (!this.isSubmitting && !this.isSubmitDisabled) {
        //     this.submit()
        //   }
        //   break
        case 'Escape': // Escape
          this.close()
          break
      }
    },
    async submit() {
      this.isSubmitting = true

      try {
        const value = await this.submitTaskProvider()
        this.$emit('submitSuccess', value)
        ;(this.modalComputed?.onSubmit || this.onSubmit)() // this.onSubmitComputed()
        this.close()
      } catch (errors: any) {
        this.errors = errors
        consola.error(errors)
      }

      this.isSubmitting = false
    },
  },
})
</script>

<i18n lang="yml">
de:
  cancel: Abbrechen
  ok: Ok
en:
  cancel: Cancel
  ok: Ok
</i18n>
