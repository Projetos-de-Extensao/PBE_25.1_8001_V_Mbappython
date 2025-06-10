---
id: arquitetura
title: Arquitetura do Sistema
---

# Arquitetura do Sistema - Ilha Delivery

## Visão Geral

A arquitetura do Ilha Delivery segue o padrão cliente-servidor, com separação clara entre o frontend (aplicativo móvel para clientes) e o backend (servidor para processamento e armazenamento de dados). O sistema é projetado para ser escalável, seguro e oferecer uma experiência fluida tanto para clientes quanto para operadores.

![Diagrama de Arquitetura](/assets/images/arquitetura.png)

## Componentes Principais

### 1. Frontend (Cliente)

O cliente é um aplicativo móvel desenvolvido com React Native e Expo, permitindo:

- **Experiência multiplataforma**: O mesmo código base funciona em iOS e Android
- **Interface responsiva**: Design adaptável para diferentes tamanhos de tela
- **Modo offline limitado**: Armazenamento local de dados críticos para uso offline

#### Tecnologias principais:
- React Native
- Expo
- Axios para comunicação com API
- AsyncStorage para armazenamento local
- Context API para gerenciamento de estado

### 2. Backend (Servidor)

O servidor é desenvolvido com Django e Django REST Framework, fornecendo:

- **API REST**: Interface para comunicação com o frontend
- **Autenticação JWT**: Sistema seguro de autenticação baseado em tokens
- **Processamento de dados**: Lógica de negócios centralizada
- **Persistência**: Armazenamento de dados em banco relacional

#### Tecnologias principais:
- Django
- Django REST Framework
- SQLite (desenvolvimento) / PostgreSQL (produção)
- JSON Web Tokens (JWT)

### 3. Banco de Dados

O sistema utiliza um banco de dados relacional para armazenamento persistente de:

- Dados de usuários (clientes e operadores)
- Pedidos e seus estados
- Histórico de entregas
- Notificações
- Configurações do sistema

## Fluxo de Dados

1. **Cliente → Servidor**:
   - Requisições de autenticação
   - Criação e consulta de pedidos
   - Upload de comprovantes de pagamento

2. **Servidor → Cliente**:
   - Resposta às consultas
   - Envio de notificações push
   - Atualizações de status em tempo real

3. **Servidor → Operador**:
   - Lista de pedidos pendentes
   - Notificações de novos pedidos
   - Dashboard com métricas

4. **Operador → Servidor**:
   - Atualização de status de pedidos
   - Envio de cotações
   - Confirmação de entregas

## Segurança

### Autenticação e Autorização

- **JSON Web Tokens (JWT)**: Para autenticação segura e sem estado
- **Permissões baseadas em papéis**: Diferentes níveis de acesso para clientes e operadores
- **HTTPS**: Comunicação criptografada entre cliente e servidor
- **Validação de entrada**: Sanitização de todos os dados recebidos do cliente

### Proteção de Dados

- **Hashing de senhas**: Senhas armazenadas com algoritmos seguros de hash
- **Sanitização de entrada**: Proteção contra injeção SQL e XSS
- **Rate limiting**: Proteção contra ataques de força bruta

## Decisões Arquiteturais

### Motivos para Django + React Native

1. **Desenvolvimento rápido**: Django fornece muitas funcionalidades out-of-the-box
2. **Segurança**: Django tem boas práticas de segurança integradas
3. **Facilidade de manutenção**: Arquitetura bem estruturada e documentada
4. **Multiplataforma**: React Native permite desenvolvimento simultâneo para iOS e Android

### Compromissos e Trade-offs

1. **Performance vs. Desenvolvimento**: Priorizamos velocidade de desenvolvimento sobre otimização extrema
2. **Curva de aprendizado**: Django e React Native têm curva de aprendizado, mas oferecem produtividade no longo prazo
3. **Dependência do Expo**: Facilita o desenvolvimento, mas pode limitar alguns recursos nativos avançados

## Diagrama de Implantação

```
┌─────────────────────┐      ┌───────────────────┐
│                     │      │                   │
│  Frontend (Mobile)  │◄────►│  Backend (API)    │
│  - React Native     │      │  - Django         │
│  - Expo             │      │  - DRF            │
│                     │      │                   │
└─────────────────────┘      └─────────┬─────────┘
                                       │
                                       ▼
                             ┌───────────────────┐
                             │                   │
                             │  Database         │
                             │  - PostgreSQL     │
                             │                   │
                             └───────────────────┘
```

## Extensões Futuras

A arquitetura foi projetada para permitir as seguintes extensões futuras:

1. **Sistema de pagamentos online**: Integração com gateways de pagamento
2. **Comunicação em tempo real**: Implementação de WebSockets para atualizações instantâneas
3. **Análise de dados**: Módulo para estatísticas e insights sobre as operações
4. **Rastreamento GPS**: Sistema de rastreamento em tempo real das entregas

## Referências

- [Django Documentation](https://docs.djangoproject.com/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [REST API Best Practices](https://restfulapi.net/)
- [JWT Authentication](https://jwt.io/introduction)

## Histórico de Revisões

| Versão | Data | Descrição | Autor |
|--------|------|-----------|-------|
| 1.0 | 10/06/2025 | Versão inicial do documento | Equipe de Desenvolvimento |
