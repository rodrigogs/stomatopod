<template lang="pug">
  .container
    h2 Watchers List
    table.table.table-hover
      thead.thead-dark: tr
        th(scope='col') Expression
        th(scope='col') Destination
        th(scope='col') Requests
        th
        th
      tbody
        tr(v-for='destination in destinations')
          th(scope='row') {{ destination.watcher.expression }}
          td {{ destination.url }}
          td {{ countRequests(destination.watcher.expression, destination.url) }}
          td
            button.btn.btn-success(@click='showLogs(destination.watcher.expression, destination.url)')
              | Logs&nbsp;
              font-awesome-icon(icon='file-alt')
          td
            button.btn.btn-danger(@click='unwatch(destination.watcher.expression, destination.url)')
              | Unwatch&nbsp;
              font-awesome-icon(icon='eye-slash')

    b-modal(ref='logsModal' hide-footer size='lg' title='Logs')
      tree-view#log(:data='logs' :options='{maxDepth: 1, rootObjectKey: \'events\'}')
      b-btn.mt-3(variant='outline-danger' block @click='hideLogs') Close

    hr

    h2 Create watcher
    Create(:update="list")
</template>

<script>
import '@fortawesome/fontawesome-free-solid';

import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import Create from './Create.vue';

export default {
  name: 'list',

  components: {
    Create,
    FontAwesomeIcon,
  },

  data () {
    return {
      watchers: [],
      requests: [],
      logs: [],
    }
  },

  created() {
    this.list();

    this.$socket.on('request', (request) => {
      request.timestamp = new Date().toISOString();
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

    showLogs(expression, destination) {
      this.logs = {};

      this.requests
        .filter((request) => {
          return request.expression === expression
            && request.destination === destination;
        })
        .forEach((log) => {
          this.logs[log.timestamp] = { old: log.oldRow, new: log.newRow, };
        });

      this.$refs.logsModal.show();
    },

    hideLogs() {
      this.$refs.logsModal.hide();
    },

    countRequests(expression, destination) {
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
  #log {
    text-align: start;
    max-height: 650px;
    background-color: black;
    color: white;
  }
</style>
