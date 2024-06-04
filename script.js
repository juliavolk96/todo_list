const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const button = document.querySelector(".todo__button");

input.addEventListener("input", function () {
  button.disabled = !input.value.trim();
});

document.addEventListener("DOMContentLoaded", function () {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  for (const task of tasks.reverse()) {
    addTaskToList(task.text, task.completed);
  }

  input.focus();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!input.value.trim()) {
    return;
  }

  addTaskToList(input.value, false);
  saveTasksToLocalStorageDebounced();
  input.value = "";
  button.disabled = true;

  setTimeout(() => input.focus(), 0);
});

function addTaskToList(text, completed) {
  const newTodo = document.createElement("li");
  newTodo.classList.add("todo__item");
  newTodo.setAttribute("role", "listitem");
  if (completed) {
    newTodo.setAttribute("data-completed", "true");
    newTodo.style.textDecoration = "line-through";
    newTodo.style.color = "#bbb0db";
  }

  const taskText = document.createElement("span");
  taskText.classList.add("task-text");
  taskText.textContent = text;
  taskText.style.marginRight = "10px";

  newTodo.appendChild(taskText);

  // Edit button
  const editButton = document.createElement("button");
  editButton.classList.add("todo__button--edit");
  editButton.setAttribute("aria-label", "Edit task");
  editButton.style.marginRight = "10px";
  const editIcon = document.createElement("img");
  editIcon.src = "./pencil.png";
  editIcon.alt = "Edit";
  editIcon.width = "20";
  editIcon.height= "20";
  editIcon.classList.add("todo__icon--edit");
  editButton.appendChild(editIcon);

  newTodo.appendChild(editButton);

  editButton.addEventListener("click", function (event) {
    event.stopPropagation();
    const input = document.createElement("input");
    input.type = "text";
    input.value = taskText.textContent;
    input.classList.add("todo__input--edit");
    input.classList.add("task-text");

    input.addEventListener("blur", function () {
      taskText.textContent = input.value;
      newTodo.replaceChild(taskText, input);
      saveTasksToLocalStorageDebounced();
    });

    newTodo.replaceChild(input, taskText);
    input.focus();
  });

  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("todo__button--delete");
  deleteButton.setAttribute("aria-label", "Delete task");
  const deleteIcon = document.createElement("img");
  deleteIcon.src = "./trashbin.png";
  deleteIcon.alt = "Delete";
  deleteIcon.width = "20";
  deleteIcon.height = "20";
  deleteIcon.classList.add("todo__icon--delete");
  deleteButton.appendChild(deleteIcon);

  newTodo.appendChild(deleteButton);

  list.insertBefore(newTodo, list.firstChild);
  saveTasksToLocalStorageDebounced();
}

list.addEventListener("click", function (event) {
  const target = event.target;
  const todoItem = target.closest(".todo__item");

  if (target.closest(".todo__button--delete")) {
    list.removeChild(todoItem);
  } else {
    if (todoItem.getAttribute("data-completed") === "true") {
      todoItem.setAttribute("data-completed", "false");
      todoItem.style.textDecoration = "none";
      todoItem.style.color = "inherit";
    } else {
      todoItem.setAttribute("data-completed", "true");
      todoItem.style.textDecoration = "line-through";
      todoItem.style.color = "#bbb0db";
    }
  }

  saveTasksToLocalStorageDebounced();
});

function debounce(func, delay) {
  let debounceTimer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}

const saveTasksToLocalStorageDebounced = debounce(saveTasksToLocalStorage, 300);

// Save the current tasks to localStorage
function saveTasksToLocalStorage() {
  const tasks = Array.from(list.children).map(function (li) {
    return {
      text: li.querySelector(".task-text").textContent,
      completed: li.getAttribute("data-completed") === "true",
    };
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}