// ============================================
// Settings Page - Profile Management
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Settings page loaded');

    // Form Elements
    const settingsForm = document.getElementById('settingsForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Error Elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const currentPasswordError = document.getElementById('currentPasswordError');
    const newPasswordError = document.getElementById('newPasswordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    
    // Buttons
    const cancelBtn = document.getElementById('cancelBtn');
    const toggleCurrentPassword = document.getElementById('toggleCurrentPassword');
    const toggleNewPassword = document.getElementById('toggleNewPassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    
    // User Menu
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const themeToggle = document.getElementById('themeToggle');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    // RegEx Patterns
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]{3,50}$/;

    // ============================================
    // Check Authentication
    // ============================================
    async function checkAuth() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        
        try {
            const response = await API.getMe();
            const userData = response.data?.data?.user || response.data?.user;
            
            if (response.success && userData) {
                loadUserData(userData);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            showToast('Erro ao verificar autenticação', 'error');
        }
    }

    function loadUserData(user) {
        // Fill form
        nameInput.value = user.name || '';
        emailInput.value = user.email || '';
        
        // Update header
        document.getElementById('userName').textContent = user.name || 'Usuário';
        document.getElementById('userEmail').textContent = user.email || '';
        
        // Update account info
        const memberSince = document.getElementById('memberSince');
        const accountId = document.getElementById('accountId');
        
        if (user.created_at) {
            const date = new Date(user.created_at.replace(' ', 'T'));
            memberSince.textContent = date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        }
        
        accountId.textContent = `#${user.id}`;
    }

    function logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    }

    // ============================================
    // Toggle Password Visibility
    // ============================================
    function setupPasswordToggle(button, input) {
        button.addEventListener('click', () => {
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            
            const icon = button.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('bx-show');
                icon.classList.add('bx-hide');
            } else {
                icon.classList.remove('bx-hide');
                icon.classList.add('bx-show');
            }
        });
    }

    setupPasswordToggle(toggleCurrentPassword, currentPasswordInput);
    setupPasswordToggle(toggleNewPassword, newPasswordInput);
    setupPasswordToggle(toggleConfirmPassword, confirmPasswordInput);

    // ============================================
    // Validation Functions
    // ============================================
    function validateName() {
        const name = nameInput.value.trim();
        
        if (name === '') {
            showError(nameInput, nameError, 'Nome é obrigatório');
            return false;
        }
        
        if (name.length < 3) {
            showError(nameInput, nameError, 'Nome deve ter no mínimo 3 caracteres');
            return false;
        }
        
        if (name.length > 50) {
            showError(nameInput, nameError, 'Nome deve ter no máximo 50 caracteres');
            return false;
        }
        
        if (!nameRegex.test(name)) {
            showError(nameInput, nameError, 'Nome deve conter apenas letras e espaços');
            return false;
        }
        
        hideError(nameInput, nameError);
        return true;
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        
        if (email === '') {
            showError(emailInput, emailError, 'E-mail é obrigatório');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            showError(emailInput, emailError, 'E-mail inválido');
            return false;
        }
        
        hideError(emailInput, emailError);
        return true;
    }

    function validatePasswords() {
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // If any password field is filled, all related fields must be filled
        if (currentPassword || newPassword || confirmPassword) {
            if (!currentPassword) {
                showError(currentPasswordInput, currentPasswordError, 'Senha atual é obrigatória');
                return false;
            }
            
            if (!newPassword) {
                showError(newPasswordInput, newPasswordError, 'Nova senha é obrigatória');
                return false;
            }
            
            if (newPassword.length < 8) {
                showError(newPasswordInput, newPasswordError, 'Senha deve ter no mínimo 8 caracteres');
                return false;
            }
            
            if (!passwordRegex.test(newPassword)) {
                const errors = [];
                if (!/[A-Z]/.test(newPassword)) errors.push('1 maiúscula');
                if (!/\d/.test(newPassword)) errors.push('1 número');
                if (!/[@$!%*?&#]/.test(newPassword)) errors.push('1 caractere especial');
                
                showError(newPasswordInput, newPasswordError, `Senha deve conter: ${errors.join(', ')}`);
                return false;
            }
            
            if (newPassword !== confirmPassword) {
                showError(confirmPasswordInput, confirmPasswordError, 'As senhas não coincidem');
                return false;
            }
            
            hideError(currentPasswordInput, currentPasswordError);
            hideError(newPasswordInput, newPasswordError);
            hideError(confirmPasswordInput, confirmPasswordError);
        }
        
        return true;
    }

    function showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    function hideError(input, errorElement) {
        input.classList.remove('error');
        errorElement.classList.remove('show');
    }

    // ============================================
    // Real-time Validation
    // ============================================
    nameInput.addEventListener('blur', validateName);
    nameInput.addEventListener('input', () => {
        if (nameError.classList.contains('show')) validateName();
    });

    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => {
        if (emailError.classList.contains('show')) validateEmail();
    });

    newPasswordInput.addEventListener('blur', validatePasswords);
    confirmPasswordInput.addEventListener('blur', validatePasswords);

    // ============================================
    // Form Submit
    // ============================================
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const arePasswordsValid = validatePasswords();
        
        if (!isNameValid || !isEmailValid || !arePasswordsValid) {
            return;
        }
        
        // Get form data
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const currentPassword = currentPasswordInput.value || null;
        const newPassword = newPasswordInput.value || null;
        
        // Loading state
        const submitButton = settingsForm.querySelector('.btn-save');
        const originalContent = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Salvando...</span><i class="bx bx-loader-alt bx-spin"></i>';
        
        try {
            const response = await API.updateProfile(name, email, currentPassword, newPassword);
            console.log('[Settings] Response:', response);
            
            if (response.success) {
                const userData = response.data?.data?.user || response.data?.user;
                
                if (userData) {
                    // Update localStorage
                    localStorage.setItem('userName', userData.name);
                    localStorage.setItem('userEmail', userData.email);
                    
                    // Clear password fields
                    currentPasswordInput.value = '';
                    newPasswordInput.value = '';
                    confirmPasswordInput.value = '';
                    
                    showToast('Perfil atualizado com sucesso!', 'success');
                    
                    // Reload user data
                    setTimeout(() => {
                        checkAuth();
                    }, 1000);
                }
            } else {
                let errorMessage = 'Erro ao atualizar perfil';
                
                if (response.status === 400) {
                    errorMessage = response.data?.message || 'Dados inválidos';
                    
                    // Show specific field errors if available
                    if (response.data?.message?.includes('password')) {
                        showError(currentPasswordInput, currentPasswordError, response.data.message);
                    }
                }
                
                showToast(errorMessage, 'error');
            }
        } catch (error) {
            console.error('[Settings] Error:', error);
            showToast('Erro ao atualizar perfil', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalContent;
        }
    });

    // ============================================
    // Cancel Button
    // ============================================
    cancelBtn.addEventListener('click', () => {
        if (confirm('Deseja descartar as alterações?')) {
            checkAuth(); // Reload original data
            
            // Clear password fields
            currentPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';
            
            // Clear errors
            hideError(nameInput, nameError);
            hideError(emailInput, emailError);
            hideError(currentPasswordInput, currentPasswordError);
            hideError(newPasswordInput, newPasswordError);
            hideError(confirmPasswordInput, confirmPasswordError);
        }
    });

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
    // Initialize
    // ============================================
    await checkAuth();
});
