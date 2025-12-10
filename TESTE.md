# 🚀 Guia Rápido de Teste - TaskFlow

## 📋 Pré-requisitos

1. ✅ MySQL instalado e rodando
2. ✅ Python 3.8+ com venv
3. ✅ Navegador moderno (Chrome, Firefox, Edge)

## 🔧 Setup em 5 minutos

### 1️⃣ **Configure o Backend (Task_manager)**

```bash
cd ~/Task_manager

# Crie o ambiente virtual (se ainda não existe)
python3 -m venv venv
source venv/bin/activate

# Instale dependências
pip install -r requirements.txt

# Configure o banco de dados
mysql -u root -p < database.sql
# Digite sua senha do MySQL quando solicitado

# Crie o arquivo .env
cp .env.example .env
nano .env  # Ou use seu editor preferido
```

**Edite o `.env` com suas credenciais:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=task_manager
DB_USER=root
DB_PASSWORD=SUA_SENHA_AQUI

JWT_SECRET_KEY=mude-para-uma-chave-secreta-forte-123456
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000

CORS_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
BCRYPT_ROUNDS=12
```

**Inicie a API:**
```bash
python index.py
```

Você deve ver:
```
🚀 Starting Task Manager API...
📊 Environment: development
🔌 Port: 5000
 * Running on http://127.0.0.1:5000
```

✅ **API está rodando!**

---

### 2️⃣ **Inicie o Frontend (task-app)**

Abra um **NOVO terminal**:

```bash
cd ~/task-app

# Inicie servidor HTTP
python3 -m http.server 8000
```

Você deve ver:
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

✅ **Frontend está rodando!**

---

## 🧪 Teste Completo

### 1. **Teste a API**

```bash
# Em outro terminal
curl http://localhost:5000/api
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Task Manager API is running",
  "version": "2.0.0"
}
```

---

### 2. **Acesse o Frontend**

Abra no navegador: **http://localhost:8000/login.html**

---

### 3. **Fluxo de Teste Completo**

#### 📝 **Cadastro de Usuário**

1. Clique em "Cadastre-se" ou acesse: `http://localhost:8000/register.html`
2. Preencha o formulário:
   - **Nome**: João Silva
   - **E-mail**: joao@teste.com
   - **Senha**: Teste@123
   - **Confirmar Senha**: Teste@123
3. Clique em "Criar conta"
4. Aguarde o toast de sucesso: ✅ "Cadastro realizado com sucesso!"
5. Você será redirecionado para a página principal

**Validações que devem funcionar:**
- ❌ Nome vazio → "Nome é obrigatório"
- ❌ E-mail inválido → "E-mail inválido"
- ❌ Senha fraca → "Senha deve conter: 1 maiúscula, 1 número, 1 caractere especial"
- ❌ Senhas diferentes → "As senhas não coincidem"

---

#### 🔐 **Login**

1. Acesse: `http://localhost:8000/login.html`
2. Faça login com:
   - **E-mail**: joao@teste.com
   - **Senha**: Teste@123
3. Marque "Lembrar-me" (opcional)
4. Clique em "Entrar"
5. Toast de sucesso: ✅ "Login realizado com sucesso!"
6. Redirecionamento para o app

**Testes de erro:**
- ❌ E-mail errado → "E-mail ou senha incorretos" (Status 401)
- ❌ Senha errada → "E-mail ou senha incorretos" (Status 401)

---

#### ✅ **Gerenciar Tarefas**

**Criar Tarefa:**
1. Digite no campo: "Estudar JavaScript"
2. Pressione Enter ou clique no botão "+"
3. Toast: ✅ "Tarefa adicionada com sucesso!"
4. A tarefa aparece na lista

**Editar Tarefa:**
1. Clique no ícone de lápis ✏️
2. Modifique o texto
3. Pressione Enter ou clique no ✓
4. Toast: ✅ "Tarefa atualizada!"

**Marcar como Concluída:**
1. Clique no checkbox da tarefa
2. A tarefa fica riscada
3. Toast: ✅ "Tarefa concluída!"
4. Estatísticas atualizam automaticamente

**Reabrir Tarefa:**
1. Clique novamente no checkbox
2. Toast: ✅ "Tarefa reaberta!"

**Excluir Tarefa:**
1. Clique no ícone de lixeira 🗑️
2. Confirme a exclusão
3. Toast: ✅ "Tarefa removida!"

**Filtros:**
- Clique em "Todas" → Mostra todas as tarefas
- Clique em "Pendentes" → Apenas não concluídas
- Clique em "Concluídas" → Apenas concluídas

**Limpar Concluídas:**
1. Marque algumas tarefas como concluídas
2. Clique em "Limpar concluídas"
3. Confirme
4. Toast: ✅ "X tarefa(s) removida(s)!"

---

#### 🌙 **Alternar Tema**

1. Clique no ícone de lua 🌙 no header
2. O tema escuro é ativado
3. Clique novamente (agora sol ☀️)
4. Volta ao tema claro

---

#### 👤 **Menu do Usuário**

1. Clique no avatar de usuário no header
2. Veja seu e-mail
3. Clique em "Sair"
4. Você volta para a tela de login
5. Token é removido

---

## 📱 **Teste Responsividade**

### Desktop (1024px+)
- Abra em tela cheia
- Layout amplo com espaçamento

### Tablet (768px-1023px)
- Redimensione a janela
- Cards em 3 colunas

### Mobile (380px-767px)
- Abra DevTools (F12)
- Alterne para iPhone/Galaxy
- Teste todos os botões

### Small Mobile (< 380px)
- Selecione Galaxy Fold ou ajuste manualmente
- Verifique se tudo é clicável
- Fonte menor, mas legível

---

## 🐛 **Debug - Console do Navegador**

Abra o Console (F12) e monitore:

```javascript
// Logs que você deve ver:
App iniciado
Elementos inicializados
Usuário autenticado: joao@teste.com
Tarefas carregadas da API: 0
renderTasks chamada
```

---

## ❌ **Tratamento de Erros**

### Teste Erros Propositais:

1. **API Offline:**
   - Pare a API (Ctrl+C no terminal)
   - Tente criar uma tarefa
   - Toast: ❌ "Erro de conexão com o servidor"

2. **Token Expirado:**
   - Edite localStorage: `localStorage.setItem('authToken', 'invalid')`
   - Recarregue a página
   - Você será deslogado automaticamente

3. **E-mail Duplicado:**
   - Tente cadastrar com joao@teste.com novamente
   - Toast: ❌ "E-mail já cadastrado"

4. **Validação de Formulário:**
   - Teste todos os campos inválidos
   - Veja mensagens de erro em tempo real

---

## 🎯 **Checklist de Teste**

```
Backend:
✅ API iniciou sem erros
✅ Banco de dados conectado
✅ Endpoint /api responde com JSON

Frontend:
✅ Página de login carrega
✅ Página de cadastro carrega
✅ Validação de formulários funciona

Autenticação:
✅ Cadastro cria usuário
✅ Login retorna token
✅ Token é salvo no localStorage
✅ Token é enviado nas requisições
✅ Logout limpa token

Tarefas:
✅ Criar tarefa
✅ Listar tarefas
✅ Editar tarefa
✅ Marcar como concluída
✅ Excluir tarefa
✅ Filtrar tarefas
✅ Estatísticas atualizam

UI/UX:
✅ Toasts aparecem e desaparecem
✅ Animações suaves
✅ Tema escuro/claro funciona
✅ Responsivo em todas as telas
✅ Ícones carregam (Boxicons)

Segurança:
✅ Senha é hasheada (bcrypt)
✅ JWT é assinado
✅ Rotas protegidas requerem token
✅ CORS configurado corretamente
```

---

## 🔥 **Dicas Avançadas**

### Inspecionar Requisições HTTP

1. Abra DevTools (F12)
2. Vá para a aba "Network"
3. Filtre por "Fetch/XHR"
4. Crie uma tarefa
5. Veja a requisição POST para `/api/tasks`
6. Verifique o header Authorization: `Bearer eyJ...`

### Verificar LocalStorage

```javascript
// Console do navegador
localStorage.getItem('authToken')
localStorage.getItem('userEmail')
localStorage.getItem('theme')
```

### Limpar Tudo

```javascript
localStorage.clear()
```

---

## 📞 **Resolução de Problemas**

### CORS Error
```bash
# No .env, adicione:
CORS_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
```

### Porta já em uso
```bash
# Use outra porta
python3 -m http.server 8001

# Atualize js/config.js se mudar porta da API
```

### MySQL Connection Error
```bash
# Verifique se MySQL está rodando
sudo systemctl status mysql
# ou
mysql -u root -p
```

### Erro 404 na API
```bash
# Certifique-se que está acessando:
http://localhost:5000/api  # Correto
http://localhost:5000      # Health check
```

---

## 🎉 **Pronto!**

Se todos os testes passaram, seu app está **100% funcional**! 🚀

Agora você pode:
- Fazer o deploy do backend no Vercel
- Hospedar o frontend no Netlify/Vercel
- Adicionar novas features
- Customizar o design

---

**Desenvolvido e testado com sucesso! ✅**
