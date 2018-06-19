<template lang="pug">
  form(@submit.prevent='watch').jumbotron
    .form-row
      .col
        label.sr-only(for='expression') Expression
        input.form-control(type='text' id='expression' placeholder='Expression' v-model='watcher.expression')
      .col
        label.sr-only(for='destination') Destination
        input.form-control(type='text' id='destination' placeholder='Destination' v-model='watcher.destination')
      .col-auto
        button.btn.btn-primary(type='submit')
          | Watch&nbsp;
          font-awesome-icon(icon='eye')

</template>

<script>
import '@fortawesome/fontawesome-free-solid';

import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

export default {
  name: 'create',
  props: ['update'],

  components: {
    FontAwesomeIcon,
  },

  data () {
    return {
      watcher: {
        expression: '',
        destination: '',
      },
    }
  },

  methods: {
    reset() {
      this.watcher.expression = '';
      this.watcher.destination = '';
    },

    watch() {
      this.$http.post('watch', {
        expression: this.watcher.expression,
        destination: this.watcher.destination,
      })
        .then(this.reset)
        .then(this.update);
    },
  },
}
</script>

<style>
</style>
