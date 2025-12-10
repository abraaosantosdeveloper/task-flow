// ============================================
// API Configuration
// ============================================

const API_CONFIG = {
    // Base URL da API
    // Para produção, altere para: 'https://sua-api.vercel.app/api'
    BASE_URL: 'http://localhost:5000/api',
    
    // Endpoints
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            ME: '/auth/me'
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
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
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
    
    // Task endpoints
    static async getTasks() {
        return this.request(API_CONFIG.ENDPOINTS.TASKS.BASE);
    }
    
    static async getTask(id) {
        return this.request(API_CONFIG.ENDPOINTS.TASKS.BY_ID(id));
    }
    
    static async createTask(title, description, status = 'pending') {
        return this.request(API_CONFIG.ENDPOINTS.TASKS.BASE, {
            method: 'POST',
            body: JSON.stringify({ title, description, status })
        });
    }
    
    static async updateTask(id, title, description, status) {
        return this.request(API_CONFIG.ENDPOINTS.TASKS.BY_ID(id), {
            method: 'PUT',
            body: JSON.stringify({ title, description, status })
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
