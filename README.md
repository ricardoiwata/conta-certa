# 💰 Conta Certa

> **O seu assistente financeiro inteligente e descomplicado.**

O **Conta Certa** é uma aplicação completa para gestão financeira pessoal, desenvolvida com as tecnologias mais modernas do mercado. Com ele, você controla suas receitas, despesas, visualiza gráficos intuitivos e conta com a ajuda de uma Inteligência Artificial para tirar dúvidas e receber dicas financeiras.

---

## 🚀 Funcionalidades

- **📊 Dashboard Interativo:** Visão geral do seu saldo, receitas e despesas com gráficos claros.
- **💸 Gestão de Transações:** Adicione receitas e despesas (únicas ou recorrentes) de forma rápida.
- **🤖 Chatbot com IA:** Tire dúvidas sobre finanças e receba dicas personalizadas powered by **Google Gemini**.
- **📂 Categorização:** Organize seus gastos por categorias personalizáveis.
- **🔔 Notificações:** Receba alertas sobre contas a pagar e dicas.
- **📄 Relatórios:** Gere relatórios detalhados (PDF) para análise profunda.
- **🔐 Autenticação Segura:** Login e cadastro integrados com Firebase.
- **📱 Design Moderno:** Interface limpa e responsiva, construída com React Native Paper.

---

## 🛠️ Tech Stack

O projeto é estruturado como um monorepo contendo Backend e Frontend:

### **Backend** (API)
- **Framework:** [NestJS](https://nestjs.com/) 🦁
- **Linguagem:** TypeScript
- **Banco de Dados:** SQLite / MySQL (via TypeORM)
- **Autenticação:** Firebase Admin SDK
- **Testes:** Jest

### **Frontend** (Mobile)
- **Framework:** [Expo](https://expo.dev/) (React Native) 📱
- **Roteamento:** Expo Router
- **UI Kit:** React Native Paper
- **Gráficos:** React Native Chart Kit
- **IA:** Google Generative AI SDK
- **Testes:** Jest & Testing Library

---

## 📦 Instalação e Execução

Siga os passos abaixo para rodar o projeto localmente.

### Pré-requisitos
- Node.js (v18+)
- npm ou yarn
- Conta no Firebase (para configuração de credenciais)

### 1. Clone o repositório
```bash
git clone https://github.com/ricardoiwata/conta-certa.git
cd conta-certa
```

### 2. Configurando o Backend

```bash
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente e credenciais do Firebase
# (Crie um arquivo firebase-credentials.json na raiz do backend se necessário)

# Execute o servidor em modo de desenvolvimento
npm run start:dev
```
_O backend rodará por padrão em `http://localhost:3000`_

### 3. Configurando o Frontend

Abra um novo terminal na raiz do projeto:

```bash
cd frontend

# Instale as dependências
npm install

# Configure o arquivo .env
cp .env.example .env
# Preencha o .env com suas chaves do Firebase e Gemini API

# Execute o app
npm start
```
_Use o aplicativo **Expo Go** no seu celular ou um emulador Android/iOS para visualizar._

---

## 🧪 Rodando os Testes

Garanta a qualidade do código executando os testes unitários e e2e.

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

---

## 📂 Estrutura do Projeto

```
conta-certa/
├── backend/          # API NestJS
│   ├── src/
│   │   ├── modules/  # Módulos da aplicação (Despesa, Receita, Usuário...)
│   │   └── ...
│   └── test/         # Testes e2e
├── frontend/         # App Expo
│   ├── app/          # Rotas (Expo Router)
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   └── services/
│   └── ...
└── README.md
```
