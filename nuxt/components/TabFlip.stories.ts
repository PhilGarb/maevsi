import { defineComponent } from '@nuxtjs/composition-api'
import TabFlip from './TabFlip.vue'

export default {
  component: TabFlip,
  title: 'TabFlip',
}

const Template = (_: never, { argTypes }: any) =>
  defineComponent({
    components: { TabFlip },
    props: Object.keys(argTypes),
    // eslint-disable-next-line @intlify/vue-i18n/no-raw-text
    template: '<TabFlip v-bind="$props">TabFlip</TabFlip>',
  })

export const Default = Template.bind({})
// @ts-ignore
Default.args = {
  tabs: [
    ['TabFlip1', 'TabFlip'],
    ['TabFlip2', 'TabFlip'],
  ],
}
