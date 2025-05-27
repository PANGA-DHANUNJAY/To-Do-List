let todos = [];

// Generate unique ID for each task
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substring(2);
}

// Load todos from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("todos");
    if (saved) {
        todos = JSON.parse(saved);
        todos.forEach(addTodoToDOM);
        updateTodoCount();
    }
});

// Add new todo
document.getElementById("todo-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const text = document.getElementById("todo").value.trim();
    if (!text) return;

    const todo = {
        id: generateId(),
        text,
        completed: false
    };

    todos.push(todo);
    document.getElementById("todo").value = "";

    addTodoToDOM(todo);
    saveTodos();
    updateTodoCount();
});

// Add a todo row to the table
function addTodoToDOM(todo) {
    const tr = document.createElement("tr");
    tr.setAttribute("data-id", todo.id);

    tr.innerHTML = `
        <td id="task">
            <label>
            <input type="checkbox" class="complete-checkbox" ${todo.completed ? "checked" : ""}>
            <span class="${todo.completed ? "completed" : ""}">${todo.text}</span>
            </label>
        </td>
        <td>
            <button class="remove">Remove</button>
        </td>
    `;

    document.getElementById("todo-items").appendChild(tr);
}

// Handle checkbox and remove button using event delegation
document.getElementById("todo-items").addEventListener("click", function (event) {
    const tr = event.target.closest("tr");
    if (!tr) return;

    const id = tr.getAttribute("data-id");
    const todo = todos.find(t => t.id === id);

    // Remove task
    if (event.target.classList.contains("remove")) {
        todos = todos.filter(t => t.id !== id);
        tr.remove();
        saveTodos();
        updateTodoCount();
    }

    // Toggle completion
    if (event.target.classList.contains("complete-checkbox")) {
        todo.completed = event.target.checked;
        const span = tr.querySelector("span");
        span.classList.toggle("completed", todo.completed);
        saveTodos();
    }
});

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Update footer task count
function updateTodoCount() {
    document.getElementById("todo-count").textContent = `Total tasks: ${todos.length}`;
}
