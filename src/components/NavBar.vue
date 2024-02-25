<template>
  <div class="wrapper">
    <div class="nav-bar">
      <button
        class="nav-btn"
        @click="$emit('prev-week')"
      >
        Back
      </button>
      <button
        class="nav-btn"
        @click="$emit('current-week')"
      >
        Today
      </button>
      <button
        class="nav-btn"
        @click="$emit('next-week')"
      >
        Forward
      </button>
    </div>
  </div>
</template>

<script>
/**
 * @module NavBar
 * @description Це компонент, який відображає навігацію
 * @emits prev-week - подія, яка відправляється при кліку на кнопку "prev"
 * @emits current-week - подія, яка відправляється при кліку на кнопку "current week"
 * @emits next-week - подія, яка відправляється при кліку на кнопку "next"
 */
export default {
  name: "NavBar",
  data() {
    return {};
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.nav-btn {
  margin: 10px 3px;
  padding: 10px 20px;
  background-color: #f8f8f8;
  border: 0.5px solid #ffffff;
  border-radius: 5px;
  cursor: pointer;
}
.nav-btn:hover {
  background-color: #f1f1f1;
}
.nav-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
</style>
