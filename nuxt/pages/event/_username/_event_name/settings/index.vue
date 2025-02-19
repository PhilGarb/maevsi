<template>
  <Loader
    v-if="($apollo.loading && !event) || graphqlError"
    :errors="$util.getGqlErrorMessages(graphqlError, this)"
  />
  <div v-else>
    <div v-if="event" class="flex flex-col gap-4">
      <Breadcrumbs
        :prefixes="[
          { name: $t('events'), to: '../../..', append: true },
          { name: $route.params.username, to: '../..', append: true },
          { name: $route.params.event_name, to: '..', append: true },
        ]"
      >
        {{ $t('settings') }}
      </Breadcrumbs>
      <section>
        <h1>{{ $t('title') }}</h1>
        <FormEvent :event="event" />
        <section>
          <h2>{{ $t('titleDelete') }}</h2>
          <FormDelete
            id="deleteEvent"
            :errors="$util.getGqlErrorMessages(graphqlErrorDelete, this)"
            :item-name="$t('event')"
            :mutation="mutation"
            :update="updateCacheDelete"
            :variables="{
              authorUsername: $route.params.username,
              slug: $route.params.event_name,
            }"
            @error="onDeleteError"
            @success="onDeleteSuccess"
          />
        </section>
      </section>
    </div>
    <Error v-else />
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types-edge'
import consola from 'consola'

import { defineComponent } from '#app'

import EVENT_BY_ORGANIZER_USERNAME_AND_SLUG from '~/gql/query/event/eventByAuthorUsernameAndSlug.gql'
import EVENT_DELETE_MUTATION from '~/gql/mutation/event/eventDelete.gql'
import EVENT_IS_EXISTING_QUERY from '~/gql/query/event/eventIsExisting.gql'
import EVENTS_ALL_QUERY from '~/gql/query/event/eventsAll.gql'
import { Event as MaevsiEvent } from '~/types/event'

export default defineComponent({
  name: 'IndexPage',
  apollo: {
    event(): any {
      return {
        query: EVENT_BY_ORGANIZER_USERNAME_AND_SLUG,
        variables: {
          authorUsername: this.$route.params.username,
          slug: this.$route.params.event_name,
        },
        update: (data: any) => data.eventByAuthorUsernameAndSlug,
        error(error: any, _vm: any, _key: any, _type: any, _options: any) {
          this.graphqlError = error
          consola.error(error)
        },
      }
    },
  },
  middleware({ error, res, params, store }: Context) {
    if (res && params.username !== store.getters.signedInUsername) {
      return error({ statusCode: 403 })
    }
  },
  async validate({ app, params }): Promise<boolean> {
    const {
      data: { eventIsExisting },
    } = await app.apolloProvider!.defaultClient.query({
      query: EVENT_IS_EXISTING_QUERY,
      variables: {
        authorUsername: params.username,
        slug: params.event_name,
      },
      fetchPolicy: 'network-only',
    })

    return eventIsExisting
  },
  transition: {
    name: 'layout',
  },
  data() {
    return {
      event: undefined as MaevsiEvent | undefined,
      graphqlError: undefined as Error | undefined,
      graphqlErrorDelete: undefined as Error | undefined,
      mutation: EVENT_DELETE_MUTATION,
    }
  },
  head() {
    const title = this.title as string
    return {
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content:
            'https://' +
            (process.env.NUXT_ENV_STACK_DOMAIN || 'maevsi.test') +
            this.$router.currentRoute.fullPath,
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: title,
        },
      ],
      title,
    }
  },
  computed: {
    title(): string | undefined {
      if (
        this.$route.params.username === this.$store.getters.signedInUsername &&
        this.event
      ) {
        return `${this.$t('title')} · ${this.event.name}`
      }
      return '403'
    },
  },
  methods: {
    onDeleteError(error: Error) {
      this.graphqlErrorDelete = error
    },
    onDeleteSuccess() {
      this.$router.push(this.localePath(`/dashboard`))
      this.$apollo.queries.allEvents.refetch()
    },

    // /////////////////////////////////////////////////////////////////////////
    // TODO: Use apollo client v3.
    // https://www.apollographql.com/docs/react/caching/cache-configuration/
    // https://apollo.vuejs.org/guide/components/mutation.html

    // update(cache, {data: mutationData}) {
    //   if (mutationData) {
    //     const removedMatchId = mutationData.removeMatch;
    //     cache.modify('ROOT_QUERY', {
    //       matches: (matches: Reference[], helpers) => {
    //         const removedMatchRef = helpers.toReference({
    //           __typename: 'Match',
    //           id: removedMatchId,
    //         });
    //         return matches.filter(({__ref}) => __ref !== removedMatchRef.__ref);
    //       },
    //     });
    //   }
    // },

    // cache.evict(cache.identify(result.data.updateActivity));

    // const [deleteExpressHelp] = useDeleteExpressHelpMutation({
    //   update: (cache, {data}) => {
    //     cache.evict({
    //       id: cache.identify({
    //         __typename: 'express_help',
    //         id: data?.delete_express_help_by_pk?.id,
    //       }),
    //     });
    //   },
    // });
    // /////////////////////////////////////////////////////////////////////////

    // Just an example. Doesn't respect parameters like a conditional username that is set for this query on event lists on users' profiles.
    // Currently, the apollo fetch policy is `cache-and-network`: https://github.com/maevsi/maevsi/commit/02cbcd9c9a9784e9076c6a360f78a603623c819b#diff-ce51f9f2a4d27fb6594bd8d6dce05dcbca68a6a99999078c96dbab4033472650R247
    updateCacheDelete(store: any, { data: { _eventDelete } }: any) {
      const query = { query: EVENTS_ALL_QUERY }
      let data

      try {
        data = store.readQuery(query)
      } catch (e) {
        return
      }

      // const index = data.allEvents.nodes.find(
      const index = data.allEvents.nodes.findIndex(
        (x: MaevsiEvent) =>
          x.authorUsername === this.$route.params.username &&
          x.slug === this.$route.params.event_name
      )

      if (index !== -1) {
        data.allEvents.nodes.splice(index, 1)
        store.writeQuery({
          ...query,
          data,
        })
      }
    },
  },
})
</script>

<i18n lang="yml">
de:
  event: Veranstaltung
  events: Veranstaltung
  postgres28P01: Passwort falsch! Überprüfe, ob du alles richtig geschrieben hast.
  postgresP0002: Die Veranstaltung wurde nicht gefunden!
  settings: bearbeiten
  title: Veranstaltung bearbeiten
  titleDelete: Veranstaltung löschen
en:
  event: event
  events: events
  postgres28P01: Password incorrect! Check that you have written everything correctly.
  postgresP0002: The event was not found!
  settings: edit
  title: Edit event
  titleDelete: Delete event
</i18n>
