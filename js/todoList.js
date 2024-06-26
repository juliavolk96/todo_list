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
  getTask(task) {
    return this.tasks.get(task.id);
  }

  // Removes a task from the TodoList by ID & saves to localStorage
  removeTask(task) {
    if (!this.tasks.has(task.id)) {
      throw new Error(`Task with ID ${task.id} not found.`);
    }
    
    this.tasks.delete(task.id);
    this.saveTasksToLocalStorage();
  }

  // Toggles the completion status of a task & saves to localStorage
  toggleTask(task) {
    const storedTask = this.tasks.get(task.id);
    if (storedTask) {
      storedTask.completed = !storedTask.completed;
      this.saveTasksToLocalStorage();
    }
  }
}

const todoList = new TodoList();
export default todoList;