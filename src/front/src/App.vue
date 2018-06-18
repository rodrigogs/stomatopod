<template lang="pug">
  #app
    a(href='https://www.youtube.com/watch?v=jW1Xmhfegf4')
      img(src='./assets/stomatopod.png' title='stomatopod')

    hr

    List

</template>

<script>
import List from './List.vue';

export default {
  name: 'app',

  components: {
    List,
  },
}
</script>

<style>
#app {
  text-align: center;
}
</style>
