class TodoList {
  constructor() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.tasks = storedTasks;
  }

  addTask(text, completed) {
    this.tasks.push({ text, completed });
    this.saveTasksToLocalStorage();
  }

  saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  getTasks() {
    return this.tasks;
  }

  removeTask(text) {
    this.tasks = this.tasks.filter((task) => task.text !== text);
    this.saveTasksToLocalStorage();
  }

  // Toggle the completion status of a task
  toggleTask(text) {
    const taskIndex = this.tasks.findIndex((task) => task.text === text);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
      this.saveTasksToLocalStorage();
    }
  }
}