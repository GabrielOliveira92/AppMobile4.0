# Projeto Midas - Sistema de Gestão Financeira

Sistema SaaS completo de gestão financeira desenvolvido em React + TypeScript + Tailwind CSS.

## 🎨 Identidade Visual

- **Cor Principal:** #4B0012 (Vinho escuro)
- **Cor de Destaque:** #FFC107 (Amarelo)
- **Background:** #FFFFFF (Branco)
- **Texto:** #000000 (Preto)

## 🚀 Tecnologias

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **React Router** - Navegação
- **Recharts** - Gráficos
- **Lucide React** - Ícones
- **Sonner** - Notificações toast
- **Radix UI** - Componentes acessíveis

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── ui/              # Componentes UI reutilizáveis
│   │   ├── Layout.tsx       # Layout principal com Sidebar e Topbar
│   │   ├── Sidebar.tsx      # Menu lateral fixo
│   │   ├── Topbar.tsx       # Barra superior com usuário
│   │   └── LoadingSpinner.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LancamentosPage.tsx
│   │   ├── NovoLancamentoPage.tsx
│   │   ├── ProjecoesPage.tsx
│   │   ├── EmprestimosPage.tsx
│   │   ├── RecorrenciasPage.tsx
│   │   └── EmpresaPage.tsx
│   └── App.tsx
├── context/
│   └── AuthContext.tsx      # Gerenciamento de autenticação
├── services/
│   ├── api.ts               # Configuração base da API
│   ├── usuarioService.ts
│   ├── empresaService.ts
│   ├── lancamentoService.ts
│   ├── emprestimoService.ts
│   ├── projecaoService.ts
│   ├── recorrenciaService.ts
│   └── responsavelService.ts
└── types/
    └── index.ts             # Tipos e interfaces TypeScript
```

## 🔌 API REST - Projeto Midas

**Base URL:** `https://localhost:5001/`

### Autenticação

Todas as rotas (exceto `/Usuario/Autenticar` e `/Usuario/Registrar`) requerem autenticação via JWT:

```
Authorization: Bearer {token}
```

O token é armazenado automaticamente no `localStorage` após o login.

### Endpoints Principais

#### Usuário
- `POST /Usuario/Autenticar` - Login
- `POST /Usuario/Registrar` - Registro
- `PUT /Usuario/AlterarSenha` - Alterar senha
- `GET /Usuario/GetAll` - Listar todos
- `GET /Usuario/Get/{id}` - Buscar por ID
- `POST /Usuario/New` - Criar novo
- `DELETE /Usuario/{id}` - Excluir

#### Lançamentos
- `GET /Lancamentos/GetAll` - Listar todos
- `GET /Lancamentos/{id}` - Buscar por ID
- `POST /Lancamentos/New` - Criar novo
- `PUT /Lancamentos/{id}` - Atualizar
- `DELETE /Lancamentos/{id}` - Excluir
- `GET /Lancamentos/ano/{ano}` - Filtrar por ano
- `GET /Lancamentos/mes/{ano}/{mes}` - Filtrar por mês
- `GET /Lancamentos/dia/{ano}/{mes}/{dia}` - Filtrar por dia
- `GET /Lancamentos/somatoria` - Totalizadores

#### Empresa
- `GET /Empresa/GetAll` - Listar todas
- `GET /Empresa/{id}` - Buscar por ID
- `POST /Empresa/New` - Criar nova
- `PUT /Empresa/{id}` - Atualizar
- `DELETE /Empresa/{id}` - Excluir

#### Empréstimos
- `GET /Emprestimos/GetAll` - Listar todos
- `GET /Emprestimos/{id}` - Buscar por ID
- `POST /Emprestimos/New` - Criar novo
- `PUT /Emprestimos/{id}` - Atualizar
- `DELETE /Emprestimos/{id}` - Excluir

#### Projeções
- `GET /Projecoes/GetAll` - Listar todas
- `GET /Projecoes/{id}` - Buscar por ID
- `POST /Projecoes/New` - Criar nova
- `PUT /Projecoes/{id}` - Atualizar
- `DELETE /Projecoes/{id}` - Excluir

#### Recorrências
- `GET /Recorrencia/GetAll` - Listar todas
- `GET /Recorrencia/{id}` - Buscar por ID
- `POST /Recorrencia/New` - Criar nova
- `PUT /Recorrencia/{id}` - Atualizar
- `DELETE /Recorrencia/{id}` - Excluir

#### Responsável
- `GET /Responsavel/GetAll` - Listar todos
- `GET /Responsavel/{id}` - Buscar por ID
- `POST /Responsavel/New` - Criar novo
- `DELETE /Responsavel/{id}` - Excluir

## 📄 Páginas

### `/login`
- Autenticação de usuários
- Armazena JWT no localStorage
- Redirecionamento automático para dashboard

### `/dashboard`
- Cards com totalizadores (Receitas, Despesas, Saldo)
- Gráfico de barras Receitas x Despesas
- Lista dos últimos lançamentos

### `/lancamentos`
- Tabela completa de lançamentos
- Filtros por ano e mês
- Botão para criar novo lançamento
- Exclusão com confirmação

### `/lancamentos/novo`
- Formulário para criar lançamento
- Campos: Tipo, Descrição, Valor, Data, Observação
- Validação de formulário

### `/projecoes`
- Listagem de projeções futuras
- Visualização de valores previstos

### `/emprestimos`
- Gestão de empréstimos
- Detalhes de parcelas e IOF

### `/recorrencias`
- Lançamentos recorrentes
- Configuração de periodicidade

### `/empresa`
- Edição dos dados da empresa
- Informações cadastrais (CNPJ, Razão Social, etc)

## 🔐 Autenticação

O sistema utiliza `AuthContext` para gerenciar o estado de autenticação:

```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

- **login()**: Autentica o usuário e armazena o token
- **logout()**: Remove o token e redireciona para login
- **user**: Dados do usuário logado
- **isAuthenticated**: Status de autenticação

## 🎯 Funcionalidades

✅ **Autenticação JWT**
- Login/Logout
- Proteção de rotas
- Token persistente

✅ **Dashboard**
- Cards de totalizadores
- Gráficos dinâmicos
- Últimas movimentações

✅ **Lançamentos Financeiros**
- Criar receitas e despesas
- Filtros por período
- Exclusão com confirmação

✅ **Gestão de Empresa**
- Edição de dados cadastrais
- Informações do responsável

✅ **UX/UI**
- Loading spinners
- Notificações toast
- Confirmação de exclusão
- Design responsivo
- Sidebar fixa
- Cores corporativas

## 🎨 Componentes UI

Biblioteca de componentes baseada em **Radix UI** e **Tailwind CSS**:

- Button (com variante amarela para ações principais)
- Card
- Input
- Label
- Select
- Table
- Badge
- Dialog
- Alert Dialog
- Textarea
- Toast (Sonner)

## 🔧 Configuração da API

Para conectar com sua API Midas, edite o arquivo `/src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://localhost:5001';
```

Substitua pela URL da sua API em produção.

## 📦 Como Usar

Este projeto está pronto para ser executado no ambiente Figma Make. A aplicação consumirá automaticamente a API Midas configurada.

### Credenciais de Teste

Use as credenciais fornecidas pela sua API Midas para fazer login.

## 🎨 Personalização de Cores

As cores do Projeto Midas estão definidas em `/src/styles/theme.css`:

```css
--midas-wine: #4B0012;
--midas-yellow: #FFC107;
--midas-yellow-dark: #FFB300;
```

## 🐛 Tratamento de Erros

- Erros de API são capturados e exibidos via toast
- Loading states em todas as requisições
- Validação de formulários
- Proteção de rotas autenticadas

## 📱 Responsividade

Layout otimizado para:
- Desktop (design principal)
- Tablets
- Mobile (sidebar responsiva)

## 🌐 Integração com Google APIs

O Midas suporta integração com múltiplas APIs do Google para ampliar suas capacidades:

### APIs Disponíveis

| API | Funcionalidade | Status |
|-----|---|---|
| 📊 **Google Sheets** | Importar/exportar dados | ✅ Pronta |
| 🗺️ **Google Maps** | Geocodificação e análises | ✅ Pronta |
| 📁 **Google Drive** | Armazenamento em nuvem | ✅ Pronta |
| 📅 **Google Calendar** | Agendamento automático | ✅ Pronta |
| 🤖 **Generative Language** | IA para análises (Gemini) | ✅ Ativa |

### Como Ativar

1. **Leia** o guia completo: [`GOOGLE_APIS_SETUP.md`](./GOOGLE_APIS_SETUP.md) (9 passos guiados)
2. **Configure** as variáveis de ambiente: [`GOOGLE_APIS_SETUP.md#passo-4`](./GOOGLE_APIS_SETUP.md)
3. **Veja exemplos** de código: [`GOOGLE_APIS_EXAMPLES.md`](./GOOGLE_APIS_EXAMPLES.md) (20+ exemplos)
4. **Implemente** funcionalidades no seu projeto

### Casos de Uso

**📥 Importar dados em massa**
```typescript
const result = await api.importFromSheets('spreadsheetId');
// Importa 1000+ lançamentos em segundos
```

**🗺️ Mapear transações por localidade**
```typescript
const data = await api.analyzeTransactionsByLocation(lancamentos);
// Geocodifica endereços e agrupa por região
```

**📊 Gerar relatórios automáticos**
```typescript
await api.generateAutomaticReport('Relatório Mensal', dados);
// Cria planilha no Google Sheets com dados formatados
```

**☁️ Sincronizar com Google Drive**
```typescript
const folder = await api.createDriveFolder('Backups - 2026');
// Armazena backups em nuvem
```

### Documentação

- 📄 **[GOOGLE_APIS_SETUP.md](./GOOGLE_APIS_SETUP.md)** - Guia passo a passo (15 páginas)
- 📄 **[GOOGLE_APIS_EXAMPLES.md](./GOOGLE_APIS_EXAMPLES.md)** - 20+ exemplos de código
- 📄 **[GOOGLE_APIS_SUMMARY.md](./GOOGLE_APIS_SUMMARY.md)** - Sumário executivo
- 📄 **[src/services/googleApisService.ts](./src/services/googleApisService.ts)** - Implementação
- 📄 **[src/routes/googleApisRoutes.ts](./src/routes/googleApisRoutes.ts)** - Endpoints

### Endpoints Disponíveis

#### Google Sheets
- `POST /api/google/sheets/import` - Importar dados
- `POST /api/google/sheets/export` - Exportar dados
- `POST /api/google/sheets/create` - Criar nova planilha

#### Google Maps
- `POST /api/google/maps/geocode` - Geocodificar endereço
- `POST /api/google/maps/reverse-geocode` - Reverter geocodificação
- `POST /api/google/maps/distance` - Calcular distância
- `POST /api/google/maps/nearby-places` - Buscar lugares próximos

#### Google Drive
- `GET /api/google/drive/files` - Listar arquivos
- `POST /api/google/drive/create-folder` - Criar pasta

#### Google Calendar
- `POST /api/google/calendar/create-event` - Criar evento

#### Análises Combinadas
- `POST /api/google/analyze/transactions-by-location` - Analisar por localização
- `POST /api/google/analyze/generate-report` - Gerar relatório automático

#### Verificação
- `GET /api/google/health` - Status das APIs

Veja todos os exemplos em [GOOGLE_APIS_EXAMPLES.md](./GOOGLE_APIS_EXAMPLES.md)

## 🚀 Próximas Melhorias Sugeridas

- Implementar formulários para Projeções, Empréstimos e Recorrências
- Adicionar exportação de relatórios (PDF/Excel)
- Dashboard com mais gráficos e KPIs
- Filtros avançados de busca
- Modo escuro
- Notificações de lançamentos recorrentes
- ✨ **Novo**: Integração com Google Sheets para importação de dados
- ✨ **Novo**: Dashboard com mapa de transações por localidade
- ✨ **Novo**: Relatórios automáticos em Google Sheets

---

**Desenvolvido com React + TypeScript + Tailwind CSS**
