# Angels of Death Shop 💀

Um sistema completo de gerenciamento de inventário e distribuição desenvolvido em React com TypeScript, projetado para organizações que precisam controlar o fluxo de produtos entre membros internos e externos.

## 🚀 Características Principais

### 👥 Sistema de Usuários
- **Autenticação segura** com State ID e senha
- **Dois tipos de usuários**: Internos e Externos
- **Níveis de acesso**: Administrador e Usuário comum
- **Primeiro login obrigatório** para alteração de senha
- **Reset de senha** pelos administradores

### 📦 Gerenciamento de Produtos
- **Catálogo completo** com imagens, descrições e preços
- **Upload de imagens** para produtos
- **Controle de estoque** e valores
- **Interface intuitiva** para navegação

### 🔄 Sistema de Filas
- **Solicitação de produtos** pelos usuários
- **Controle de status**: Pendente → Preparando → Pronto → Concluído
- **Diferenciação** entre pedidos internos e externos
- **Confirmação de recebimento** pelos usuários

### 📊 Dashboard e Relatórios
- **Dashboard personalizado** para admins e usuários
- **Histórico completo** de transações
- **Filtros avançados** por tipo, data e usuário
- **Estatísticas em tempo real**

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Lucide React** para ícones
- **React Dropzone** para upload de arquivos

### Backend & Database
- **Supabase** como backend-as-a-service
- **PostgreSQL** como banco de dados
- **Row Level Security (RLS)** para segurança
- **Real-time subscriptions** para atualizações em tempo real

### Ferramentas de Desenvolvimento
- **Vite** como bundler
- **ESLint** para linting
- **TypeScript** para tipagem estática
- **PostCSS** e **Autoprefixer**

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (para produção)

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/angels-of-death-shop.git
cd angels-of-death-shop
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configuração do Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Execute o projeto
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### `users`
- Gerenciamento de usuários do sistema
- Campos: id, name, state_id, password, type, role, first_login

#### `drugs`
- Catálogo de produtos disponíveis
- Campos: id, name, description, value, image_url

#### `queue`
- Fila de pedidos em andamento
- Campos: id, drug_id, quantity, user_id, status, queue_type

#### `transactions`
- Histórico de transações concluídas
- Campos: id, drug_id, quantity, value, user_id, queue_type, confirmed_at

### Tipos Enum
- `user_type`: 'internal' | 'external'
- `user_role`: 'admin' | 'user'
- `transaction_status`: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'

## 👤 Perfis de Usuário

### 🔧 Administrador
- Acesso completo ao sistema
- Gerenciamento de usuários e produtos
- Controle da fila de pedidos
- Visualização de todas as transações
- Reset de senhas de usuários

### 👨‍💼 Usuário Comum
- Navegação no catálogo de produtos
- Solicitação de produtos
- Acompanhamento de pedidos pessoais
- Visualização do histórico próprio
- Confirmação de recebimentos

## 🎨 Interface do Usuário

### Design System
- **Tema escuro** com tons de cinza
- **Cores de destaque** em roxo/púrpura
- **Badges coloridos** para status e tipos
- **Layout responsivo** para mobile e desktop
- **Micro-interações** e animações suaves

### Componentes Reutilizáveis
- Cards, Buttons, Inputs, Tables
- Badges, Modals, Dropdowns
- Upload de imagens com drag & drop
- Tabelas com paginação

## 🔐 Segurança

- **Row Level Security (RLS)** no Supabase
- **Autenticação baseada em sessão**
- **Controle de acesso por roles**
- **Validação de dados** no frontend e backend
- **Sanitização de inputs**

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- 📱 Dispositivos móveis (320px+)
- 📟 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1440px+)

## 🚀 Deploy

### Netlify (Recomendado)
```bash
npm run build
# Deploy da pasta dist/ para o Netlify
```

### Outras Plataformas
O projeto pode ser deployado em qualquer plataforma que suporte aplicações React:
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção
npm run lint         # Executa o linter
```

## 🐛 Solução de Problemas

### Problemas Comuns

**Erro de conexão com Supabase**
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo

**Problemas de autenticação**
- Limpe o localStorage do navegador
- Verifique se as políticas RLS estão configuradas

**Erro de build**
- Execute `npm install` novamente
- Verifique se todas as dependências estão atualizadas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ para a comunidade Angels of Death

---

**⚠️ Aviso**: Este é um sistema de demonstração. Para uso em produção, implemente medidas adicionais de segurança e backup de dados.