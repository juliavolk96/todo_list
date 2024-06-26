class DomUtils {
  constructor(template, list, todoList) {
    this.template = template;
    this.list = list;
    this.todoList = todoList;
  }

  /**
   * Creates an editable input field for task text editing
   * Listens for Enter key to save changes and blur event to trigger save
  **/
  createEditInput(taskText, saveChanges) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = taskText.textContent;
    input.classList.add("todo__input--edit", "task-text");
  
    let isSaving = false;
  
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (!isSaving) {
          isSaving = true;
          saveChanges();
          isSaving = false;
        }
      }
    });
  
    input.addEventListener("blur", saveChanges);
  
    const focusInput = () => {
      input.focus();
    };
    requestAnimationFrame(focusInput);
  
    return input;
  }

  // Saves changes made to a task after editing
  saveTaskChanges(input, taskText, todoItem, id) {
    const newText = input.value;
    const task = this.todoList.getTaskById(id);
    if (task) {
      task.text = newText;
      this.todoList.saveTasksToLocalStorage();
      taskText.textContent = newText;
    }
    todoItem.replaceChild(taskText, input);
  }

  // Updates the visual style of a task
  updateTaskStyles(todoItem, completed) {
    if (completed) {
      todoItem.classList.add("todo__item--completed");
    } else {
      todoItem.classList.remove("todo__item--completed");
    }
  }

  /**
   * Adds a new task item to the todo list UI
   * Sets up event listeners for edit and delete actions
  **/
  addTaskToList(task) {
    const clone = document.importNode(this.template.content, true);
    const taskText = clone.querySelector(".task-text");
    taskText.textContent = task.text;

    const todoItem = clone.querySelector(".todo__item");
    todoItem.setAttribute("data-id", task.id);
    this.updateTaskStyles(todoItem, task.completed);

    const editButton = clone.querySelector(".todo__button--edit");
    const deleteButton = clone.querySelector(".todo__button--delete");

    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const input = this.createEditInput(taskText, () => {
        if (isSaving) return;
        isSaving = true;
        this.saveTaskChanges(input, taskText, todoItem, task.id);
        isSaving = false;
      });

      let isSaving = false;
      todoItem.replaceChild(input, taskText);
      input.focus();
    });

    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.todoList.removeTask(task.id);
      this.list.removeChild(todoItem);
    });

    this.list.insertBefore(clone, this.list.firstChild);
  }
}

export default DomUtils;