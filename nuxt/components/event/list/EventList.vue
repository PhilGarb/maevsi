<template>
  <Loader
    v-if="($apollo.loading && !allEvents) || graphqlError"
    :errors="$util.getGqlErrorMessages(graphqlError, this)"
  />
  <div v-else class="flex flex-col gap-4">
    <ul v-if="allEvents.nodes.length" class="flex flex-col gap-4">
      <EventListItem
        v-for="event in allEvents.nodes"
        :key="event.id"
        :event="event"
      />
      <div v-if="allEvents.pageInfo.hasNextPage" class="flex justify-center">
        <ButtonColored
          :aria-label="$t('globalShowMore')"
          @click="$util.loadMore($apollo, 'allEvents', allEvents)"
        >
          {{ $t('globalShowMore') }}
        </ButtonColored>
      </div>
    </ul>
    <p v-else class="text-center">{{ $t('noEvents') }}</p>
  </div>
</template>

<script lang="ts">
import consola from 'consola'

import { defineComponent, PropType } from '#app'
import EVENTS_ALL_QUERY from '~/gql/query/event/eventsAll.gql'

export default defineComponent({
  apollo: {
    allEvents(): any {
      return {
        query: EVENTS_ALL_QUERY,
        variables: {
          authorUsername: this.username,
          first: this.$util.ITEMS_PER_PAGE,
          offset: null,
        },
        error(error: any, _vm: any, _key: any, _type: any, _options: any) {
          this.graphqlError = error
          consola.error(error)
        },
      }
    },
  },
  props: {
    showButtonEventList: {
      default() {
        return this.$route?.name?.replace(/___.+$/, '') !== 'event'
      },
      type: Boolean,
    },
    username: {
      default: undefined,
      type: String as PropType<string | undefined>,
    },
  },
  data() {
    return {
      graphqlError: undefined as Error | undefined,
    }
  },
})
</script>

<i18n lang="yml">
de:
  noEvents: Aktuell gibt es keine Veranstaltungen 😕
en:
  noEvents: There are currently no events 😕
</i18n>
