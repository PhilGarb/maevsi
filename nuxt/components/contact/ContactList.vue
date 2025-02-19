<template>
  <Loader
    v-if="($apollo.loading && !allContacts) || graphqlError"
    :errors="$util.getGqlErrorMessages(graphqlError, this)"
  />
  <div v-else class="flex flex-col gap-4">
    <ScrollContainer
      v-if="allContacts"
      :has-next-page="allContacts.pageInfo.hasNextPage"
      @loadMore="loadMore"
    >
      <table>
        <thead>
          <tr>
            <th scope="col">
              {{ $t('contact') }}
            </th>
            <th class="hidden xl:table-cell" scope="col">
              {{ $t('emailAddress') }}
            </th>
            <th class="hidden xl:table-cell" scope="col">
              {{ $t('address') }}
            </th>
            <th class="hidden xl:table-cell" scope="col">
              {{ $t('phoneNumber') }}
            </th>
            <th class="hidden xl:table-cell" scope="col">
              {{ $t('url') }}
            </th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          <ContactListItem
            v-for="contact in allContacts.nodes"
            :id="contact.nodeId"
            :key="contact.nodeId"
            :contact="contact"
            :is-deleting="pending.deletions.includes(contact.nodeId)"
            :is-editing="pending.edits.includes(contact.nodeId)"
            @delete="delete_(contact.nodeId)"
            @edit="edit(contact)"
          />
        </tbody>
      </table>
    </ScrollContainer>
    <div class="flex justify-center">
      <ButtonColored :aria-label="$t('contactAdd')" @click="add()">
        {{ $t('contactAdd') }}
        <template slot="prefix">
          <IconPlus />
        </template>
      </ButtonColored>
    </div>
    <Modal id="ModalContact" @close="onClose">
      <FormContact
        :contact="selectedContact"
        @submitSuccess="onSubmitSuccess"
      />
      <template slot="header">
        {{ formContactHeading }}
      </template>
      <div slot="footer" />
    </Modal>
  </div>
</template>

<script lang="ts">
import consola from 'consola'
import debounce from 'lodash-es/debounce'
import VueI18n from 'vue-i18n'
import { mapGetters } from 'vuex'

import { defineComponent } from '#app'

import CONTACT_DELETE_MUTATION from '~/gql/mutation/contact/contactDelete.gql'
import CONTACTS_ALL_QUERY from '~/gql/query/contact/contactsAll.gql'
import { Contact } from '~/types/contact'

export default defineComponent({
  apollo: {
    allContacts(): any {
      return {
        query: CONTACTS_ALL_QUERY,
        variables: {
          authorAccountUsername: this.signedInUsername,
          first: this.$util.ITEMS_PER_PAGE_LARGE,
          offset: null,
        },
        error(error: any, _vm: any, _key: any, _type: any, _options: any) {
          this.graphqlError = error
          consola.error(error)
        },
      }
    },
  },
  data() {
    return {
      allContacts: undefined as any,
      formContactHeading: undefined as VueI18n.TranslateResult | undefined,
      graphqlError: undefined as Error | undefined,
      pending: {
        deletions: [] as string[],
        edits: [] as string[],
      },
      selectedContact: undefined as Contact | undefined,
    }
  },
  computed: {
    ...mapGetters(['signedInUsername']),
  },
  methods: {
    add() {
      this.formContactHeading = this.$t('contactAdd')
      this.selectedContact = undefined
      this.$store.commit('modalAdd', { id: 'ModalContact' })
    },
    delete_(nodeId: string) {
      this.pending.deletions.push(nodeId)
      this.graphqlError = undefined
      this.$apollo
        .mutate({
          mutation: CONTACT_DELETE_MUTATION,
          variables: {
            nodeId,
          },
        })
        .then((_value) => {
          this.$apollo.queries.allContacts.refetch()
        })
        .catch((reason) => {
          this.graphqlError = reason
          consola.error(reason)
        })
        .finally(() => {
          this.pending.deletions.slice(
            this.pending.deletions.indexOf(nodeId),
            1
          )
        })
    },
    edit(contact: Contact) {
      this.pending.edits.push(contact.nodeId)
      this.formContactHeading = this.$t('contactEdit')
      this.selectedContact = contact
      this.$store.commit('modalAdd', { id: 'ModalContact' })
    },
    onClose() {
      if (!this.selectedContact) return

      this.pending.edits.splice(
        this.pending.edits.indexOf(this.selectedContact.nodeId),
        1
      )
    },
    onScroll(e: Event) {
      const scrollBar = e.target as Element

      if (
        scrollBar &&
        scrollBar.scrollTop + scrollBar.clientHeight >= scrollBar.scrollHeight
      ) {
        debounce(this.loadMore, 100)()
      }
    },
    onSubmitSuccess() {
      this.$store.commit('modalRemove', 'ModalContact')
      this.$apollo.queries.allContacts.refetch()
    },
    loadMore() {
      this.$util.loadMore(this.$apollo, 'allContacts', this.allContacts)
    },
  },
})
</script>

<i18n lang="yml">
de:
  address: Adresse
  author: Autor
  contact: Kontakt
  contactAdd: Kontakt hinzufügen
  contactEdit: Kontakt bearbeiten
  emailAddress: E-Mail Adresse
  phoneNumber: Telefonnummer
  url: Webseite
en:
  address: Address
  author: author
  contact: Contact
  contactAdd: Add contact
  contactEdit: Kontakt bearbeiten
  emailAddress: Email address
  phoneNumber: Phone number
  url: Website
</i18n>
