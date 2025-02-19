import { defineComponent } from '#app'
import ButtonSignIn from './ButtonSignIn.vue'

const argTypes = { click: { action: 'click' } }
type ArgTypesType = { argTypes: typeof argTypes }

export default {
  component: ButtonSignIn,
  title: 'button/ButtonSignIn',
  argTypes,
}

const Template = (_: never, { argTypes }: ArgTypesType) =>
  defineComponent({
    components: { ButtonSignIn },
    props: Object.keys(argTypes),
    template:
      // eslint-disable-next-line @intlify/vue-i18n/no-raw-text
      '<ButtonSignIn v-bind="$props" @click="click">ButtonSignIn</ButtonSignIn>',
  })

export const Default = Template.bind({})
