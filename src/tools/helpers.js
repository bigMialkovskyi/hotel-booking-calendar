/**
 *
 * @param {Array} json - масив об'єктів, які містять інформацію про бронювання
 * @returns {Array} - масив об'єктів, які містять унікальні roomDetails
 */
function getApartmentsTypes(json) {
  const uniqueRoomDetailsMap = new Map();

  json.forEach((entry) => {
    const roomName = entry.roomDetails.name;

    // Додаємо roomDetails лише якщо його ще немає в Map
    if (!uniqueRoomDetailsMap.has(roomName)) {
      uniqueRoomDetailsMap.set(roomName, entry.roomDetails);
    }
  });

  // Перетворюємо Map назад у масив
  const uniqueRoomDetailsArray = Array.from(uniqueRoomDetailsMap.values());

  return uniqueRoomDetailsArray;
}

/**
 *
 * @param {String} startDate - початкова дата бронювання
 * @param {String} endDate - кінцева дата бронювання
 * @returns {Number} - кількість днів між початковою та кінцевою датою
 */
function getBookingDuration(startDate, endDate) {
  // Розбиваємо рядки з датами на масиви [рік, місяць, день]
  const startDateArray = startDate.split("-").map(Number);
  const endDateArray = endDate.split("-").map(Number);

  // Створюємо об'єкти дат за допомогою конструктора Date
  const startDateTime = new Date(
    startDateArray[0],
    startDateArray[1] - 1,
    startDateArray[2]
  );
  const endDateTime = new Date(
    endDateArray[0],
    endDateArray[1] - 1,
    endDateArray[2]
  );

  // Обчислюємо різницю в мілісекундах та конвертуємо в дні
  const timeDifference = endDateTime - startDateTime;
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference;
}

/**
 * @param {Date} date - об'єкт дати
 * @returns {String} - рядок у форматі "YYYY-MM-DD"
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export { getApartmentsTypes, getBookingDuration, formatDate };
