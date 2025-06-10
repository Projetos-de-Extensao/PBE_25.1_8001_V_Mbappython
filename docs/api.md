---
id: api
title: Documentação da API
---

# Documentação da API

Esta página fornece informações sobre a API do Ilha Delivery e como acessar sua documentação interativa.

## Swagger API

A API do Ilha Delivery é documentada usando o Swagger, que fornece uma interface interativa para explorar e testar os endpoints disponíveis.

### Como acessar

A documentação da API está disponível nos seguintes endereços quando o servidor estiver em execução:

- **Swagger UI**: [http://localhost:8000/swagger/](http://localhost:8000/swagger/)
  - Interface interativa e amigável para explorar os endpoints
  - Permite testar as chamadas de API diretamente no navegador

- **ReDoc**: [http://localhost:8000/redoc/](http://localhost:8000/redoc/)
  - Versão alternativa da documentação, mais limpa e focada na leitura

### Recursos disponíveis

A documentação Swagger da API inclui:

- Endpoints para clientes:
  - Cadastro e login de usuários
  - Criação e gerenciamento de pedidos
  - Consulta do status de entregas

- Endpoints para operadores:
  - Visualização de pedidos pendentes
  - Atualização de status de pedidos
  - Envio de cotações
  - Notificações aos clientes

### Autenticação

A maioria dos endpoints requer autenticação JWT (JSON Web Token). O processo de autenticação é o seguinte:

1. Obtenha um token fazendo login através dos endpoints específicos:
   - Clientes: `/api/token/`
   - Operadores: `/api/operador/token/`

2. Use o token retornado nos cabeçalhos das requisições subsequentes como:
   ```
   Authorization: Bearer [seu_token_aqui]
   ```

## Integração com a API

### Exemplo de uso (Python)

```python
import requests
import json

# Configuração base
BASE_URL = "http://localhost:8000/api"

# Login do cliente
def login_cliente(cpf, senha):
    response = requests.post(
        f"{BASE_URL}/token/", 
        data={"cpf": cpf, "password": senha}
    )
    return response.json()

# Criação de pedido (requer autenticação)
def criar_pedido(token, dados_pedido):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{BASE_URL}/pedidos/criar",
        headers=headers,
        json=dados_pedido
    )
    return response.json()

# Exemplo de uso
token_info = login_cliente("12345678900", "senha123")
token = token_info["access"]

novo_pedido = {
    "origem": "Continente",
    "produtos": [
        {"nome": "Produto 1", "quantidade": 2, "descricao": "Descrição do produto"}
    ]
}

resultado = criar_pedido(token, novo_pedido)
print(resultado)
```

### Exemplo de uso (JavaScript)

```javascript
// Configuração base
const BASE_URL = "http://localhost:8000/api";

// Login do cliente
async function loginCliente(cpf, senha) {
  const response = await fetch(`${BASE_URL}/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cpf: cpf,
      password: senha
    })
  });
  
  return await response.json();
}

// Criação de pedido (requer autenticação)
async function criarPedido(token, dadosPedido) {
  const response = await fetch(`${BASE_URL}/pedidos/criar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(dadosPedido)
  });
  
  return await response.json();
}

// Exemplo de uso
async function exemplo() {
  const tokenInfo = await loginCliente("12345678900", "senha123");
  const token = tokenInfo.access;
  
  const novoPedido = {
    origem: "Continente",
    produtos: [
      {nome: "Produto 1", quantidade: 2, descricao: "Descrição do produto"}
    ]
  };
  
  const resultado = await criarPedido(token, novoPedido);
  console.log(resultado);
}
```

## Mais informações

Para informações detalhadas sobre cada endpoint, parâmetros necessários e respostas, consulte a documentação Swagger interativa quando o servidor estiver em execução.
