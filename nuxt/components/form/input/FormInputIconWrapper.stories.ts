import { defineComponent } from '#app'
import FormInputIconWrapper from './FormInputIconWrapper.vue'

export default {
  component: FormInputIconWrapper,
  title: 'form/input/FormInputIconWrapper',
}

const Template = (_: never, { argTypes }: any) =>
  defineComponent({
    components: { FormInputIconWrapper },
    props: Object.keys(argTypes),
    template:
      // eslint-disable-next-line @intlify/vue-i18n/no-raw-text
      '<FormInputIconWrapper v-bind="$props">FormInputIconWrapper</FormInputIconWrapper>',
  })

export const Default = Template.bind({})
