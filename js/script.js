import todoList from './todoList.js';
import DomUtils from './domUtils.js';
import Form from './form.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const button = document.getElementById("todo-submit-button");
  const template = document.getElementById("todo-item-template");

  if (!form || !input || !list || !button || !template) {
    throw new Error("Required elements not found on the page");
  }

  const domUtils = new DomUtils(template, list, todoList);

  new Form(form, input, button, todoList, domUtils);

  // Event listener for task item clicks
  list.addEventListener("click", (event) => {
    const target = event.target;
    const todoItem = target.closest(".todo__item");
    if (!todoItem) return;

    const taskId = parseInt(todoItem.getAttribute("data-id"), 10);

    // Toggle task completion status if task text is clicked
    if (target.classList.contains("task-text")) {
      const task = todoList.getTaskById(taskId);
      if (task) {
        todoList.toggleTask(taskId);
        domUtils.updateTaskStyles(todoItem, task.completed);
      } else {
        console.error(`Task with ID ${taskId} not found.`);
      }
    }
  });

  // Render existing tasks in the list
  todoList.getTasks().forEach((task) => {
    domUtils.addTaskToList(task);
  });
});