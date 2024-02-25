<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <CalendarDesktop msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import CalendarDesktop from '@/components/CalendarDesktop.vue'

export default {
  name: 'HomeView',
  components: {
    CalendarDesktop
  }
}
</script>
