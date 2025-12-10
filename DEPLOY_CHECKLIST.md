# ✅ Checklist para Deploy no GitHub Pages

## Antes de publicar

### 1. Configure a URL da API (OBRIGATÓRIO)
- [ ] Abra `js/config.js`
- [ ] Na linha 8, altere para a URL da sua API na Vercel:
  ```javascript
  : 'https://sua-api-vercel.vercel.app/api',
  ```

### 2. Configure CORS no Backend (OBRIGATÓRIO)
- [ ] Abra `Task_manager/index.py`
- [ ] Adicione a URL do GitHub Pages no CORS:
  ```python
  CORS(app, 
       resources={r"/*": {"origins": [
           "http://localhost:*",
           "https://SEU-USUARIO.github.io"
       ]}})
  ```
- [ ] Faça commit e push para Vercel

### 3. Teste localmente
- [ ] Inicie a API: `python index.py`
- [ ] Inicie o frontend: `python -m http.server 8000`
- [ ] Teste todas as funcionalidades:
  - [ ] Login
  - [ ] Cadastro
  - [ ] Criar tarefa
  - [ ] Editar tarefa
  - [ ] Deletar tarefa
  - [ ] Atualizar perfil

## Deploy no GitHub

### 4. Crie o repositório
```bash
cd task-app
git init
git add .
git commit -m "Initial commit - Task Manager Frontend"
git branch -M main
```

### 5. Conecte ao GitHub
- [ ] Crie um novo repositório no GitHub (ex: `task-app`)
- [ ] Não inicialize com README (já existe um)
- [ ] Copie a URL do repositório
- [ ] Execute:
  ```bash
  git remote add origin https://github.com/SEU-USUARIO/task-app.git
  git push -u origin main
  ```

### 6. Ative GitHub Pages
- [ ] Acesse: `https://github.com/SEU-USUARIO/task-app/settings/pages`
- [ ] Em **Source**, selecione: `main` branch
- [ ] Clique em **Save**
- [ ] Aguarde 2-3 minutos

### 7. Teste em produção
- [ ] Acesse: `https://SEU-USUARIO.github.io/task-app/login.html`
- [ ] Teste login/cadastro
- [ ] Teste CRUD de tarefas
- [ ] Verifique console do navegador (F12) para erros

## Após o deploy

### 8. Verifique problemas comuns
- [ ] CORS Error? → Verifique configuração no backend
- [ ] 404 na API? → Verifique URL no `config.js`
- [ ] Token não salva? → Limpe localStorage e teste novamente
- [ ] Página em branco? → Verifique console (F12)

## URLs finais

- **Frontend**: `https://SEU-USUARIO.github.io/task-app/login.html`
- **Backend**: `https://sua-api.vercel.app/api`
- **Repositório**: `https://github.com/SEU-USUARIO/task-app`

---

## 🎉 Pronto para produção!

Seu Task Manager está pronto para ser usado por qualquer pessoa!

### Recursos disponíveis:
✅ Autenticação JWT
✅ CRUD completo de tarefas
✅ Perfil editável
✅ Design responsivo
✅ Notificações toast
✅ Validações de formulário

### Próximos passos (opcional):
- [ ] Configure domínio customizado no GitHub Pages
- [ ] Adicione Google Analytics
- [ ] Implemente service worker (PWA)
- [ ] Adicione dark/light theme toggle
