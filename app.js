const titleWidget = document.querySelector('.title');
const infoWidget = document.querySelector('#info');

const TASKS_PATH = 'tasks.json';
const DAYS_PATH = 'days.json';

let _tasks;
let _days;

const getDataFromJSON = async (path) => {
  let _data;

  await fetch(path)
    .then(response => response.json())
    .then(data => _data = data);
  
  return _data;
};

const getTasks = async () => {
  const tasks = await getDataFromJSON(TASKS_PATH);
  
  _tasks = tasks;
};

const getDays = async () => {
  const days = await getDataFromJSON(DAYS_PATH);

  _days = days;
};

const getFormattedDate = (date) => {
  const today = (date) ? new Date(date) : new Date();
  const yyyy = today.getFullYear();

  let dd = today.getDate();
  let mm = today.getMonth() + 1;

  (dd < 10) && (dd = '0' + dd);
  (mm < 10) && (mm = '0' + mm);

  return `${dd}/${mm}/${yyyy}`;
};

const getTodayDayOfWeek = () => {
  return new Date().getDay();
};

const nextDayOfWeek = (x) => {
  const today = new Date();
  today.setDate(today.getDate() + (x + (7 - today.getDay())) % 7);
  return today;
};

const handleInfoHTML = () => {
  const todayDate = getFormattedDate();

  let day = _days[todayDate];
  let body = '';
  let nextDate;

  if (!day) {
    const todayDayOfWeek = getTodayDayOfWeek();
    switch (todayDayOfWeek) {
      case 0:
        nextDate = getFormattedDate(nextDayOfWeek(1));
        break;
      case 2:
        nextDate = getFormattedDate(nextDayOfWeek(3));
        break;
      default:
        nextDate = getFormattedDate(nextDayOfWeek(6));
        break;
    }

    day = _days[nextDate];
  }

  let tasks = _tasks[day['type']];

  body += `<div class="spacer"><ul>`;

  tasks.forEach(task => {
    body += `
      <li>${task}</li>
    `;
  });

  body += `
    </ul></div>
    <div class="assignee"><p>Responsável: ${day['assignTo']}</p></div>
  `

  titleWidget.innerHTML = `${nextDate}`;

  infoWidget.innerHTML = body;
}

const init = async () => {
  await getTasks();
  await getDays();

  handleInfoHTML();
};

init();