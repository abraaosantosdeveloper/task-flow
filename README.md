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

## 📋 Requisitos Funcionais

### 1. Autenticação e Gestão de Usuários

#### RF-001: Cadastro de Usuário
**Endpoint**: `POST /api/auth/register`

**Descrição**: Permite que novos usuários criem uma conta no sistema.

**Dados de Entrada**:
- `email` (obrigatório): E-mail válido e único
- `password` (obrigatório): Senha com mínimo de 6 caracteres
- `name` (obrigatório): Nome completo do usuário

**Regras de Negócio**:
- Email deve ser único no sistema
- Senha deve ter no mínimo 6 caracteres
- Senha é armazenada com hash bcrypt
- Email e nome não podem ser vazios

**Dados de Saída**:
- Token JWT de autenticação
- Dados do usuário (id, email, name)
- Mensagem de sucesso

---

#### RF-002: Login de Usuário
**Endpoint**: `POST /api/auth/login`

**Descrição**: Permite que usuários autentiquem-se no sistema.

**Dados de Entrada**:
- `email` (obrigatório): E-mail cadastrado
- `password` (obrigatório): Senha do usuário

**Regras de Negócio**:
- Credenciais devem corresponder a um usuário existente
- Senha é verificada com bcrypt
- Token JWT é gerado com validade de 24 horas

**Funcionalidade Frontend**:
- Opção "Lembrar-me" (persistência de sessão)
- Validação de formulário em tempo real
- Exibição de senhas com toggle
- Entrada como visitante (demo)

---

#### RF-003: Recuperação de Dados do Usuário
**Endpoint**: `GET /api/auth/me`

**Descrição**: Retorna informações do usuário autenticado.

**Autenticação**: Token JWT obrigatório

**Dados de Saída**:
- `id`: ID do usuário
- `email`: E-mail do usuário
- `name`: Nome do usuário
- `created_at`: Data de criação da conta

---

#### RF-004: Atualização de Perfil
**Endpoint**: `PUT /api/auth/profile`

**Descrição**: Permite que o usuário atualize seus dados de perfil.

**Dados de Entrada**:
- `name` (obrigatório): Novo nome
- `email` (obrigatório): Novo email
- `current_password` (opcional): Senha atual (para trocar senha)
- `new_password` (opcional): Nova senha

**Funcionalidade Frontend**:
- Página de configurações dedicada
- Validação de senha atual antes de alterar
- Confirmação de nova senha
- Feedback visual para cada campo

---

### 2. Gestão de Tarefas

#### RF-005: Listar Todas as Tarefas
**Endpoint**: `GET /api/tasks`

**Descrição**: Retorna todas as tarefas do usuário autenticado.

**Dados de Saída**:
- Lista de tarefas com:
  - `id`: ID único da tarefa
  - `title`: Título da tarefa
  - `status`: Status atual (pending, in_progress, completed)
  - `created_at`: Data de criação
  - `completed_at`: Data de conclusão (se aplicável)

**Funcionalidade Frontend**:
- Exibição em lista com cards
- Filtros por status (abas)
- Contador de tarefas por categoria
- Estado vazio quando não há tarefas

---

#### RF-006: Buscar Tarefa Específica
**Endpoint**: `GET /api/tasks/:id`

**Descrição**: Retorna detalhes de uma tarefa específica.

**Regras de Negócio**:
- Tarefa deve pertencer ao usuário autenticado
- ID deve existir no banco de dados

---

#### RF-007: Criar Nova Tarefa
**Endpoint**: `POST /api/tasks`

**Descrição**: Cria uma nova tarefa para o usuário autenticado.

**Dados de Entrada**:
- `title` (obrigatório): Título da tarefa (máx. 200 caracteres)
- `status` (opcional): Status inicial (padrão: 'pending')

**Regras de Negócio**:
- Título não pode ser vazio
- Título limitado a 200 caracteres
- Status padrão é 'pending' se não informado
- Data de criação gerada automaticamente

**Funcionalidade Frontend**:
- Input com placeholder e ícone
- Limite de 100 caracteres visível
- Validação em tempo real
- Feedback toast após criação
- Adição instantânea à lista

---

#### RF-008: Atualizar Tarefa
**Endpoint**: `PUT /api/tasks/:id`

**Descrição**: Atualiza o título de uma tarefa existente.

**Dados de Entrada**:
- `title` (obrigatório): Novo título da tarefa

**Funcionalidade Frontend**:
- Modo de edição inline
- Botões de confirmar/cancelar
- Preservação do estado anterior ao cancelar
- Feedback visual após atualização

---

#### RF-009: Atualizar Status da Tarefa
**Endpoint**: `PUT /api/tasks/:id/status`

**Descrição**: Atualiza apenas o status de uma tarefa.

**Dados de Entrada**:
- `status` (obrigatório): Novo status (pending, in_progress, completed)

**Regras de Negócio**:
- Ao marcar como 'completed', `completed_at` é preenchido automaticamente
- Ao desmarcar de 'completed', `completed_at` é limpo

**Funcionalidade Frontend**:
- Checkbox para marcar como concluída
- Badge de status colorido
- Atualização instantânea das estatísticas
- Animação de transição

---

#### RF-010: Deletar Tarefa
**Endpoint**: `DELETE /api/tasks/:id`

**Descrição**: Remove permanentemente uma tarefa.

**Regras de Negócio**:
- Tarefa deve pertencer ao usuário autenticado
- Deleção é permanente (sem recuperação)

**Funcionalidade Frontend**:
- Botão com ícone de lixeira
- Remoção instantânea da lista
- Atualização das estatísticas
- Feedback toast

---

#### RF-011: Obter Estatísticas
**Endpoint**: `GET /api/tasks/statistics`

**Descrição**: Retorna contadores e estatísticas das tarefas.

**Dados de Saída**:
- `total`: Total de tarefas
- `pending`: Tarefas pendentes
- `in_progress`: Tarefas em progresso
- `completed`: Tarefas concluídas

**Funcionalidade Frontend**:
- Cards de estatísticas coloridos
- Ícones representativos
- Atualização automática após cada ação

---

#### RF-012: Limpar Tarefas Concluídas
**Funcionalidade**: Frontend apenas

**Descrição**: Remove todas as tarefas marcadas como concluídas.

**Regras de Negócio**:
- Executa múltiplas chamadas DELETE para cada tarefa concluída
- Atualização da lista após remoção

---

### 3. Funcionalidades de Interface

#### RF-013: Sistema de Temas (Dark/Light Mode)
**Descrição**: Permite alternar entre tema claro e escuro.

**Funcionalidade**:
- Toggle no header
- Ícone dinâmico (sol/lua)
- Persistência da preferência (localStorage)
- Transição suave entre temas

---

#### RF-014: Filtros de Tarefas
**Descrição**: Permite filtrar tarefas por status.

**Filtros Disponíveis**:
- **Todas**: Mostra todas as tarefas
- **Pendentes**: Apenas status 'pending'
- **Em Progresso**: Apenas status 'in_progress'
- **Concluídas**: Apenas status 'completed'

---

#### RF-015: Sistema de Notificações Toast
**Descrição**: Feedback visual para ações do usuário.

**Tipos de Notificação**:
- **Sucesso**: Ações completadas (verde)
- **Erro**: Falhas e erros (vermelho)
- **Informação**: Mensagens informativas (azul)
- **Aviso**: Alertas (amarelo)

**Funcionalidade**:
- Exibição temporária (3-5 segundos)
- Auto-fechamento
- Botão de fechar manual
- Animação de entrada/saída

---

#### RF-016: Menu de Usuário
**Descrição**: Menu dropdown com opções do usuário.

**Itens do Menu**:
- Nome do usuário
- Email do usuário
- Link para Configurações
- Link para Início
- Botão de Logout

---

#### RF-017: Página de Configurações
**Descrição**: Interface para gerenciar perfil do usuário.

**Funcionalidades**:
- Visualização de dados atuais
- Edição de nome e email
- Alteração de senha
- Validação de formulário
- Confirmação de senha atual

---

#### RF-018: Responsividade
**Descrição**: Interface adaptável a diferentes tamanhos de tela.

**Breakpoints**:
- **Mobile**: 320px - 480px
- **Tablet**: 481px - 768px
- **Desktop**: 769px+

**Adaptações**:
- Layout de coluna única em mobile
- Grid adaptável
- Fontes responsivas
- Botões otimizados para touch

---

#### RF-019: Validação de Formulários
**Descrição**: Validação em tempo real de campos de entrada.

**Validações Aplicadas**:
- Email: Formato válido
- Senha: Mínimo 6 caracteres
- Nome: Não vazio
- Título: Máximo 200 caracteres
- Feedback visual (bordas coloridas)
- Mensagens de erro específicas

---

#### RF-020: Estado Vazio (Empty State)
**Descrição**: Interface exibida quando não há tarefas.

**Funcionalidade**:
- Ilustração/ícone
- Mensagem amigável
- Call-to-action para criar primeira tarefa

---

#### RF-021: Persistência de Sessão
**Descrição**: Manutenção da sessão do usuário.

**Funcionalidade**:
- Token JWT armazenado em localStorage
- Verificação automática ao carregar páginas
- Redirecionamento para login se não autenticado
- Logout limpa todos os dados

**Dados Armazenados**:
- `authToken`: Token JWT
- `userEmail`: Email do usuário
- `userName`: Nome do usuário
- `theme`: Preferência de tema

---

### 4. Segurança

#### RF-022: Autenticação JWT
**Descrição**: Sistema de autenticação baseado em tokens.

**Características**:
- Token gerado no login
- Validade de 24 horas
- Enviado no header `Authorization: Bearer <token>`
- Verificação em todos os endpoints protegidos

---

#### RF-023: Hash de Senhas
**Descrição**: Armazenamento seguro de senhas.

**Características**:
- Algoritmo: bcrypt
- Nunca armazena senha em texto plano
- Verificação hash durante login

---

#### RF-024: Isolamento de Dados
**Descrição**: Garantia de privacidade dos dados.

**Regras**:
- Usuários acessam apenas suas próprias tarefas
- Verificação de propriedade em todas as operações
- Queries sempre filtradas por user_id

---

## 🔄 Fluxos de Uso Principais

### Fluxo 1: Primeiro Acesso
1. Usuário acessa a aplicação
2. Sistema redireciona para `/login.html`
3. Usuário clica em "Cadastre-se"
4. Preenche formulário de registro
5. Sistema cria conta e gera token
6. Redireciona para `/index.html`
7. Exibe estado vazio (sem tarefas)

### Fluxo 2: Criar Tarefa
1. Usuário digita título no input
2. Pressiona Enter ou clica em adicionar
3. Sistema valida entrada
4. Envia POST para `/api/tasks`
5. Backend cria tarefa no banco
6. Frontend adiciona à lista
7. Atualiza estatísticas
8. Exibe toast de sucesso

### Fluxo 3: Marcar como Concluída
1. Usuário clica no checkbox
2. Sistema envia PUT para `/api/tasks/:id/status`
3. Backend atualiza status para 'completed'
4. Frontend aplica estilos de concluída
5. Atualiza contadores

---

## 📝 Endpoints da API Usados

```
Auth:
- POST   /api/auth/register    # Cadastrar
- POST   /api/auth/login       # Login
- GET    /api/auth/me          # Dados do usuário
- PUT    /api/auth/profile     # Atualizar perfil

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
