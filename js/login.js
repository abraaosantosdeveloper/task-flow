// ============================================
// Login Validation & Authentication
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        // Verify token is still valid
        API.getMe().then(response => {
            if (response.success) {
                window.location.href = 'index.html';
            } else {
                // Token invalid, clear storage
                localStorage.removeItem('authToken');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
            }
        });
    }

    // Form Elements
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const togglePassword = document.getElementById('togglePassword');
    const demoButton = document.querySelector('.btn-demo');

    // RegEx Patterns
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Senha: Mínimo 8 caracteres, pelo menos 1 maiúscula, 1 número e 1 caractere especial
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    // ============================================
    // Toggle Password Visibility
    // ============================================
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        const icon = togglePassword.querySelector('i');
        if (type === 'text') {
            icon.classList.remove('bx-show');
            icon.classList.add('bx-hide');
        } else {
            icon.classList.remove('bx-hide');
            icon.classList.add('bx-show');
        }
    });

    // ============================================
    // Real-time Validation
    // ============================================
    emailInput.addEventListener('blur', () => {
        validateEmail();
    });

    emailInput.addEventListener('input', () => {
        if (emailError.classList.contains('show')) {
            validateEmail();
        }
    });

    passwordInput.addEventListener('blur', () => {
        validatePassword();
    });

    passwordInput.addEventListener('input', () => {
        if (passwordError.classList.contains('show')) {
            validatePassword();
        }
    });

    // ============================================
    // Validation Functions
    // ============================================
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
    // Form Submit - Login with API
    // ============================================
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }
        
        // Get form data
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Add loading state
        const submitButton = loginForm.querySelector('.btn-login');
        const originalContent = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Entrando...</span><i class="bx bx-loader-alt bx-spin"></i>';
        
        try {
            // Call API
            const response = await API.login(email, password);
            
            if (response.success) {
                console.log('[Login] Response completa:', response);
                console.log('[Login] response.data:', response.data);
                console.log('[Login] response.data.data:', response.data.data);
                
                // A API retorna { success, message, data: { token, user } }
                // Então precisamos acessar response.data.data
                const loginData = response.data.data || response.data;
                console.log('[Login] loginData extraído:', loginData);
                
                // Store token and user data
                if (loginData && loginData.token) {
                    localStorage.setItem('authToken', loginData.token);
                    console.log('[Login] ✅ Token armazenado:', loginData.token.substring(0, 20) + '...');
                } else {
                    console.error('[Login] ❌ Token não encontrado na resposta!');
                    console.error('[Login] loginData:', loginData);
                }
                
                if (loginData && loginData.user) {
                    localStorage.setItem('userName', loginData.user.name);
                    localStorage.setItem('userEmail', loginData.user.email);
                    console.log('[Login] ✅ Dados do usuário armazenados:', loginData.user.email);
                } else {
                    console.error('[Login] ❌ Dados do usuário não encontrados!');
                }
                
                // Save remember me preference
                const rememberMe = document.getElementById('rememberMe').checked;
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('savedEmail', email);
                } else {
                    localStorage.removeItem('rememberMe');
                    localStorage.removeItem('savedEmail');
                }
                
                // Verify token was saved
                const savedToken = localStorage.getItem('authToken');
                console.log('Token verification:', savedToken ? 'Token saved successfully' : 'ERROR: Token not saved!');
                
                showToast('Login realizado com sucesso!', 'success');
                
                // Redirect after 1.5 seconds to ensure localStorage is updated
                setTimeout(() => {
                    console.log('Redirecting to index.html...');
                    window.location.href = 'index.html';
                }, 1500);
                
            } else {
                // Handle authentication errors
                if (response.status === 401) {
                    showError(emailInput, emailError, 'Credenciais inválidas');
                    showError(passwordInput, passwordError, 'Credenciais inválidas');
                    showToast('Credenciais inválidas!', 'error');
                } else {
                    // For other errors, use generic message with code
                    const errorMessage = getErrorMessage(response);
                    showToast(errorMessage, 'error');
                }
                
                // Re-enable button
                submitButton.disabled = false;
                submitButton.innerHTML = originalContent;
            }
            
        } catch (error) {
            console.error('Login error:', error);
            showToast('Erro na aplicação (500)', 'error');
            
            // Re-enable button
            submitButton.disabled = false;
            submitButton.innerHTML = originalContent;
        }
    });

    // ============================================
    // Demo Login (Removed - use real registration)
    // ============================================
    demoButton.addEventListener('click', () => {
        // Redirect to register page
        window.location.href = 'register.html';
    });
    
    // Update demo button text
    demoButton.innerHTML = '<i class="bx bx-user-plus"></i><span>Criar conta</span>';

    // ============================================
    // Auto-fill saved email
    // ============================================
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedEmail = localStorage.getItem('savedEmail');
        if (savedEmail) {
            emailInput.value = savedEmail;
            document.getElementById('rememberMe').checked = true;
        }
    }

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
