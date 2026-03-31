const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

const allBtn = document.getElementById("allBtn");
const pendingBtn = document.getElementById("pendingBtn");
const completedBtn = document.getElementById("completedBtn");

const taskCount = document.getElementById("taskCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

addTaskBtn.addEventListener("click", addTask);

allBtn.addEventListener("click", function () {
  currentFilter = "all";
  renderTasks();
});

pendingBtn.addEventListener("click", function () {
  currentFilter = "pending";
  renderTasks();
});

completedBtn.addEventListener("click", function () {
  currentFilter = "completed";
  renderTasks();
});

clearCompletedBtn.addEventListener("click", function () {
  tasks = tasks.filter(function (task) {
    return !task.completed;
  });

  saveTasks();
  renderTasks();
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const newTask = {
    text: taskText,
    dueDate: dueDate,
    priority: priority,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDateInput.value = "";
  priorityInput.value = "Low";
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(task.dueDate);
  return due < today;
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter(function (task) {
      return !task.completed;
    });
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(function (task) {
      return task.completed;
    });
  }

  filteredTasks.forEach(function (task) {
    const realIndex = tasks.indexOf(task);

    const li = document.createElement("li");
    li.classList.add("task-item");

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("task-content");

    const span = document.createElement("div");
    span.textContent = task.text;
    span.classList.add("task-text");

    if (task.completed) {
      span.classList.add("completed");
    }

    contentDiv.appendChild(span);

    const meta = document.createElement("div");
    meta.classList.add("task-meta");

    if (task.dueDate) {
      meta.textContent = "Due: " + task.dueDate;
    } else {
      meta.textContent = "No due date";
    }

    contentDiv.appendChild(meta);

    if (isOverdue(task)) {
      const overdueText = document.createElement("div");
      overdueText.textContent = "Overdue";
      overdueText.classList.add("overdue-text");
      contentDiv.appendChild(overdueText);
    }

    const badge = document.createElement("span");
    badge.textContent = task.priority + " Priority";
    badge.classList.add("priority-badge");

    if (task.priority === "High") {
      badge.classList.add("priority-high");
    } else if (task.priority === "Medium") {
      badge.classList.add("priority-medium");
    } else {
      badge.classList.add("priority-low");
    }

    contentDiv.appendChild(badge);

    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("task-buttons");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", function () {
      const updatedText = prompt("Edit your task:", tasks[realIndex].text);

      if (updatedText === null) {
        return;
      }

      const cleanedText = updatedText.trim();

      if (cleanedText === "") {
        alert("Task cannot be empty.");
        return;
      }

      tasks[realIndex].text = cleanedText;
      saveTasks();
      renderTasks();
    });

    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "Undo" : "Complete";
    completeBtn.classList.add("complete-btn");
    completeBtn.addEventListener("click", function () {
      tasks[realIndex].completed = !tasks[realIndex].completed;
      saveTasks();
      renderTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", function () {
      tasks.splice(realIndex, 1);
      saveTasks();
      renderTasks();
    });

    buttonGroup.appendChild(editBtn);
    buttonGroup.appendChild(completeBtn);
    buttonGroup.appendChild(deleteBtn);

    li.appendChild(contentDiv);
    li.appendChild(buttonGroup);

    taskList.appendChild(li);
  });

  updateSummary();
  updateEmptyMessage(filteredTasks.length);
}

function updateSummary() {
  const total = tasks.length;
  const completed = tasks.filter(function (task) {
    return task.completed;
  }).length;
  const pending = total - completed;

  taskCount.textContent = "Total: " + total;
  completedCount.textContent = "Completed: " + completed;
  pendingCount.textContent = "Pending: " + pending;
}

function updateEmptyMessage(visibleTasks) {
  if (visibleTasks === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
}

renderTasks();