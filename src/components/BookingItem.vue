<template>
  <div
    style="top: 10px"
    class="booking-item-wrapper"
  >
    <div class="filter">
      <div
        class="booking-item"
        :style="{ 'border-radius': borderRadius }"
        @click="openModal"
      >
        <span v-if="showTitle">{{ item.name }}</span>
      </div>
    </div>
    <BookingDetails
      v-if="showDetails"
      class="booking-details main"
      :style="{ 'z-index': zIndex }"
      :item="item"
      @close="closeModal"
      @mouseover="zIndex = 70"
      @mouseleave="zIndex = 60"
    />
  </div>
</template>

<script>
/**
 * @module BookingItem
 * @description Це компонент, який відображає одне бронювання
 * @property {Object} item - об'єкт бронювання
 * @property {String} borderRadius - радіус кутів
 * @property {Boolean} showTitle - показувати заголовок
 * @requires BookingDetails - модальне вікно з деталями бронювання
 */
import BookingDetails from "./BookingDetails.vue";

export default {
  components: { BookingDetails },
  props: {
    item: Object,
    borderRadius: String,
    showTitle: Boolean,
  },
  data() {
    return {
      zIndex: 60,
      showDetails: false,
      itemsColors: [
        "#DDD098",
        "#98DD98",
        "#98DDDD",
        "#9898DD",
        "#DD98DD",
        "#DD9898",
      ],
      currentColor: null,
    };
  },
  /**
   * @description Встановлює випадковий колір для кожного екземпляру компонента
   */
  created() {
    this.currentColor =
      this.itemsColors[Math.floor(Math.random() * this.itemsColors.length)];
  },
  methods: {
    /**
     * @description Закриває модальне вікно
     */
    closeModal() {
      this.showDetails = false;
    },
    /**
     * @description Відкриває модальне вікно
     */
    openModal() {
      if (this.showDetails) return;
      this.showDetails = true;
    },
  },
};
</script>

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
.booking-item-wrapper {
  user-select: none;
  position: absolute;
  padding: 0 2px;
}
.booking-item-wrapper:hover {
  z-index: 50;
}
.booking-item {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid #ffffff;
  border-radius: 5px;
}
.booking-item:hover {
  background: rgba(151, 151, 151, 0.3);
  cursor: pointer;
}
.filter {
  border-radius: 5px;
  background-color: v-bind(currentColor);
}
.booking-details {
  position: absolute;
  left: 25%;
  top: -10px;
  // z-index: 60;
}
</style>
