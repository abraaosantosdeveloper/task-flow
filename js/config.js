// ============================================
// API Configuration
// ============================================

const API_CONFIG = {
    // Base URL da API
    // Detecta automaticamente se está em produção ou desenvolvimento
    BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'https://sua-api.vercel.app/api', // ALTERE para sua URL da API na Vercel
    
    // Endpoints
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            ME: '/auth/me',
            PROFILE: '/auth/profile'
        },
        TASKS: {
            BASE: '/tasks',
            BY_ID: (id) => `/tasks/${id}`,
            STATUS: (id) => `/tasks/${id}/status`,
            STATISTICS: '/tasks/statistics'
        }
    },
    
    // Headers padrão
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        };
        
        const token = localStorage.getItem('authToken');
        console.log('[API Config] Token no localStorage:', token ? `${token.substring(0, 20)}...` : 'AUSENTE');
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log('[API Config] Header Authorization configurado');
        } else {
            console.warn('[API Config] AVISO: Token não encontrado, requisição sem autenticação!');
        }
        
        return headers;
    }
};

// ============================================
// API Helper Functions
// ============================================

class API {
    static async request(endpoint, options = {}) {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        const config = {
            ...options,
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                ...API_CONFIG.getHeaders(),
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            console.log(`[API Request] ${options.method || 'GET'} ${endpoint}`);
            console.log('[API Request] Response status:', response.status);
            console.log('[API Request] Response data:', data);
            
            return {
                success: response.ok,
                status: response.status,
                data: data
            };
        } catch (error) {
            console.error('API Request Error:', error);
            return {
                success: false,
                status: 0,
                data: { message: 'Erro de conexão com o servidor' }
            };
        }
    }
    
    // Auth endpoints
    static async login(email, password) {
        return this.request(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }
    
    static async register(name, email, password) {
        return this.request(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
    }
    
    static async getMe() {
        return this.request(API_CONFIG.ENDPOINTS.AUTH.ME);
    }
    
    static async updateProfile(name, email, currentPassword, newPassword) {
        const body = { name, email };
        if (currentPassword && newPassword) {
            body.current_password = currentPassword;
            body.new_password = newPassword;
        }
        return this.request(API_CONFIG.ENDPOINTS.AUTH.PROFILE, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }
    
    // Task endpoints
    static async getTasks() {
        return this.request(API_CONFIG.ENDPOINTS.TASKS.BASE);
    }
    
    static async getTask(id) {
        return this.request(API_CONFIG.ENDPOINTS.TASKS.BY_ID(id));
    }
    
    static async createTask(title, status = 'pending') {
        return this.request(API_CONFIG.ENDPOINTS.TASKS.BASE, {
            method: 'POST',
            body: JSON.stringify({ title, status })
        });
    }
    
    static async updateTask(id, title, status) {
        return this.request(API_CONFIG.ENDPOINTS.TASKS.BY_ID(id), {
            method: 'PUT',
            body: JSON.stringify({ title, status })
        });
    }
    
    static async updateTaskStatus(id, status) {
        return this.request(API_CONFIG.ENDPOINTS.TASKS.STATUS(id), {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }
    
    static async deleteTask(id) {
        return this.request(API_CONFIG.ENDPOINTS.TASKS.BY_ID(id), {
            method: 'DELETE'
        });
    }
    
    static async getStatistics() {
        return this.request(API_CONFIG.ENDPOINTS.TASKS.STATISTICS);
    }
}

// ============================================
// HTTP Status Codes & Messages
// ============================================

const HTTP_STATUS = {
    200: 'OK',
    201: 'Criado com sucesso',
    400: 'Requisição inválida',
    401: 'Não autorizado',
    403: 'Acesso negado',
    404: 'Não encontrado',
    409: 'Conflito',
    422: 'Dados inválidos',
    500: 'Erro interno do servidor',
    502: 'Gateway inválido',
    503: 'Serviço indisponível'
};

function getStatusMessage(status) {
    return HTTP_STATUS[status] || `Erro desconhecido (${status})`;
}

// ============================================
// Error Message Handler
// ============================================

function getErrorMessage(response) {
    // Se houver mensagem específica do backend (erros de validação, etc)
    const backendMessage = response.data?.message || response.data?.data?.message;
    
    if (backendMessage) {
        // Lista de mensagens que devem ser mostradas completas
        const specificErrors = [
            'senha incorreta',
            'credenciais inválidas',
            'usuário não encontrado',
            'email já cadastrado',
            'senha atual incorreta',
            'token inválido',
            'sessão expirada',
            'tarefa não encontrada',
            'título é obrigatório',
            'status inválido'
        ];
        
        const lowerMessage = backendMessage.toLowerCase();
        
        // Verifica se é um erro específico que deve ser mostrado
        if (specificErrors.some(err => lowerMessage.includes(err))) {
            return backendMessage;
        }
    }
    
    // Para outros erros, retorna mensagem genérica com código
    return `Erro na aplicação (${response.status})`;
}
