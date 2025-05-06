---
id: brainstorm
title: Brainstorm
---
 
## Introdução
<p align = "justify">
O brainstorm é uma técnica de elicitação de requisitos que consiste em reunir a equipe e discutir sobre diversos tópicos gerais do projeto apresentados no documento problema de negócio. No brainstorm o diálogo é incentivado e críticas são evitadas para permitir que todos colaborem com suas próprias ideias.
</p>
 
## Metodologia
<p align = "justify">
A equipe se reuniu para debater ideias gerais sobre o projeto via..., começou .... e terminou..., onde o XXXX XXXX foi o moderador, direcionando a equipe com questões pré-elaboradas, e transcrevendo as respostas para o documento.
</p>
 
## Brainstorm

![Mapa Mental](https://github.com/Projetos-de-Extensao/PBE_25.1_8001_V/blob/main/docs/assets/Mapas%20Mentais/mapaMental2.png)

 
## **Versão 1.0**

## **Perguntas**

---

### **1. Qual o objetivo principal da aplicação?**

- **JetEntregas** – Facilitar a entrega de pedidos online para moradores da Ilha Primeira.
- **Automatizar a entrega** – Notificar automaticamente o cliente assim que o pedido chegar ao locker.
- **Resolver o gargalo logístico** – Intermediar a entrega entre terra firme e ilha com agilidade.
- **Atender regiões de difícil acesso** – Criar uma solução de última milha eficiente para locais isolados.
- **Centralizar informações de entrega** – O app concentra status, histórico e notificações.

---

### **2. Como será o processo para cadastrar um novo cliente?**

- O cliente se cadastra no app **JetEntregas**, informando endereço completo (incluindo ilha).
- O app usa o endereço e CPF como identificador para **vincular pedidos futuros** feitos em plataformas como iFood/Amazon.
- Não há necessidade de o cliente informar o pedido manualmente.
- O vínculo inicial é feito **comparando o endereço e CPF**; futuramente será por **integração via API**.

---

### **3. Como será a forma de adicionar pedidos?**

- O cliente **não adiciona manualmente** o pedido.
- O sistema detecta automaticamente quando um pedido de e-commerce é entregue no **locker da JetEntregas**.
- O pedido é então **vinculado automaticamente** ao perfil do cliente com base no endereço de entrega e CPF.
- Após isso, o cliente é **notificado pelo app** que o pedido chegou e está a caminho da ilha.

---

### **4. Outras perguntas pertinentes ao contexto**

- O entregador da JetEntregas tem acesso aos lockers com chave/código.
- O sistema notifica o entregador sobre novos pedidos a serem retirados.
- Toda a operação de retirada e entrega é feita por **um funcionário fixo** da JetEntregas, com carteira de jetski.
- O locker é o ponto de transição entre o **e-commerce tradicional e a entrega Jet**.
- Não há necessidade de o cliente interagir com entregadores do iFood/Amazon.

---

### **5. Como seria a forma do cliente adicionar os pedidos?**

- O cliente **não precisa adicionar manualmente**.
- O sistema faz o match automático com o endereço.
- No futuro, o sistema poderá integrar com as APIs de marketplaces para **vinculação instantânea e automática**.

---

### **6. Quais informações seriam interessantes para o cliente?**

- Status do pedido (Ex: “Pedido chegou ao locker”, “Pedido a caminho da ilha”, “Pedido entregue”).
- Notificações push com cada etapa da entrega.
- Histórico de pedidos entregues.
- Dados do entregador (nome, horário estimado de entrega, etc).
- Localização aproximada do entregador quando estiver em rota.


### Requisitos elicitados
 
|ID|Descrição|
|----|-------------|
|BS01| O cliente...|
|BS02| O cliente...|
|BS03| O cliente...|
|BS04| O cliente...|
|BS05| O cliente...|
|BS06| O cliente...|
|BS07| O cliente...|
|BS08| O cliente...|
|BS09| O cliente...|
|BS10| O produto...|
|BS11| O produto...|
|BS12| O produto...|
|BS13| O produto...|
|BS14| O produto...|
|BS15| O produto...|
 
## Conclusão
<p align = "justify">
Através da aplicação da técnica, foi possível elicitar alguns dos primeiros requisitos do projeto.
</p>
## Referências Bibliográficas
 
> BARBOSA, S. D. J; DA SILVA, B. S. Interação humano-computador. Elsevier, 2010.
 
 
## Autor(es)
| Data | Versão | Descrição | Autor(es) |
| -- | -- | -- | -- |
| DD/MM/YYYY | 1.0 | Criação do documento | XXX XXXX, XXXX XXXX, YYY YYYY e ZZZ XXXX |
