<template lang="pug">
  .container
    h2 Watchers List
    table.table.table-hover
      thead.thead-dark: tr
        th(scope='col') Expression
        th(scope='col') Destinations
        th(scope='col') Requests
        th
      tbody
        tr(v-for='destination in destinations')
          th(scope='row') {{ destination.watcher.expression }}
          td {{ destination.url }}
          td {{ getRequests(destination.watcher.expression, destination.url) }}
          td
            button.btn.btn-primary(@click='unwatch(destination.watcher.expression, destination.url)') Unwatch

    hr

    h2 Create watcher
    Create(:update="list")
</template>

<script>
import Create from './Create.vue';

export default {
  name: 'list',

  components: {
    Create,
  },

  data () {
    return {
      watchers: [],
      requests: [],
    }
  },

  created() {
    this.list();

    this.$socket.on('request', (request) => {
      this.requests.push(request);
    });
  },

  computed: {
    destinations() {
      return [].concat(...this.watchers.map((watcher) => {
        return [].concat(...watcher.destinations
          .map((destination) => ({
            url: destination,
            watcher,
          })));
      }));
    },
  },

  methods: {
    list() {
      this.$http.get('')
        .then((response) => {
          this.watchers = response.data;
        });
    },

    getRequests(expression, destination) {
      console.log(expression, destination)
      return this.requests.filter((req) => {
        return req.expression === expression
          && req.destination === destination;
      }).length;
    },

    unwatch(expression, destination) {
      this.$http.post('unwatch', {
        expression,
        destination,
      }).then(this.list);
    },
  },
}
</script>

<style>
</style>
