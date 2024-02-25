<template>
  <div class="modal-wrapper">
    <div class="container">
      <h3 style="margin-top: 0">{{ item.name }}</h3>
      <div class="contacts">
        <span>{{ item.phone }}</span>
        <span>{{ item.email }}</span>
      </div>
      <div class="room-details">
        <span>{{ item.typeOfApartments }}</span>
        <span style="margin: 0 3px">{{ item.roomDetails.id }}</span>
      </div>
      <h5 class="counter">Number of Guests:</h5>
      <div class="guests">
        <span>Adults: {{ item.guestInfo.adults }}</span>
        <span>Children: {{ item.guestInfo.children }}</span>
        <span style="margin-top: 10px;">{{ item.start }} - {{ item.end }} </span>
      </div>
    </div>
    <button
      class="close-btn"
      @click="$emit('close')"
    >
      close
    </button>
  </div>
</template>

<script>
/**
 * @module BookingDetails
 * @description Це модальне вікно, яке відображає деталі бронювання
 */
export default {
  name: "BookingDetails",
  props: {
    item: Object,
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
h3 {
  margin: 20px 0 0;
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
.modal-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 200px;
  height: 300px;
  background-color: #e7f7ff;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  padding: 10px;
}
.modal-wrapper:hover {
  z-index: 70;
}
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
}
.contacts,
.guests {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
}
.contacts span,
.guests span,
.room-details span {
  font-size: smaller;
  text-align-last: left;
}
.counter {
  margin-bottom: 0;
}
.close-btn {
  margin: 10px 3px;
  padding: 10px 30px;
  background-color: #e2e2e2;
  border: 0.5px solid #ffffff;
  border-radius: 5px;
  cursor: pointer;
}
.close-btn:hover {
  background-color: #dedede;
}
</style>
