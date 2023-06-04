// Настройки таймера
let workMinutes = 25; // Длительность периода работы в минутах
let shortBreakMinutes = 5; // Длительность короткого перерыва в минутах
let longBreakMinutes = 15; // Длительность длинного перерыва в минутах
let pomodoroCount = 4; // Количество помодоров до длинного перерыва

// Переменные состояния таймера
let isWorkTime = true; // Флаг, указывающий, что сейчас время работы
let isPaused = true; // Флаг, указывающий, что таймер приостановлен
let timerInterval; // Идентификатор интервала для таймера

// Элементы DOM
let minutesDisplay = document.getElementById('minutes');
let secondsDisplay = document.getElementById('seconds');
let startButton = document.getElementById('start');
let pauseButton = document.getElementById('pause');
let resetButton = document.getElementById('reset');
let completeTaskButton = document.getElementById('complete-task');
let pomodoroCountInput = document.getElementById('pomodoro-count');
let shortBreakInput = document.getElementById('short-break');
let longBreakInput = document.getElementById('long-break');
let taskList = document.getElementById('tasks');
let taskInput = document.getElementById('task-input');
let addTaskButton = document.getElementById('add-task');
let tasks = [];
let currentTaskIndex = 0;

// Функция установки настроек таймера
function setTimerSettings() {
  workMinutes = Math.max(0, parseInt(pomodoroCountInput.value));
  shortBreakMinutes = Math.max(0, parseInt(shortBreakInput.value));
  longBreakMinutes = Math.max(0, parseInt(longBreakInput.value));
  pomodoroCount = Math.max(0, parseInt(pomodoroCountInput.value));

  minutesDisplay.textContent = workMinutes < 10 ? '0' + workMinutes : workMinutes;
  secondsDisplay.textContent = '00';
}

// Функция запуска таймера
function startTimer() {
  if (!isPaused) return;

  isPaused = false;
  timerInterval = setInterval(updateTimer, 1000);
  startButton.disabled = true;
  pauseButton.disabled = false;
  pomodoroCountInput.disabled = true;
  shortBreakInput.disabled = true;
  longBreakInput.disabled = true;
  taskInput.disabled = true;
  addTaskButton.disabled = true;
}

// Функция приостановки таймера
function pauseTimer() {
  isPaused = true;
  clearInterval(timerInterval);
  startButton.disabled = false;
  pauseButton.disabled = true;
  pomodoroCountInput.disabled = false;
  shortBreakInput.disabled = false;
  longBreakInput.disabled = false;
  taskInput.disabled = false;
  addTaskButton.disabled = false;
}

// Функция сброса таймера
function resetTimer() {
  isPaused = true;
  clearInterval(timerInterval);
  startButton.disabled = false;
  pauseButton.disabled = true;
  pomodoroCountInput.disabled = false;
  shortBreakInput.disabled = false;
  longBreakInput.disabled = false;
  taskInput.disabled = false;
  addTaskButton.disabled = false;

  setTimerSettings();

  tasks = [];
  currentTaskIndex = 0;
  taskList.innerHTML = '';
}

// Функция добавления задачи
function addTask() {
  let taskText = taskInput.value.trim();
  if (taskText === '') return;

  tasks.push({ text: taskText, completed: false });
  let taskItem = document.createElement('li');
  taskItem.textContent = taskText;
  taskItem.addEventListener('click', () => editTask(taskItem));
  taskList.appendChild(taskItem);
  taskInput.value = '';
}

// Функция редактирования задачи
function editTask(taskItem) {
  let originalText = taskItem.textContent;
  let editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.value = originalText;
  taskItem.textContent = '';
  taskItem.appendChild(editInput);
  editInput.focus();

  editInput.addEventListener('blur', () => {
    let newText = editInput.value.trim();
    if (newText !== '') {
      let index = Array.from(taskList.children).indexOf(taskItem);
      tasks[index].text = newText;
      taskItem.textContent = newText;
    } else {
      taskItem.textContent = originalText;
    }
  });

  editInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      editInput.blur();
    } else if (event.key === 'Escape') {
      taskItem.textContent = originalText;
    }
  });
}

// Функция завершения задачи
function completeTask() {
  if (currentTaskIndex < tasks.length) {
    tasks[currentTaskIndex].completed = true;
    taskList.children[currentTaskIndex].classList.add('completed');
    currentTaskIndex++;
  }

  if (currentTaskIndex === tasks.length) {
    currentTaskIndex = 0;
    pauseTimer();
  }
}

// Функция обновления таймера
function updateTimer() {
  let minutes = parseInt(minutesDisplay.textContent);
  let seconds = parseInt(secondsDisplay.textContent);

  if (seconds > 0) {
    seconds--;
  } else {
    if (minutes === 0) {
      if (isWorkTime) {
        isWorkTime = false;
        minutes = Math.max(0, shortBreakMinutes - 1);
        pomodoroCount--;

        if (pomodoroCount === 0) {
          minutes = Math.max(0, longBreakMinutes - 1);
          pomodoroCount = Math.max(0, parseInt(pomodoroCountInput.value));
        }
      } else {
        isWorkTime = true;
        minutes = Math.max(0, workMinutes - 1);
      }
      seconds = 59;
    } else {
      minutes--;
      seconds = 59;
    }
  }

  minutesDisplay.textContent = minutes < 10 ? '0' + minutes : minutes;
  secondsDisplay.textContent = seconds < 10 ? '0' + seconds : seconds;
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
addTaskButton.addEventListener('click', addTask);
completeTaskButton.addEventListener('click', completeTask);