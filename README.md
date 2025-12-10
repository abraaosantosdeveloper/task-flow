# TaskFlow - Frontend

Aplicativo de gerenciamento de tarefas com autenticação e integração com API REST.

## 🚀 Funcionalidades

- ✅ **Autenticação completa**: Login e cadastro de usuários
- 📝 **CRUD de tarefas**: Criar, listar, editar e excluir tarefas
- 🎨 **Interface responsiva**: Mobile-first design (suporta até 320px)
- 🌙 **Tema escuro/claro**: Alternância de temas
- 📊 **Estatísticas**: Total, pendentes e concluídas
- 🔔 **Notificações toast**: Feedback visual para todas as ações
- 🔒 **Sessão persistente**: Token JWT armazenado

## 📁 Estrutura

```
task-app/
├── index.html          # Página principal do app
├── login.html          # Página de login
├── register.html       # Página de cadastro
├── css/
│   └── style.css       # Estilos completos com responsividade
└── js/
    ├── config.js       # Configuração da API e helpers
    ├── app.js          # Lógica principal do app
    ├── login.js        # Lógica de login
    └── register.js     # Lógica de cadastro
```

## ⚙️ Configuração da API

A URL da API é detectada automaticamente:
- **Desenvolvimento**: `http://localhost:5000/api`
- **Produção (GitHub Pages)**: `https://sua-api.vercel.app/api`

Para alterar a URL de produção, edite `js/config.js` linha 8:

```javascript
BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://SUA-API-AQUI.vercel.app/api', // ALTERE AQUI
```

## 🎯 Como usar

### Desenvolvimento Local

#### 1. **Inicie a API**
```bash
cd ~/Task_manager
python index.py
```

#### 2. **Abra o frontend**
```bash
cd ~/task-app
# Abra login.html em um navegador ou use um servidor local
python -m http.server 8000
```

#### 3. **Acesse**
- Abra: `http://localhost:8000/login.html`
- Crie uma conta ou faça login
- Comece a gerenciar suas tarefas!

---

### 🌐 Deploy no GitHub Pages

#### Passo 1: Configure a URL da API
No arquivo `js/config.js` (linha 8), altere para a URL da sua API na Vercel:

```javascript
: 'https://sua-api-vercel.vercel.app/api', // ALTERE AQUI
```

#### Passo 2: Publique no GitHub

```bash
cd task-app
git init
git add .
git commit -m "Deploy frontend"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/task-app.git
git push -u origin main
```

#### Passo 3: Ative o GitHub Pages
1. Vá em **Settings** → **Pages**
2. Em **Source**, selecione: **main** branch
3. Clique em **Save**
4. Aguarde 2-3 minutos

#### Passo 4: Acesse seu app
```
https://SEU-USUARIO.github.io/task-app/login.html
```

#### ⚠️ Importante: Configure CORS no Backend
No arquivo `index.py` do backend, adicione a URL do GitHub Pages:

```python
CORS(app, 
     resources={r"/*": {"origins": [
         "http://localhost:*",
         "https://SEU-USUARIO.github.io"
     ]}})
```

Depois faça deploy do backend novamente na Vercel.

## 📱 Responsividade

O app é totalmente responsivo e suporta:
- 🖥️ **Desktop**: 1024px+
- 📱 **Tablet**: 768px - 1023px
- 📱 **Mobile**: 380px - 767px
- 📱 **Small Mobile**: 320px - 379px

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens):

1. **Cadastro**: `POST /api/auth/register`
   - Nome, e-mail e senha (validação com REGEX)
   
2. **Login**: `POST /api/auth/login`
   - E-mail e senha
   - Retorna token JWT
   
3. **Validação**: `GET /api/auth/me`
   - Verifica token válido
   - Retorna dados do usuário

## ✨ Features Técnicas

### Validação de Formulários
- **E-mail**: Formato válido (REGEX)
- **Senha**: Mínimo 8 caracteres, 1 maiúscula, 1 número, 1 especial
- **Nome**: 3-50 caracteres, apenas letras

### Tratamento de Erros
- Status codes com mensagens personalizadas:
  - `200`: OK
  - `201`: Criado com sucesso
  - `400`: Requisição inválida
  - `401`: Não autorizado
  - `404`: Não encontrado
  - `409`: Conflito (e-mail já existe)
  - `500`: Erro interno do servidor

### Toasts Inteligentes
- **Sucesso**: Login/Cadastro realizado, tarefa criada/editada
- **Erro**: Falhas com status code específico
- **Info**: Informações gerais
- Auto-hide após 5 segundos
- Botão de fechar manual

### Animações Suaves
- Transições CSS com `cubic-bezier`
- Fade in/out para toasts
- Slide in para tarefas
- Hover effects suaves

## 🎨 Temas

Alterna entre claro e escuro:
- Armazena preferência no `localStorage`
- CSS Variables para fácil customização
- Transições suaves entre temas

## 📝 Endpoints da API Usados

```
Auth:
- POST   /api/auth/register    # Cadastrar
- POST   /api/auth/login       # Login
- GET    /api/auth/me          # Dados do usuário

Tasks:
- GET    /api/tasks            # Listar todas
- GET    /api/tasks/:id        # Buscar uma
- POST   /api/tasks            # Criar
- PUT    /api/tasks/:id        # Atualizar
- PUT    /api/tasks/:id/status # Mudar status
- DELETE /api/tasks/:id        # Excluir
- GET    /api/tasks/statistics # Estatísticas
```

## 🐛 Debug

Abra o Console do navegador (F12) para ver logs:
- Requisições à API
- Respostas e erros
- Estado das tarefas
- Eventos de autenticação

## 🔧 Customização

### Cores (CSS Variables)
Edite `:root` em `css/style.css`:
```css
:root {
    --primary: #6366f1;        /* Cor principal */
    --success: #10b981;        /* Sucesso */
    --danger: #ef4444;         /* Erro */
    --warning: #f59e0b;        /* Aviso */
    /* ... */
}
```

### API Timeout
Edite `js/config.js` para adicionar timeout às requisições.

## 📦 Dependências Externas

- **Boxicons**: Icons CDN
- **Fetch API**: Requisições HTTP (nativo)
- **LocalStorage**: Persistência (nativo)

## 🚨 Troubleshooting

### CORS Error
Certifique-se que a API está com CORS configurado:
```python
CORS(app, origins=['http://localhost:8000'], supports_credentials=True)
```

### Token Inválido
Limpe o localStorage e faça login novamente:
```javascript
localStorage.clear();
```

### API Offline
Verifique se a API está rodando:
```bash
curl http://localhost:5000/api
```

## 📄 Licença

MIT License - Livre para uso pessoal e comercial.

---

**Desenvolvido com ❤️ usando Vanilla JavaScript**
