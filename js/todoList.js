class TodoList {
  constructor() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.tasks = new Map(storedTasks.map(task => [task.id, task]));
    this.lastId = parseInt(localStorage.getItem("lastId")) || 0;
  }

  // Adds a new task to the TodoList & saves to localStorage
  addTask(text, completed = false) {
    const id = ++this.lastId;
    const task = { id, text, completed };
    this.tasks.set(id, task);
    this.saveTasksToLocalStorage();
    return task;
  }

  // Saves the current list of tasks to localStorage
  saveTasksToLocalStorage() {
    try {
      localStorage.setItem("tasks", JSON.stringify(Array.from(this.tasks.values())));
      localStorage.setItem("lastId", this.lastId.toString());
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  }

  // Retrieves all tasks from the TodoList
  getTasks() {
    return Array.from(this.tasks.values());
  }

  // Retrieves a task by ID
  getTaskById(id) {
    return this.tasks.get(id);
  }

  // Removes a task from the TodoList by ID & saves to localStorage
  removeTask(id) {
    if (!this.tasks.has(id)) {
      throw new Error(`Task with ID ${id} not found.`);
    }
    
    this.tasks.delete(id);
    this.saveTasksToLocalStorage();
  }

  // Toggles the completion status of a task & saves to localStorage
  toggleTask(id) {
    const task = this.tasks.get(id);

    if (task) {
      task.completed = !task.completed;
      this.saveTasksToLocalStorage();
    }
  }
}

const todoList = new TodoList();
export default todoList;