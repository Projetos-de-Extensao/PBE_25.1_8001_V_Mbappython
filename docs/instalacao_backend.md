---
id: instalacao_backend
title: Instalação do Backend
---

# Instalação do Backend - Ilha Delivery

Este documento fornece instruções detalhadas para instalar e configurar o ambiente de desenvolvimento do backend do Ilha Delivery.

## Pré-requisitos

Antes de iniciar a instalação, certifique-se de que você tem os seguintes requisitos:

- Python 3.9 ou superior
- Pip (gerenciador de pacotes do Python)
- Git
- Um editor de código (recomendamos VS Code)

## Passo a Passo para Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/Projetos-de-Extensao/PBE_25.1_8001_V_Mbappython.git
cd PBE_25.1_8001_V_Mbappython
```

### 2. Configurar Ambiente Virtual

O ambiente virtual isola as dependências do projeto, evitando conflitos com outros projetos Python.

```bash
cd ilhaDeliveryApp/backend
python -m venv venv
```

#### Ativação do Ambiente Virtual

**No Windows:**
```bash
venv\Scripts\activate
```

**No Linux/macOS:**
```bash
source venv/bin/activate
```

### 3. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 4. Configurar o Banco de Dados

O projeto utiliza SQLite por padrão, que não requer instalação adicional. Para configurar o banco de dados:

```bash
python manage.py migrate
```

### 5. Criar Superusuário (opcional)

Para acessar o painel administrativo do Django:

```bash
python manage.py createsuperuser
```

Siga as instruções do terminal para criar um superusuário.

### 6. Executar o Servidor de Desenvolvimento

```bash
python manage.py runserver
```

O servidor estará disponível em `http://127.0.0.1:8000/`.

## Verificando a Instalação

Para garantir que o backend foi instalado corretamente:

1. Acesse `http://127.0.0.1:8000/admin/` para verificar se o painel de administração do Django está funcionando (use as credenciais do superusuário criado).

2. Acesse `http://127.0.0.1:8000/swagger/` para verificar se a documentação da API está disponível.

## Estrutura do Projeto

```
ilhaDeliveryApp/backend/
├── api/                # Aplicativo para a API REST
│   ├── viewss/         # Views organizadas por funcionalidade
│   ├── serializers.py  # Serializers para modelos
│   └── urls.py         # Configuração de URLs da API
├── backend/            # Configurações do projeto Django
│   ├── settings.py     # Configurações gerais
│   └── urls.py         # URLs do projeto
└── base/               # Aplicativo para modelos e lógica de negócios
    └── models.py       # Modelos de dados
```

## Resolução de Problemas

### Problema 1: Erro ao executar migrações

Se encontrar erros durante as migrações, tente:

```bash
python manage.py migrate --run-syncdb
```

### Problema 2: Dependências não encontradas

Se ocorrerem erros de dependências:

```bash
pip install --upgrade -r requirements.txt
```

## Próximos Passos

Após a instalação do backend, você pode:

1. [Configurar o frontend](instalacao_frontend.md)
2. [Entender a estrutura da API](../api.md)
3. [Explorar o tutorial completo](../tutorial.md)
