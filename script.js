document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const addTaskForm = document.getElementById('add-task-form');
    const tasksContainer = document.getElementById('tasks-container');
    const editModal = document.getElementById('edit-modal');
    const editTaskForm = document.getElementById('edit-task-form');
    const closeModalBtn = document.querySelector('.close');
    
    // Load tasks when page loads
    fetchTasks();
    
    // Event Listeners
    addTaskForm.addEventListener('submit', addTask);
    editTaskForm.addEventListener('submit', updateTask);
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeModal();
        }
    });
    
    // Functions
    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => {
                tasksContainer.innerHTML = '';
                if (tasks.length === 0) {
                    tasksContainer.innerHTML = '<p>No tasks found. Add a task to get started!</p>';
                    return;
                }
                
                tasks.forEach(task => {
                    const taskCard = createTaskCard(task);
                    tasksContainer.appendChild(taskCard);
                });
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
                tasksContainer.innerHTML = '<p>Error loading tasks. Please try again later.</p>';
            });
    }
    
    function createTaskCard(task) {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.dataset.id = task.id;
        
        const title = document.createElement('div');
        title.className = 'task-title';
        title.textContent = task.title;
        
        const description = document.createElement('div');
        description.className = 'task-description';
        description.textContent = task.description || 'No description';
        
        const actions = document.createElement('div');
        actions.className = 'task-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => openEditModal(task));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        taskCard.appendChild(title);
        taskCard.appendChild(description);
        taskCard.appendChild(actions);
        
        return taskCard;
    }
    
    function addTask(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        })
        .then(response => response.json())
        .then(newTask => {
            addTaskForm.reset();
            fetchTasks();
        })
        .catch(error => {
            console.error('Error adding task:', error);
            alert('Failed to add task. Please try again.');
        });
    }
    
    function openEditModal(task) {
        document.getElementById('edit-id').value = task.id;
        document.getElementById('edit-title').value = task.title;
        document.getElementById('edit-description').value = task.description || '';
        
        editModal.style.display = 'block';
    }
    
    function closeModal() {
        editModal.style.display = 'none';
    }
    
    function updateTask(e) {
        e.preventDefault();
        
        const id = document.getElementById('edit-id').value;
        const title = document.getElementById('edit-title').value;
        const description = document.getElementById('edit-description').value;
        
        fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        })
        .then(response => response.json())
        .then(updatedTask => {
            closeModal();
            fetchTasks();
        })
        .catch(error => {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please try again.');
        });
    }
    
    function deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            fetch(`/tasks/${id}`, {
                method: 'DELETE'
            })
            .then(() => {
                fetchTasks();
            })
            .catch(error => {
                console.error('Error deleting task:', error);
                alert('Failed to delete task. Please try again.');
            });
        }
    }
});
