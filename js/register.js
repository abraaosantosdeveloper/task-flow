// ============================================
// Register Page - Validation & Registration
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Form Elements
    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

    // RegEx Patterns
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]{3,50}$/;

    // ============================================
    // Toggle Password Visibility
    // ============================================
    togglePassword.addEventListener('click', () => {
        togglePasswordVisibility(passwordInput, togglePassword);
    });

    toggleConfirmPassword.addEventListener('click', () => {
        togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);
    });

    function togglePasswordVisibility(input, button) {
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
    }

    // ============================================
    // Real-time Validation
    // ============================================
    nameInput.addEventListener('blur', () => validateName());
    nameInput.addEventListener('input', () => {
        if (nameError.classList.contains('show')) validateName();
    });

    emailInput.addEventListener('blur', () => validateEmail());
    emailInput.addEventListener('input', () => {
        if (emailError.classList.contains('show')) validateEmail();
    });

    passwordInput.addEventListener('blur', () => validatePassword());
    passwordInput.addEventListener('input', () => {
        if (passwordError.classList.contains('show')) validatePassword();
    });

    confirmPasswordInput.addEventListener('blur', () => validateConfirmPassword());
    confirmPasswordInput.addEventListener('input', () => {
        if (confirmPasswordError.classList.contains('show')) validateConfirmPassword();
    });

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
            showError(emailInput, emailError, 'E-mail inválido (exemplo: usuario@email.com)');
            return false;
        }
        
        hideError(emailInput, emailError);
        return true;
    }

    function validatePassword() {
        const password = passwordInput.value;
        
        if (password === '') {
            showError(passwordInput, passwordError, 'Senha é obrigatória');
            return false;
        }
        
        if (password.length < 8) {
            showError(passwordInput, passwordError, 'Senha deve ter no mínimo 8 caracteres');
            return false;
        }
        
        if (!passwordRegex.test(password)) {
            const errors = [];
            if (!/[A-Z]/.test(password)) errors.push('1 maiúscula');
            if (!/\d/.test(password)) errors.push('1 número');
            if (!/[@$!%*?&#]/.test(password)) errors.push('1 caractere especial');
            
            showError(passwordInput, passwordError, `Senha deve conter: ${errors.join(', ')}`);
            return false;
        }
        
        hideError(passwordInput, passwordError);
        
        // Re-validate confirm password if it has a value
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
        
        return true;
    }

    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword === '') {
            showError(confirmPasswordInput, confirmPasswordError, 'Confirmação de senha é obrigatória');
            return false;
        }
        
        if (password !== confirmPassword) {
            showError(confirmPasswordInput, confirmPasswordError, 'As senhas não coincidem');
            return false;
        }
        
        hideError(confirmPasswordInput, confirmPasswordError);
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
    // Form Submit - Registration
    // ============================================
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        
        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            return;
        }
        
        // Get form data
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Add loading state
        const submitButton = registerForm.querySelector('.btn-register');
        const originalContent = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Criando conta...</span><i class="bx bx-loader-alt bx-spin"></i>';
        
        try {
            // Call API
            const response = await API.register(name, email, password);
            
            if (response.success) {
                // Store token and user data
                if (response.data.token) {
                    localStorage.setItem('authToken', response.data.token);
                }
                if (response.data.user) {
                    localStorage.setItem('userName', response.data.user.name);
                    localStorage.setItem('userEmail', response.data.user.email);
                }
                
                showToast('Cadastro realizado com sucesso!', 'success');
                
                // Redirect after 1.5 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } else {
                // Handle errors
                let errorMessage = 'Cadastro falhou';
                
                if (response.status === 409) {
                    errorMessage = 'E-mail já cadastrado';
                    showError(emailInput, emailError, errorMessage);
                } else if (response.status === 400 || response.status === 422) {
                    errorMessage = response.data.message || 'Dados inválidos';
                } else if (response.status === 0) {
                    errorMessage = 'Erro de conexão com o servidor';
                } else {
                    errorMessage = `Erro: ${response.status} (${getStatusMessage(response.status)})`;
                }
                
                showToast(errorMessage, 'error');
                
                // Re-enable button
                submitButton.disabled = false;
                submitButton.innerHTML = originalContent;
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            showToast('Erro: 500 (Internal Server Error)', 'error');
            
            // Re-enable button
            submitButton.disabled = false;
            submitButton.innerHTML = originalContent;
        }
    });

    // ============================================
    // Toast Notification
    // ============================================
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = toast.querySelector('.toast-content i');
        
        // Update message
        toastMessage.textContent = message;
        
        // Update icon and color
        toast.className = 'toast show';
        if (type === 'success') {
            toast.classList.add('success');
            toastIcon.className = 'bx bx-check-circle';
        } else if (type === 'error') {
            toast.classList.add('error');
            toastIcon.className = 'bx bx-error-circle';
        } else if (type === 'info') {
            toast.classList.add('info');
            toastIcon.className = 'bx bx-info-circle';
        }
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    // Toast close button
    const toastClose = document.getElementById('toastClose');
    if (toastClose) {
        toastClose.addEventListener('click', () => {
            document.getElementById('toast').classList.remove('show');
        });
    }
});
