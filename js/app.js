// ============================================
// Task App - Main Functionality with API Integration
// ============================================

// State
let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;

// Elements (will be initialized after DOM loads)
let taskForm, taskInput, taskDescriptionInput, tasksList, emptyState, filterTabs, clearCompletedBtn;
let userMenuBtn, userDropdown, themeToggle, toast, toastMessage, userEmailDisplay, userNameDisplay;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('App iniciado');
    
    // Initialize elements
    taskForm = document.getElementById('taskForm');
    taskInput = document.getElementById('taskInput');
    tasksList = document.getElementById('tasksList');
    emptyState = document.getElementById('emptyState');
    filterTabs = document.querySelectorAll('.filter-tab');
    clearCompletedBtn = document.getElementById('clearCompleted');
    userMenuBtn = document.getElementById('userMenuBtn');
    userDropdown = document.getElementById('userDropdown');
    themeToggle = document.getElementById('themeToggle');
    toast = document.getElementById('toast');
    toastMessage = document.getElementById('toastMessage');
    userEmailDisplay = document.getElementById('userEmail');
    
    console.log('Elementos inicializados');
    
    // Check authentication
    await checkAuth();

    // Load tasks from API
    await loadTasks();

    // ============================================
    // Authentication Check
    // ============================================
    async function checkAuth() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.log('Usuário não autenticado, redirecionando...');
            window.location.href = 'login.html';
            return;
        }
        
        try {
            const response = await API.getMe();
            
            if (response.success && response.data.user) {
                console.log('Usuário autenticado:', response.data.user.email);
                
                // Update user display
                if (userEmailDisplay) {
                    userEmailDisplay.textContent = response.data.user.email;
                }
                
                // Update header user name if exists
                const userName = document.querySelector('.user-name');
                if (userName && response.data.user.name) {
                    userName.textContent = response.data.user.name;
                }
            } else {
                // Token invalid, logout
                console.log('Token inválido, fazendo logout...');
                logout();
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            logout();
        }
    }

    function logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    }

    // ============================================
    // User Menu
    // ============================================
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });

    // Logout
    const logoutLinks = document.querySelectorAll('.logout');
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });

    // ============================================
    // Theme Toggle
    // ============================================
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.querySelector('i').classList.replace('bx-moon', 'bx-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.classList.replace('bx-moon', 'bx-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('bx-sun', 'bx-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // ============================================
    // Task Management - API Integration
    // ============================================
    
    // Load Tasks from API
    async function loadTasks() {
        try {
            const response = await API.getTasks();
            
            if (response.success && response.data.tasks) {
                tasks = response.data.tasks;
                console.log('Tarefas carregadas da API:', tasks.length);
                renderTasks();
            } else {
                console.error('Erro ao carregar tarefas:', response.data.message);
                if (response.status === 401) {
                    logout();
                } else {
                    showToast(`Erro ao carregar tarefas: ${getStatusMessage(response.status)}`, 'error');
                }
            }
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            showToast('Erro ao conectar com o servidor', 'error');
        }
    }
    
    // Add Task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = taskInput.value.trim();
        if (title === '') return;
        
        // Show loading
        const submitButton = taskForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i>';
        }
        
        try {
            const response = await API.createTask(title, '', 'pending');
            
            if (response.success && response.data.task) {
                tasks.unshift(response.data.task);
                renderTasks();
                taskInput.value = '';
                showToast('Tarefa adicionada com sucesso!', 'success');
            } else {
                console.error('Erro ao criar tarefa:', response.data.message);
                showToast(`Erro: ${response.status} (${getStatusMessage(response.status)})`, 'error');
            }
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            showToast('Erro: 500 (Internal Server Error)', 'error');
        } finally {
            // Remove loading
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="bx bx-plus"></i>';
            }
        }
    });

    // Toggle Task Completion
    async function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        
        try {
            const response = await API.updateTaskStatus(id, newStatus);
            
            if (response.success) {
                // Update local task
                task.status = newStatus;
                task.completed_at = newStatus === 'completed' ? new Date().toISOString() : null;
                renderTasks();
                
                const message = newStatus === 'completed' ? 'Tarefa concluída!' : 'Tarefa reaberta!';
                showToast(message, 'success');
            } else {
                console.error('Erro ao atualizar status:', response.data.message);
                showToast(`Erro: ${response.status} (${getStatusMessage(response.status)})`, 'error');
            }
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            showToast('Erro: 500 (Internal Server Error)', 'error');
        }
    }

    // Delete Task
    async function deleteTask(id) {
        if (!confirm('Deseja realmente excluir esta tarefa?')) {
            return;
        }
        
        try {
            const response = await API.deleteTask(id);
            
            if (response.success) {
                tasks = tasks.filter(t => t.id !== id);
                renderTasks();
                showToast('Tarefa removida!', 'success');
            } else {
                console.error('Erro ao excluir tarefa:', response.data.message);
                showToast(`Erro: ${response.status} (${getStatusMessage(response.status)})`, 'error');
            }
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            showToast('Erro: 500 (Internal Server Error)', 'error');
        }
    }
    
    // Edit Task
    async function editTask(id, taskItem) {
        const taskText = taskItem.querySelector('.task-text');
        const editBtn = taskItem.querySelector('.edit');
        const isEditing = taskText.contentEditable === 'true';
        
        if (isEditing) {
            // Save changes
            const newTitle = taskText.textContent.trim();
            
            if (newTitle === '') {
                showToast('Tarefa não pode estar vazia', 'error');
                // Restore original text
                const task = tasks.find(t => t.id === id);
                taskText.textContent = task.title;
                taskText.contentEditable = 'false';
                taskItem.classList.remove('editing');
                editBtn.innerHTML = '<i class="bx bx-edit"></i>';
                return;
            }
            
            const task = tasks.find(t => t.id === id);
            if (!task) return;
            
            try {
                const response = await API.updateTask(id, newTitle, task.description || '', task.status);
                
                if (response.success) {
                    task.title = newTitle;
                    taskText.contentEditable = 'false';
                    taskItem.classList.remove('editing');
                    editBtn.innerHTML = '<i class="bx bx-edit"></i>';
                    showToast('Tarefa atualizada!', 'success');
                } else {
                    console.error('Erro ao atualizar tarefa:', response.data.message);
                    showToast(`Erro: ${response.status} (${getStatusMessage(response.status)})`, 'error');
                    // Restore original text
                    taskText.textContent = task.title;
                    taskText.contentEditable = 'false';
                    taskItem.classList.remove('editing');
                    editBtn.innerHTML = '<i class="bx bx-edit"></i>';
                }
            } catch (error) {
                console.error('Erro ao atualizar tarefa:', error);
                showToast('Erro: 500 (Internal Server Error)', 'error');
            }
        } else {
            // Enter edit mode
            taskText.contentEditable = 'true';
            taskText.focus();
            taskItem.classList.add('editing');
            editBtn.innerHTML = '<i class="bx bx-check"></i>';
            
            // Select all text
            const range = document.createRange();
            range.selectNodeContents(taskText);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Save on Enter, cancel on Escape
            const handleKeydown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    editBtn.click();
                    taskText.removeEventListener('keydown', handleKeydown);
                } else if (e.key === 'Escape') {
                    const task = tasks.find(t => t.id === id);
                    taskText.textContent = task.title;
                    taskText.contentEditable = 'false';
                    taskItem.classList.remove('editing');
                    editBtn.innerHTML = '<i class="bx bx-edit"></i>';
                    taskText.removeEventListener('keydown', handleKeydown);
                }
            };
            
            taskText.addEventListener('keydown', handleKeydown);
        }
    }

    // Clear Completed Tasks
    clearCompletedBtn.addEventListener('click', async () => {
        const completedTasks = tasks.filter(t => t.status === 'completed');
        
        if (completedTasks.length === 0) {
            showToast('Nenhuma tarefa concluída para limpar', 'info');
            return;
        }
        
        if (!confirm(`Deseja remover ${completedTasks.length} tarefa(s) concluída(s)?`)) {
            return;
        }
        
        // Delete all completed tasks
        const deletePromises = completedTasks.map(task => API.deleteTask(task.id));
        
        try {
            const results = await Promise.all(deletePromises);
            const successCount = results.filter(r => r.success).length;
            
            if (successCount > 0) {
                tasks = tasks.filter(t => t.status !== 'completed');
                renderTasks();
                showToast(`${successCount} tarefa(s) removida(s)!`, 'success');
            }
            
            if (successCount < completedTasks.length) {
                showToast('Algumas tarefas não puderam ser removidas', 'error');
            }
        } catch (error) {
            console.error('Erro ao limpar tarefas:', error);
            showToast('Erro: 500 (Internal Server Error)', 'error');
        }
    });

    // ============================================
    // Filter Tasks
    // ============================================
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderTasks();
        });
    });

    function getFilteredTasks() {
        switch (currentFilter) {
            case 'pending':
                return tasks.filter(t => t.status !== 'completed');
            case 'completed':
                return tasks.filter(t => t.status === 'completed');
            default:
                return tasks;
        }
    }

    // ============================================
    // Render Tasks
    // ============================================
    function renderTasks() {
        console.log('renderTasks chamada');
        const filteredTasks = getFilteredTasks();
        console.log('Tarefas filtradas:', filteredTasks.length);
        
        // Update stats
        updateStats();
        
        // Clear list
        tasksList.innerHTML = '';
        console.log('Lista limpa');
        
        // Show/hide empty state
        if (filteredTasks.length === 0) {
            console.log('Nenhuma tarefa para exibir, mostrando empty state');
            emptyState.classList.add('show');
            tasksList.style.display = 'none';
            return;
        } else {
            console.log('Exibindo tarefas...');
            emptyState.classList.remove('show');
            tasksList.style.display = 'flex';
        }
        
        // Render tasks
        filteredTasks.forEach(task => {
            console.log('Renderizando tarefa:', task.title);
            const taskItem = createTaskElement(task);
            tasksList.appendChild(taskItem);
        });
        
        console.log('Tarefas renderizadas com sucesso!');
    }

    function createTaskElement(task) {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.status === 'completed' ? 'completed' : ''}`;
        taskItem.dataset.id = task.id;
        
        const timeAgo = getTimeAgo(task.created_at);
        
        taskItem.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.status === 'completed' ? 'checked' : ''}
                data-id="${task.id}"
            >
            <div class="task-content">
                <p class="task-text" contenteditable="false">${escapeHtml(task.title)}</p>
                <span class="task-time">${timeAgo}</span>
            </div>
            <div class="task-actions">
                <button class="btn-task edit" data-id="${task.id}" aria-label="Editar tarefa">
                    <i class='bx bx-edit'></i>
                </button>
                <button class="btn-task delete" data-id="${task.id}" aria-label="Excluir tarefa">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        `;
        
        // Event listeners
        const checkbox = taskItem.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => toggleTask(task.id));
        
        const editBtn = taskItem.querySelector('.edit');
        editBtn.addEventListener('click', () => editTask(task.id, taskItem));
        
        const deleteBtn = taskItem.querySelector('.delete');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        return taskItem;
    }

    // ============================================
    // Update Statistics
    // ============================================
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const pending = total - completed;
        
        const totalElement = document.getElementById('totalTasks');
        const pendingElement = document.getElementById('pendingTasks');
        const completedElement = document.getElementById('completedTasks');
        
        if (totalElement) totalElement.textContent = total;
        if (pendingElement) pendingElement.textContent = pending;
        if (completedElement) completedElement.textContent = completed;
        
        console.log('Stats atualizadas - Total:', total, 'Pendentes:', pending, 'Concluídas:', completed);
    }

    // ============================================
    // Toast Notification
    // ============================================
    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        
        const icon = toast.querySelector('.toast-content i');
        icon.className = 'bx';
        
        toast.className = 'toast show';
        
        switch (type) {
            case 'success':
                icon.classList.add('bx-check-circle');
                toast.classList.add('success');
                break;
            case 'error':
                icon.classList.add('bx-error-circle');
                toast.classList.add('error');
                break;
            case 'info':
                icon.classList.add('bx-info-circle');
                toast.classList.add('info');
                break;
        }
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }
    
    // Toast close button
    const toastClose = document.getElementById('toastClose');
    if (toastClose) {
        toastClose.addEventListener('click', () => {
            toast.classList.remove('show');
        });
    }

    // ============================================
    // Utility Functions
    // ============================================
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'Agora mesmo';
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min atrás`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h atrás`;
        
        const days = Math.floor(hours / 24);
        if (days === 1) return 'Ontem';
        if (days < 7) return `${days} dias atrás`;
        
        return date.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'short' 
        });
    }

    console.log('App inicializado com sucesso!');
});
