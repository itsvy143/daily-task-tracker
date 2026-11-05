
// Get the HTML elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const filterButtons = document.querySelectorAll(".task-filters button");

// Load saved tasks from browser storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Current filter
let currentFilter = "all";

// Save tasks to browser storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks on the page
function displayTasks() {
    taskList.innerHTML = "";

    // Filter tasks based on the selected filter
    const filteredTasks = tasks.filter(function(task) {
        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    // Show a message if there are no matching tasks
    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    // Create an HTML element for each task
    filteredTasks.forEach(function(task) {
        const listItem = document.createElement("li");
        listItem.dataset.id = task.id;

        if (task.completed) {
            listItem.classList.add("completed");
        }

        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        const actions = document.createElement("div");
        actions.classList.add("task-actions");

        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "Undo" : "Complete";
        completeButton.dataset.action = "complete";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.dataset.action = "delete";

        actions.appendChild(completeButton);
        actions.appendChild(deleteButton);

        listItem.appendChild(taskText);
        listItem.appendChild(actions);

        taskList.appendChild(listItem);
    });
}

// Add a new task
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    displayTasks();
});

// Handle Complete and Delete buttons
taskList.addEventListener("click", function(event) {
    const clickedButton = event.target.closest("button");

    if (!clickedButton) {
        return;
    }

    const listItem = clickedButton.closest("li");
    const taskId = listItem.dataset.id;
    const action = clickedButton.dataset.action;

    if (action === "complete") {
        tasks = tasks.map(function(task) {
            if (task.id === taskId) {
                task.completed = !task.completed;
            }

            return task;
        });
    }

    if (action === "delete") {
        tasks = tasks.filter(function(task) {
            return task.id !== taskId;
        });
    }

    saveTasks();
    displayTasks();
});

// Handle task filters
filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(filterButton) {
            filterButton.classList.remove("active");
        });

        button.classList.add("active");

        displayTasks();
    });
});

// Display saved tasks when the page loads
displayTasks();
