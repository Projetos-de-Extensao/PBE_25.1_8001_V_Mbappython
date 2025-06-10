---
id: contribuir
title: Guia de Contribuição
---

# Guia de Contribuição

Este documento descreve como contribuir com o projeto Ilha Delivery. Seja adicionando novas funcionalidades, corrigindo bugs ou melhorando a documentação, toda ajuda é bem-vinda!

## Primeiros Passos

### Configurando o Ambiente

Antes de começar, você precisa configurar seu ambiente de desenvolvimento:

1. [Instale o Backend](instalacao_backend.md)
2. [Instale o Frontend](instalacao_frontend.md)
3. Verifique se tudo está funcionando corretamente

### Entendendo o Código

Familiarize-se com a [arquitetura do sistema](arquitetura.md) e a documentação existente antes de fazer alterações. O código segue padrões específicos que devem ser mantidos para garantir consistência.

## Fluxo de Trabalho

### 1. Escolher uma Tarefa

- Verifique as issues abertas no GitHub
- Atribua a issue a você mesmo
- Comente na issue se tiver dúvidas ou precisar de esclarecimentos

### 2. Criar uma Branch

Crie uma branch a partir da branch `develop` para trabalhar na sua contribuição:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-funcionalidade
```

Use o prefixo adequado para sua branch:
- `feature/` para novas funcionalidades
- `bugfix/` para correções de bugs
- `docs/` para atualizações na documentação
- `test/` para adicionar ou modificar testes

### 3. Desenvolver sua Contribuição

Durante o desenvolvimento:
- Siga os padrões de código existentes
- Escreva testes para novas funcionalidades
- Mantenha o código limpo e bem documentado
- Faça commits pequenos e frequentes com mensagens claras

#### Padrões de Código

**Python (Backend)**
- Siga o PEP 8
- Use docstrings para documentar funções e classes
- Mantenha funções e métodos curtos e focados

**JavaScript/React Native (Frontend)**
- Use ESLint com as configurações do projeto
- Prefira componentes funcionais e hooks
- Siga as práticas de acessibilidade

### 4. Testar suas Alterações

Antes de enviar sua contribuição:
- Execute os testes existentes
- Adicione novos testes para cobrir suas alterações
- Verifique se todas as funcionalidades continuam funcionando
- Teste em diferentes ambientes, se aplicável

#### Executando Testes

**Backend:**
```bash
cd ilhaDeliveryApp/backend
python manage.py test
```

**Frontend:**
```bash
cd ilhaDeliveryApp/frontend
npm test
```

### 5. Enviar um Pull Request

Quando sua contribuição estiver pronta:

1. Atualize sua branch com as mudanças mais recentes de `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/nome-da-funcionalidade
   git merge develop
   ```

2. Resolva quaisquer conflitos que possam surgir.

3. Envie sua branch para o GitHub:
   ```bash
   git push origin feature/nome-da-funcionalidade
   ```

4. Abra um Pull Request (PR) para a branch `develop`:
   - Descreva claramente o que sua contribuição faz
   - Mencione a issue relacionada usando `#numero-da-issue`
   - Preencha o template de PR, se existir

### 6. Revisão de Código

Após enviar seu PR:
- Aguarde a revisão de outro membro da equipe
- Esteja preparado para fazer alterações com base no feedback
- Responda a comentários e perguntas de forma clara e respeitosa

## Diretrizes de Contribuição

### Commits

- Escreva mensagens de commit em inglês
- Use verbos no infinitivo (ex: "Add", "Fix", "Update")
- Seja claro e conciso
- Referencie a issue quando aplicável

**Exemplos:**
```
Add login functionality for operators
Fix crash when uploading payment receipt
Update API documentation for order endpoints
```

### Documentação

Ao modificar o código:
- Atualize a documentação relacionada
- Adicione comentários em partes complexas
- Atualize o README se necessário
- Considere adicionar exemplos de uso

Para contribuir apenas com documentação, use a branch com prefixo `docs/`.

### Testes

Novas funcionalidades devem incluir testes que:
- Verifiquem se a funcionalidade está correta
- Cubram casos de borda
- Sigam o mesmo padrão dos testes existentes

### Pull Requests

Um bom PR deve:
- Ter um título descritivo
- Explicar claramente o que foi alterado e por quê
- Incluir capturas de tela para mudanças visuais
- Mencionar quaisquer breaking changes
- Ter uma cobertura de testes adequada

## FAQ para Contribuidores

### Como começar se sou novo no projeto?
Comece com issues marcadas como "good first issue" ou "beginner friendly". Estas são geralmente mais simples e adequadas para novos contribuidores.

### O que fazer se encontrar um bug?
1. Verifique se já existe uma issue reportando o bug
2. Se não existir, crie uma nova issue com:
   - Descrição detalhada do problema
   - Passos para reproduzir
   - Comportamento esperado vs. atual
   - Capturas de tela ou logs, se aplicável

### Como sugerir uma nova funcionalidade?
Crie uma issue marcada como "enhancement", descrevendo:
- O problema que a funcionalidade resolveria
- Como você imagina que ela funcionaria
- Por que essa funcionalidade seria útil para o projeto

## Código de Conduta

Este projeto segue um código de conduta para garantir um ambiente respeitoso e acolhedor para todos. Esperamos que todos os contribuidores:

- Usem linguagem acolhedora e inclusiva
- Respeitem diferentes pontos de vista e experiências
- Aceitem críticas construtivas de forma graciosa
- Foquem no que é melhor para a comunidade
- Demonstrem empatia com outros membros da comunidade

## Agradecimento

Agradecemos muito sua contribuição para o projeto Ilha Delivery!

Seu tempo e esforço ajudam a melhorar o sistema e torná-lo mais útil para todos os usuários. Cada contribuição, seja grande ou pequena, é valiosa para nós.
