import { graphql } from 'msw'

import { defineComponent } from '#app'
import ContactList from './ContactList.vue'

export default {
  component: ContactList,
  parameters: {
    msw: [
      graphql.query('allContacts', (_req, res, ctx) => {
        return res(
          ctx.data({
            allContacts: {
              nodes: [],
              pageInfo: {
                hasNextPage: false,
                __typename: 'PageInfo',
              },
              __typename: 'ContactsConnection',
            },
          })
        )
      }),
    ],
  },
  title: 'contact/ContactList',
}

const Template = (_: never, { argTypes }: any) =>
  defineComponent({
    components: { ContactList },
    props: Object.keys(argTypes),
    template:
      // eslint-disable-next-line @intlify/vue-i18n/no-raw-text
      '<ContactList v-bind="$props">ContactList</ContactList>',
  })

export const Default = Template.bind({})
