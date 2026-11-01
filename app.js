/**
 * To-Do list app logic.
 * Handles loading/saving tasks, rendering items, and user interactions.
 */

const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const STORAGE_KEY = 'todoTasks';

let tasks = [];

/**
 * Load tasks from localStorage when the page loads.
 * @returns {void}
 */
function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    tasks = Array.isArray(savedTasks) ? savedTasks : [];
  } catch (error) {
    tasks = [];
  }
}

/**
 * Save the tasks array to localStorage.
 * @returns {void}
 */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Toggle the completed state of a task.
 * @param {Object} task - The task object to toggle.
 * @returns {void}
 */
function toggleTaskCompletion(task) {
  task.completed = !task.completed;
  saveTasks();
}

/**
 * Remove a task from the array and update storage.
 * @param {number} taskId - The task identifier.
 * @returns {void}
 */
function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
}

/**
 * Create a task list item element with text and actions.
 * @param {Object} task - The task data.
 * @returns {HTMLLIElement} The built list item.
 */
function createTaskItem(task) {
  const listItem = document.createElement('li');
  const taskTextElement = document.createElement('span');
  const deleteButton = document.createElement('button');

  taskTextElement.textContent = task.text;
  taskTextElement.classList.add('task-text');

  if (task.completed) {
    taskTextElement.classList.add('completed');
  }

  taskTextElement.addEventListener('click', () => {
    toggleTaskCompletion(task);
    taskTextElement.classList.toggle('completed', task.completed);
  });

  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-btn');

  deleteButton.addEventListener('click', () => {
    deleteTask(task.id);
    listItem.remove();
  });

  listItem.appendChild(taskTextElement);
  listItem.appendChild(deleteButton);

  return listItem;
}

/**
 * Render all stored tasks to the DOM.
 * @returns {void}
 */
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    taskList.appendChild(createTaskItem(task));
  });
}

/**
 * Add a new task from the input field.
 * @returns {void}
 */
function addTask() {
  const taskText = taskInput.value.trim();

  if (!taskText) {
    return;
  }

  tasks.push({
    id: Date.now(),
    text: taskText,
    completed: false,
  });

  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

addButton.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

loadTasks();
renderTasks();
