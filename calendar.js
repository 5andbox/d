function updateUTCClock() {
  const now = new Date();
  const hh = String(now.getUTCHours()).padStart(2, '0');
  const mm = String(now.getUTCMinutes()).padStart(2, '0');
  document.getElementById('utcClock').textContent = ` ${hh}:${mm} UTC 👆`;
}

function startClockSync() {
  updateUTCClock();

  const now = new Date();
  const msUntilNextMinute = (60 - now.getUTCSeconds()) * 1000 - now.getUTCMilliseconds();

  setTimeout(() => {
    updateUTCClock();
    setInterval(updateUTCClock, 60000); // Update every minute
  }, msUntilNextMinute);
}

startClockSync();

const monthYear = document.getElementById('month-year');
const calendarDates = document.getElementById('calendar-dates');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let currentDate = new Date();
let selectedCell = null;

const eventsMap = {
  '2025-07': {
    3: { text: "NIGHT QUIZ", url: "https://5andbox.github.io/c/quiznight/index.html" },
    10: { text: "NIGHT QUIZ", url: "https://5andbox.github.io/c/quiznight/index.html" },
    11: { text: "POKER TOURNAMENT", url: "https://5andbox.github.io/c/poker/index.html" },
    17: { text: "NIGHT QUIZ", url: "https://5andbox.github.io/c/quiznight/index.html" },
    24: { text: "HOUSE OF STAKE", url: "https://5andbox.github.io/c/houseofstake/index.html" },
    31: { text: "NIGHT QUIZ", url: "https://5andbox.github.io/c/quiznight/index.html" }
  },
  '2025-08': {
    7: { text: "NIGHT QUIZ", url: "https://5andbox.github.io/c/quiznight/index.html" },
    14: { text: "NIGHT QUIZ", url: "https://5andbox.github.io/c/quiznight/index.html" },
    21: { text: "NIGHT QUIZ", url: "https://5andbox.github.io/c/quiznight/index.html" },
    28: { text: "NIGHT QUIZ", url: "https://5andbox.github.io/c/quiznight/index.html" }
  }
};

function formatKeyUTC(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function renderCalendar(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();

  const today = new Date();
  const isCurrentMonth = year === today.getUTCFullYear() && month === today.getUTCMonth();
  const key = formatKeyUTC(date);
  const events = eventsMap[key] || {};

  monthYear.textContent = `${date.toLocaleString('default', { month: 'long', timeZone: 'UTC' })} ${year}`;
  calendarDates.innerHTML = '';

  const firstDayOfMonth = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const daysInPrevMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const totalCells = 42;
  const startDay = firstDayOfMonth;
  let day = 1;
  let nextMonthDay = 1;

  for (let i = 0; i < totalCells; i++) {
    let cell = document.createElement('div');
    cell.className = 'calendar-cell';
    cell.setAttribute('tabindex', '0');
    let content = '';
    let isOtherMonth = false;
    let dayNum = null;

    if (i < startDay) {
      content = daysInPrevMonth - (startDay - i - 1);
      cell.classList.add('other-month');
    } else if (day <= daysInMonth) {
      content = day;
      dayNum = day;
      if (isCurrentMonth && day === today.getUTCDate()) {
        cell.classList.add('today');
      }

      if (events[day]) {
        const event = events[day];

        // Add dot
        const dot = document.createElement('div');
        dot.className = 'event-dot';
        cell.appendChild(dot);

        // Click to toggle tooltip
        cell.addEventListener('click', (e) => {
          e.stopPropagation();

          if (selectedCell && selectedCell !== cell) {
            selectedCell.classList.remove('selected');
            const oldTooltip = selectedCell.querySelector('.tooltip');
            if (oldTooltip) oldTooltip.remove();
          }

          if (selectedCell === cell) {
            const tooltip = cell.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
            cell.classList.remove('selected');
            selectedCell = null;
          } else {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.innerHTML = `<a href="${event.url}" target="_blank">${event.text}</a>`;
            cell.appendChild(tooltip);
            cell.classList.add('selected');
            selectedCell = cell;
          }
        });
      }

      day++;
    } else {
      content = nextMonthDay++;
      cell.classList.add('other-month');
      isOtherMonth = true;
    }

    cell.insertAdjacentHTML('afterbegin', `<span>${content}</span>`);
    calendarDates.appendChild(cell);
  }

  // Click outside to close tooltip
  document.addEventListener('click', () => {
    if (selectedCell) {
      const tooltip = selectedCell.querySelector('.tooltip');
      if (tooltip) tooltip.remove();
      selectedCell.classList.remove('selected');
      selectedCell = null;
    }
  });
}

prevBtn.addEventListener('click', () => {
  currentDate.setUTCMonth(currentDate.getUTCMonth() - 1);
  renderCalendar(currentDate);
});

nextBtn.addEventListener('click', () => {
  currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
  renderCalendar(currentDate);
});

renderCalendar(currentDate);
