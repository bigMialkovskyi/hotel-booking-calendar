<template>
  <div class="wrapper">
    <NavBar
      @prev-week="getWeekRange(startDate, 'prev')"
      @current-week="getCurrentWeekDates"
      @next-week="getWeekRange(startDate, 'next')"
    />
    <ul class="grid">
      <li
        v-for="(type, index) in apartmentsTypesList"
        :key="type.id + type.name"
        class="grid-row"
        style=""
      >
        <div class="type-name">
          <h3 style="margin: 0">
            {{ type.name }}
          </h3>
        </div>

        <div
          v-for="(date, dateIndex) in datesRange"
          :key="date"
          :class="[
            {
              'last-desktop-cell':
                index === apartmentsTypesList.length - 1 && dateIndex === 6,
            },
            { 'active-date': date === activeDate },
            'date-item',
          ]"
          @mouseover="activeDate = date"
          @mouseleave="activeDate = ''"
        >
          <div
            v-if="index === 0"
            :class="[
              { 'first-date-label': dateIndex === 0 },
              { 'last-date-label': dateIndex === 6 },
              'date-label',
            ]"
          >
            <span>
              {{ date }}
            </span>
          </div>
        </div>

        <BookingItem
          v-for="item in getBookingsByApartmentType(type.name)"
          :key="item.id"
          :style="calcBookingPosition(item)"
          :item="item"
          :border-radius="calcRadius(item)"
          :show-title="showTitle(item)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
/**
 * @module CalendarDesktop
 * @description - компонент для відображення календаря.
 * @requires NavBar - компонент для навігації по тижнях
 * @requires BookingItem - компонент для відображення букінгів
 * @requires booking-list.json - список букінгів
 * @requires getApartmentsTypes - функція для отримання типів апартаментів
 * @requires getBookingDuration - функція для отримання тривалості букінгу
 * @requires formatDate - функція для форматування дати
 * @requires mapGetters - функція для отримання геттерів зі стору
 */
import NavBar from "@/components/NavBar.vue";
import BookingItem from "@/components/BookingItem.vue";

import apiList from "@/api/booking-list.json";
import {
  getApartmentsTypes,
  getBookingDuration,
  formatDate,
} from "@/tools/helpers.js";
import { mapGetters } from "vuex";

export default {
  name: "CalendarDesktop",
  components: { NavBar, BookingItem },
  props: {
    msg: String,
  },
  data() {
    return {
      apartmentsTypesList: [],
      activeWeek: [],
      startDate: "",
      endDate: "",
      activeDate: "",
    };
  },

  /**
   * @description - отримуємо геттери для роботи зі стором
   */
  computed: {
    ...mapGetters(["bookingList", "datesRange"]),
  },

  /**
   * @description - встановлюємо початковий стан для букінгів, дат та типів апартаментів
   */
  created() {
    this.$store.commit("setBookingList", JSON.parse(JSON.stringify(apiList)));
    this.getCurrentWeekDates();
    this.generateDateRange();
    this.getWeek();
  },

  /**
   * @description - відслідковуємо зміни в датах для перегенерації дат та фільтрації букінгів
   */
  watch: {
    startDate: function () {
      this.apartmentsTypesList = getApartmentsTypes(this.bookingList);
      this.generateDateRange();
      this.getWeek();
    },
  },

  methods: {
    /**
     *
     * @param {String} startOfWeek - start date of the week
     * @param {String} direction - next or prev
     * @description - отримуємо дати кінця та початку наступного або попереднього тижня. потрібно для навігації по тижнях
     */
    getWeekRange(startOfWeek, direction) {
      const startOfWeekArray = startOfWeek.split("-").map(Number);
      const startOfWeekDate = new Date(
        startOfWeekArray[0],
        startOfWeekArray[1] - 1,
        startOfWeekArray[2]
      );

      const directionMultiplier = direction === "next" ? 1 : -1;
      const offset = directionMultiplier * 7;

      const newStartOfWeekDate = new Date(
        startOfWeekDate.getTime() + offset * 24 * 60 * 60 * 1000
      );
      const newEndOfWeekDate = new Date(
        newStartOfWeekDate.getTime() + 6 * 24 * 60 * 60 * 1000
      );

      this.startDate = formatDate(newStartOfWeekDate);
      this.endDate = formatDate(newEndOfWeekDate);
    },
    /**
     *
     * @description - фільтруємо букінги за поточним тижнем
     */
    getWeek() {
      this.activeWeek = this.bookingList.filter((obj) => {
        const objStartDate = new Date(obj.start);
        const objEndDate = new Date(obj.end);

        const isStartDateInRange =
          objStartDate >= new Date(this.startDate) &&
          objStartDate <= new Date(this.endDate);
        const isEndDateInRange =
          objEndDate >= new Date(this.startDate) &&
          objEndDate <= new Date(this.endDate);

        return isStartDateInRange || isEndDateInRange;
      });
    },
    /**
     *
     * @description - генеруємо масив дат для поточного тижня
     */
    generateDateRange() {
      const dateArray = [];
      let currentDate = new Date(this.startDate);

      while (currentDate <= new Date(this.endDate)) {
        dateArray.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      this.$store.commit("setDatesRange", dateArray);
    },
    /**
     *
     * @param {String} apartmentName - apartment name
     * @returns {Array} - bookings for the apartment
     * @description - фільтруємо букінги за типом апартаментів для відображення на календарі
     */
    getBookingsByApartmentType(apartmentName) {
      let bookings = this.activeWeek.filter(
        (entry) => entry.roomDetails.name === apartmentName
      );

      if (bookings.length === 0) {
        this.apartmentsTypesList = this.apartmentsTypesList.filter(
          (entry) => entry.name !== apartmentName
        );
      }
      return bookings;
    },
    /**
     *
     * @param {Object} item - booking item
     * @returns {Object} - left and width values
     * @description - обчислюємо позицію букінгу в залежності від того, чи він починається або закінчується в межах поточного тижня або його тривалість повністю вміщується в межах поточного тижня
     */
    calcBookingPosition(item) {
      if (this.datesRange.includes(item.start)) {
        let startDateIndex = this.datesRange.indexOf(item.start) + 1;
        return {
          left: startDateIndex * 100 + 220 - 50 + "px",
          ...this.calcBookingWidth(item),
        };
      }
      if (this.datesRange.includes(item.end)) {
        let endDateIndex = this.datesRange.indexOf(item.end) + 1;
        return {
          right: (7 - endDateIndex) * 100 + 48 + "px",
          ...this.calcBookingWidth(item),
        };
      }
      // коли букинг починається до поточного тижня і закінчується після поточного тижня
      if (
        !this.datesRange.includes(item.start) ||
        !this.datesRange.includes(item.end)
      ) {
        return { left: "220px", ...this.calcBookingWidth(item) };
      }
    },
    /**
     *
     * @param {Object} item - booking item
     * @returns {Object} - width value
     * @description - обчислюємо ширину букінгу в залежності від того, чи він починається або закінчується в межах поточного тижня або його тривалість повністю вміщується в межах поточного тижня
     */
    calcBookingWidth(item) {
      if (
        this.datesRange.includes(item.start) &&
        !this.datesRange.includes(item.end)
      ) {
        return {
          width: (6 - this.datesRange.indexOf(item.start)) * 100 + 49 + "px",
        };
      }
      if (
        !this.datesRange.includes(item.start) &&
        this.datesRange.includes(item.end)
      ) {
        return {
          width: (this.datesRange.indexOf(item.end) + 1) * 100 - 49 + "px",
        };
      }
      let duration = getBookingDuration(item.start, item.end);
      return { width: duration * 100 + "px" };
    },
    /**
     *
     * @param {Object} item - booking item
     * @returns {Boolean} - true якщо потрібно відображати заголовок букингу інакше - false
     * @description - визначаємо, чи потрібно відображати заголовок букингу в залежності від того, чи він починається в останній день поточного тижня або закінчується в перший день поточного тижня
     */
    showTitle(item) {
      return item.start === this.endDate || item.end === this.startDate
        ? false
        : true;
    },
    /**
     *
     * @param {Object} item - booking item
     * @returns {String} - border-radius value
     * @description - обчислюємо радіуси для кожного букингу в залежності від того, чи він починається або закінчується в межах поточного тижня
     */
    calcRadius(item) {
      if (
        this.datesRange.includes(item.start) &&
        !this.datesRange.includes(item.end)
      ) {
        return "5px 0 0 5px";
      }
      if (
        !this.datesRange.includes(item.start) &&
        this.datesRange.includes(item.end)
      ) {
        return "0 5px 5px 0";
      }
      return "5px";
    },
    /**
     *
     * @description - обчислюємо дати поточного тижня для дефолтного відображення при першому відкритті сторінки
     */
    getCurrentWeekDates() {
      const currentDate = new Date();
      const currentDay = currentDate.getDay(); // Номер поточного дня (0 - неділя, 1 - понеділок, ..., 6 - субота)

      // Визначаємо різницю між поточним днем та понеділком (1 - поточний день - 1)
      const daysUntilMonday = currentDay === 0 ? 6 : currentDay - 1;

      const startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - daysUntilMonday);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6); // Тиждень триває 7 днів

      this.startDate = formatDate(startDate);
      this.endDate = formatDate(endDate);
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
.wrapper {
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.grid {
  display: flex;
  margin-top: 50px;
  flex-direction: column;
  width: 920px;
}
.grid-row {
  display: flex;
  margin: 2px 0;
  position: relative;
  height: 80px;
}
.type-name {
  width: 200px;
  padding: 5px 10px;
  background-color: rgb(241, 230, 188);
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.date-item {
  width: 100px;
  padding: 5px 0px;
  background-color: #f8f8f8;
  border-left: 0.5px solid #ffffff;
  border-right: 0.5px solid #ffffff;
}
.active-date {
  background-color: #f1f1f1 !important;
}
.date-label {
  width: 100px;
  height: 30px;
  background-color: rgb(241, 230, 188);
  position: absolute;
  top: -32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #ffffff;
}
.first-date-label {
  border-top-left-radius: 5px;
  border-left: 0;
}
.last-date-label {
  border-top-right-radius: 5px;
  border-right: 0;
}
.last-desktop-cell {
  border-bottom-right-radius: 5px;
}
</style>
