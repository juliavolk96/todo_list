class Form {
  // Creates an instance of Form
  constructor(formElement, inputElement, buttonElement, todoList, domUtils) {
    this.form = formElement;
    this.input = inputElement;
    this.button = buttonElement;
    this.todoList = todoList;
    this.domUtils = domUtils;

    this.setupListeners();
  }

  // Sets up event listeners for input changes and form submission
  setupListeners() {
    this.input.addEventListener("input", this.handleInputChange.bind(this));
    this.form.addEventListener("submit", this.handleFormSubmit.bind(this));
  }

  /**
   * Handles input changes in the task input field.
   * Disables the submit button if the input is empty.
  **/
  handleInputChange() {
    this.button.disabled = !this.input.value.trim();
  }

  // Handles form submission to add a new task
  handleFormSubmit(e) {
    e.preventDefault();

    const text = this.input.value.trim();
    if (!text) return;

    this.todoList.addTask(text);
    const addedTask = this.todoList.getTasks().at(-1);
    this.domUtils.addTaskToList(addedTask.id, addedTask.text, addedTask.completed);

    this.input.value = "";
    this.button.disabled = true;

    setTimeout(() => {
      this.input.focus();
    }, 0);
  }
}

export default Form;