# 📦 Controle de Lançamentos

Sistema completo para gerenciamento e conferência de códigos, desenvolvido com Node.js, Express, SQLite e HTML/CSS/JavaScript puro.

![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![Node](https://img.shields.io/badge/Node.js-18%2B-green)
![Licença](https://img.shields.io/badge/licença-MIT-orange)

## 📋 Sobre o Projeto

O **Controle de Lançamentos** é uma aplicação web intuitiva para gerenciar códigos, permitindo:
- Adicionar novos códigos
- Conferir itens (mover para lista de conferidos)
- Desfazer conferências
- Pesquisar códigos em tempo real
- Excluir itens individualmente ou limpar todos os conferidos
- Visualizar estatísticas com contadores

## 🚀 Tecnologias Utilizadas

- **Backend:** Node.js, Express
- **Banco de Dados:** SQLite3
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Estilização:** CSS com animações e gradientes
- **Ícones:** Emojis e SVG

## ✨ Funcionalidades

### ✅ Gerenciamento de Códigos
- **Adicionar** novos códigos à lista de pendentes
- **Conferir** itens (movem para lista de conferidos)
- **Desfazer** conferência (retornam para pendentes)
- **Excluir** itens individualmente
- **Limpar** todos os itens conferidos de uma vez

### 🔍 Pesquisa
- Busca em tempo real por qualquer código
- Resultados mostram status (pendente/conferido) e data
- Interface destacada para resultados

### 📊 Estatísticas
- Contador de itens pendentes
- Contador de itens conferidos
- Cards interativos com animações

### 🎨 Design Moderno
- Gradientes animados no fundo
- Efeitos de hover em todos os elementos
- Notificações estilo toast com animações
- Modais de confirmação elegantes
- Scrollbar personalizada
- Design responsivo para mobile

## 🛠️ Como Instalar e Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- NPM (Node Package Manager)

### Passo a passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/controle-lancamentos.git
cd controle-lancamentos
