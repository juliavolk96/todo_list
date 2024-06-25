class TodoList {
  constructor() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.tasks = new Map(storedTasks.map(task => [task.id, task]));
    this.lastId = localStorage.getItem("lastId") || 0;
  }

  // Adds a new task to the TodoList & saves to localStorage
  addTask(text, completed = false) {
    const id = ++this.lastId;
    this.tasks.set(id, { id, text, completed });
    this.saveTasksToLocalStorage();
    return id;
  }

  // Saves the current list of tasks to localStorage
  saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(Array.from(this.tasks.values())));
    localStorage.setItem("lastId", this.lastId);
  }

  // Retrieves all tasks from the TodoList
  getTasks() {
    return Array.from(this.tasks.values());
  }

  // Removes a task from the TodoList by ID & saves to localStorage
  removeTask(id) {
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

export default TodoList;