document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const button = document.querySelector(".todo__button");

  const todoList = new TodoList();

  const tasks = todoList.getTasks();
  for (const task of tasks) {
    addTaskToList(list, task.text, task.completed);
  }

  // Disable button if input is empty
  input.addEventListener("input", function () {
    button.disabled = !input.value.trim();
  });

  input.focus();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!input.value.trim()) {
      return;
    }

    const text = input.value;
    todoList.addTask(text, false);
    addTaskToList(list, text, false);

    input.value = "";
    button.disabled = true;

    setTimeout(() => input.focus(), 0);
  });

  // Handle task list interactions (delete and edit)
  list.addEventListener("click", function (e) {
    const target = e.target;
    const todoItem = target.closest(".todo__item");

    if (target.closest(".todo__button--delete")) {
      const taskText = todoItem.querySelector(".task-text").textContent;
      todoList.removeTask(taskText);
      list.removeChild(todoItem);
    } else if (target.classList.contains("task-text")) {
      const taskText = target.textContent;
      todoList.toggleTask(taskText);
      todoItem.setAttribute("data-completed", todoList.tasks.find((task) => task.text === taskText).completed ? "true" : "false");
      todoItem.style.textDecoration = todoList.tasks.find((task) => task.text === taskText).completed ? "line-through" : "none";
      todoItem.style.color = todoList.tasks.find((task) => task.text === taskText).completed ? "#bbb0db" : "inherit";
    }
  });

  // Add a new task to the list
  function addTaskToList(list, text, completed) {
    const newTodo = document.createElement("li");
    newTodo.classList.add("todo__item");
    newTodo.setAttribute("role", "listitem");
    if (completed) {
      newTodo.setAttribute("data-completed", "true");
      newTodo.style.textDecoration = "line-through";
      newTodo.style.color = "#bbb0db";
    }

    // Create task text element
    const taskText = document.createElement("span");
    taskText.classList.add("task-text");
    taskText.textContent = text;
    taskText.style.marginRight = "10px";

    newTodo.appendChild(taskText);

    // Create edit button
    const editButton = document.createElement("button");
    editButton.classList.add("todo__button--edit");
    editButton.setAttribute("aria-label", "Edit task");
    editButton.style.marginRight = "10px";
    const editIcon = document.createElement("img");
    editIcon.src = "./pencil.png";
    editIcon.alt = "Edit";
    editIcon.width = "20";
    editIcon.height = "20";
    editIcon.classList.add("todo__icon--edit");
    editButton.appendChild(editIcon);

    newTodo.appendChild(editButton);

    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const input = document.createElement("input");
      input.type = "text";
      input.value = taskText.textContent;
      input.classList.add("todo__input--edit");
      input.classList.add("task-text");
    
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const newText = input.value;
    
          const taskIndex = todoList.tasks.findIndex((task) => task.text === text);
          if (taskIndex !== -1) {
            todoList.tasks[taskIndex].text = newText;
            todoList.saveTasksToLocalStorage();
          }
    
          taskText.textContent = newText;
    
          newTodo.replaceChild(taskText, input);
        }
      });
    
      input.addEventListener("blur", () => {
        const newText = input.value;
    
        const taskIndex = todoList.tasks.findIndex((task) => task.text === text);
        if (taskIndex !== -1) {
          todoList.tasks[taskIndex].text = newText;
          todoList.saveTasksToLocalStorage();
        }
    
        taskText.textContent = newText;
    
        newTodo.replaceChild(taskText, input);
      });
    
      newTodo.replaceChild(input, taskText);
      input.focus();
    });
    
    // Create delete button
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
  }
});