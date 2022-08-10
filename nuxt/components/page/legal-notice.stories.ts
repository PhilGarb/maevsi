import { defineComponent } from '#app'
import legalNotice from '../../pages/legal-notice.vue'

const argTypes = { click: { action: 'click' } }
type ArgTypesType = { argTypes: typeof argTypes }

export default {
  component: legalNotice,
  title: 'page/legalNotice',
  argTypes,
}

const Template = (_: never, { argTypes }: ArgTypesType) =>
  defineComponent({
    components: { legalNotice },
    props: Object.keys(argTypes),
    template:
      // eslint-disable-next-line @intlify/vue-i18n/no-raw-text
      '<legalNotice v-bind="$props" @click="click">legalNotice</legalNotice>',
  })

export const Default = Template.bind({})
