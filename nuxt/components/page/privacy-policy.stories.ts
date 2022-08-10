import { defineComponent } from '#app'
import privacyPolicy from '../../pages/privacy-policy.vue'

const argTypes = { click: { action: 'click' } }
type ArgTypesType = { argTypes: typeof argTypes }

export default {
  component: privacyPolicy,
  title: 'page/privacyPolicy',
  argTypes,
}

const Template = (_: never, { argTypes }: ArgTypesType) =>
  defineComponent({
    components: { privacyPolicy },
    props: Object.keys(argTypes),
    template:
      // eslint-disable-next-line @intlify/vue-i18n/no-raw-text
      '<privacyPolicy v-bind="$props" @click="click">privacyPolicy</privacyPolicy>',
  })

export const Default = Template.bind({})
