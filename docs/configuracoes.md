---
id: configuracoes
title: Configurações do Projeto
---

# Configurações do Projeto Ilha Delivery

Este documento descreve as configurações utilizadas no projeto Ilha Delivery, incluindo variáveis de ambiente, configurações específicas para ambientes de desenvolvimento, homologação e produção, além de instruções para personalização.

## Configurações do Backend (Django)

### Variáveis de Ambiente

O backend do Ilha Delivery utiliza variáveis de ambiente para configurar comportamentos específicos. Crie um arquivo `.env` na pasta `ilhaDeliveryApp/backend/` com as seguintes configurações:

```
# Ambiente (development, staging, production)
DJANGO_ENV=development

# Configuração de Segurança
SECRET_KEY=sua_chave_secreta_aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Banco de Dados
DATABASE_URL=sqlite:///db.sqlite3
# Ou para PostgreSQL:
# DATABASE_URL=postgres://usuario:senha@localhost:5432/ilha_delivery

# Configuração de Email
EMAIL_HOST=smtp.exemplo.com
EMAIL_PORT=587
EMAIL_HOST_USER=seu_email@exemplo.com
EMAIL_HOST_PASSWORD=sua_senha
EMAIL_USE_TLS=True

# JWT Settings
ACCESS_TOKEN_LIFETIME=5  # minutos
REFRESH_TOKEN_LIFETIME=1  # dias

# Configurações de Logging
LOG_LEVEL=INFO
```

### Configurações Específicas por Ambiente

#### Desenvolvimento

Para desenvolvimento local, você pode usar as configurações padrão. O arquivo `settings.py` já está configurado para detectar o ambiente e aplicar as configurações adequadas.

#### Homologação/Staging

Para o ambiente de homologação, ajuste seu arquivo `.env`:

```
DJANGO_ENV=staging
DEBUG=False
ALLOWED_HOSTS=staging.ilhadelivery.com,staging-api.ilhadelivery.com
DATABASE_URL=postgres://usuario:senha@localhost:5432/ilha_delivery_staging
```

#### Produção

Para o ambiente de produção, use configurações mais restritivas:

```
DJANGO_ENV=production
DEBUG=False
ALLOWED_HOSTS=ilhadelivery.com,api.ilhadelivery.com
DATABASE_URL=postgres://usuario:senha@localhost:5432/ilha_delivery_prod
LOG_LEVEL=WARNING

# Configurações adicionais de segurança
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
```

### Como Usar Configurações Personalizadas

Para usar configurações personalizadas, você pode:

1. Modificar o arquivo `.env`
2. Definir variáveis de ambiente no sistema
3. Passar variáveis de ambiente ao iniciar o servidor

Exemplo utilizando variáveis de ambiente ao iniciar o servidor:

```bash
SECRET_KEY=chave_personalizada DEBUG=True python manage.py runserver
```

## Configurações do Frontend (React Native)

### Variáveis de Ambiente

O frontend do Ilha Delivery utiliza arquivos de ambiente para diferentes contextos. Crie os seguintes arquivos na pasta `ilhaDeliveryApp/frontend/`:

#### `.env.development`

```
API_URL=http://localhost:8000/api
ENVIRONMENT=development
ENABLE_LOGGING=true
```

#### `.env.staging`

```
API_URL=https://staging-api.ilhadelivery.com/api
ENVIRONMENT=staging
ENABLE_LOGGING=true
```

#### `.env.production`

```
API_URL=https://api.ilhadelivery.com/api
ENVIRONMENT=production
ENABLE_LOGGING=false
```

### Configurando o Expo

As configurações do Expo podem ser ajustadas no arquivo `app.json`:

```json
{
  "expo": {
    "name": "Ilha Delivery",
    "slug": "ilha-delivery",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.ilhadelivery.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.ilhadelivery.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "seu-project-id-aqui"
      }
    }
  }
}
```

### Configurações para Diferentes Ambientes

Para construir o aplicativo para diferentes ambientes:

#### Desenvolvimento

```bash
npx expo start --dev-client
```

#### Staging

```bash
expo build:android --release-channel staging
expo build:ios --release-channel staging
```

#### Produção

```bash
expo build:android --release-channel production
expo build:ios --release-channel production
```

## Configuração do MkDocs (Documentação)

O MkDocs utiliza o arquivo `mkdocs.yml` para configuração. Você pode ajustar as seguintes configurações:

### Tema e Aparência

```yaml
theme:
  name: material
  palette:
    primary: blue
    accent: indigo
  font:
    text: Roboto
    code: Roboto Mono
  logo: assets/images/logo.png
  favicon: assets/images/favicon.ico
  features:
    - navigation.tabs
    - navigation.sections
    - toc.integrate
```

### Plugins Adicionais

```yaml
plugins:
  - search
  - minify:
      minify_html: true
      minify_js: true
      minify_css: true
  - git-revision-date-localized:
      type: date
  - social
```

### Extensões Markdown

```yaml
markdown_extensions:
  - admonition
  - codehilite:
      guess_lang: false
  - toc:
      permalink: true
  - footnotes
  - meta
  - def_list
  - pymdownx.arithmatex
  - pymdownx.betterem:
      smart_enable: all
  - pymdownx.keys
  - pymdownx.details
  - pymdownx.emoji:
      emoji_index: !!python/name:materialx.emoji.twemoji
      emoji_generator: !!python/name:materialx.emoji.to_svg
```

## Configurações de CI/CD

### GitHub Actions

O projeto utiliza GitHub Actions para integração e entrega contínuas. Configure os workflows em `.github/workflows/`:

#### Backend CI

```yaml
name: Backend CI

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'ilhaDeliveryApp/backend/**'
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'ilhaDeliveryApp/backend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: |
          cd ilhaDeliveryApp/backend
          python -m pip install --upgrade pip
          if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
      - name: Run tests
        run: |
          cd ilhaDeliveryApp/backend
          python manage.py test
```

#### Frontend CI

```yaml
name: Frontend CI

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'ilhaDeliveryApp/frontend/**'
  pull_request:
    branches: [ main, develop ]
    paths:
      - 'ilhaDeliveryApp/frontend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18.x'
      - name: Install dependencies
        run: |
          cd ilhaDeliveryApp/frontend
          npm ci
      - name: Run tests
        run: |
          cd ilhaDeliveryApp/frontend
          npm test
```

## Configurações de Segurança

### Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. As configurações podem ser ajustadas no arquivo `settings.py`:

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=int(os.getenv('ACCESS_TOKEN_LIFETIME', 5))),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=int(os.getenv('REFRESH_TOKEN_LIFETIME', 1))),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'cliente_id',
}
```

### CORS (Cross-Origin Resource Sharing)

Configurações CORS para permitir requisições de domínios específicos:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:19006",
    "https://staging.ilhadelivery.com",
    "https://ilhadelivery.com",
]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
```

## Referências

- [Django Settings Documentation](https://docs.djangoproject.com/en/4.2/topics/settings/)
- [React Native Environment Configuration](https://reactnative.dev/docs/environment-setup)
- [Expo Configuration](https://docs.expo.dev/workflow/configuration/)
- [MkDocs Material Theme Configuration](https://squidfunk.github.io/mkdocs-material/getting-started/)
