---
id: instalacao_frontend
title: Instalação do Frontend
---

# Instalação do Frontend - Ilha Delivery

Este documento fornece instruções detalhadas para instalar e configurar o ambiente de desenvolvimento do frontend do Ilha Delivery, desenvolvido com React Native e Expo.

## Pré-requisitos

Antes de iniciar a instalação, certifique-se de que você tem os seguintes requisitos:

- Node.js 18.x ou superior
- npm (gerenciador de pacotes do Node.js) ou Yarn
- Expo CLI
- Git
- Um editor de código (recomendamos VS Code)
- Emulador para Android/iOS ou um dispositivo físico para testes

## Passo a Passo para Instalação

### 1. Clonar o Repositório (caso ainda não tenha feito)

```bash
git clone https://github.com/Projetos-de-Extensao/PBE_25.1_8001_V_Mbappython.git
cd PBE_25.1_8001_V_Mbappython
```

### 2. Instalar o Expo CLI (globalmente, se ainda não tiver)

```bash
npm install -g expo-cli
```

### 3. Instalar Dependências do Projeto

```bash
cd ilhaDeliveryApp/frontend
npm install
```

Alternativamente, se você usar Yarn:

```bash
yarn install
```

### 4. Configurar Variáveis de Ambiente (se necessário)

Crie um arquivo `.env` na raiz do projeto frontend com as configurações necessárias:

```
API_URL=http://192.168.1.100:8000/api  # Substitua pelo IP do seu servidor backend
```

Nota: Use o endereço IP local em vez de localhost quando estiver testando com dispositivos físicos.

### 5. Iniciar o Servidor de Desenvolvimento

```bash
npx expo start
```

Este comando iniciará o Metro Bundler e exibirá um código QR que pode ser escaneado com o aplicativo Expo Go no seu dispositivo móvel.

## Opções de Execução

Após iniciar o servidor de desenvolvimento, você terá várias opções:

- **Executar no Android**: Pressione `a` no terminal ou clique em "Run on Android device/emulator"
- **Executar no iOS**: Pressione `i` no terminal ou clique em "Run on iOS simulator" (somente macOS)
- **Executar na Web**: Pressione `w` no terminal ou clique em "Run in web browser"
- **Dispositivo físico**: Escaneie o código QR com o aplicativo Expo Go (disponível na App Store e Google Play)

## Estrutura do Projeto

```
ilhaDeliveryApp/frontend/
├── assets/             # Imagens, fontes e outros recursos estáticos
├── components/         # Componentes React reutilizáveis
├── context/            # Contextos React (estado global)
├── navigation/         # Configuração de navegação
├── screens/            # Telas do aplicativo
├── services/           # Serviços (API, autenticação, etc.)
├── styles/             # Estilos e temas
├── utils/              # Utilitários e funções auxiliares
├── App.js              # Ponto de entrada do aplicativo
└── app.json            # Configuração do Expo
```

## Construção para Produção

Quando estiver pronto para criar a versão de produção do aplicativo:

### Build para Android (APK/AAB)

```bash
expo build:android
```

### Build para iOS (requer conta Apple Developer)

```bash
expo build:ios
```

## Resolução de Problemas

### Problema 1: Erro de conexão com o Metro Bundler

Se o Metro Bundler não iniciar corretamente:

```bash
# Limpe o cache e reinicie
npx expo start --clear
```

### Problema 2: Não consegue conectar ao backend

Verifique se:
1. O servidor backend está em execução
2. O endereço IP na configuração do frontend está correto
3. Não há firewall bloqueando a conexão

### Problema 3: Erros de dependências

```bash
# Remova node_modules e reinstale
rm -rf node_modules
npm install
```

## Próximos Passos

Após a instalação do frontend, você pode:

1. [Configurar o backend](instalacao_backend.md) (caso ainda não tenha feito)
2. [Explorar o tutorial da aplicação](../tutorial.md)
3. [Entender a API](../api.md)
