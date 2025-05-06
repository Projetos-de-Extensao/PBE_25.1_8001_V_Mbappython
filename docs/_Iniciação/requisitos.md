## **Requisitos Funcionais (RF)**

Recursos que o sistema **deve obrigatoriamente oferecer** para que o negócio funcione:

### Cliente (usuário final)

- **RF01** – O cliente deve poder se cadastrar e fazer login no app JetEntregas via conta google ou correlatas.
- **RF02** – O cliente deve informar seu **endereço completo**, incluindo o nome da ilha.
- **RF03** – O sistema deve vincular automaticamente pedidos ao cliente com base no **endereço e CPF** cadastrados.
- **RF04** – O cliente deve receber **notificações** quando:
    - O pedido chegar no locker (terra firme)
    - O pedido estiver em rota para entrega na ilha
    - O pedido for entregue
- **RF05** – O cliente deve poder visualizar o **status do pedido em tempo real**.
- **RF06** – O cliente deve poder consultar seu **histórico de entregas** no app.

### Entregador Jet (funcionário fixo)

- **RF07** – O entregador deve visualizar os pedidos disponíveis para retirada nos lockers.
- **RF08** – O entregador deve marcar no sistema quando o pedido for retirado do locker.
- **RF09** – O entregador deve marcar no sistema quando o pedido for entregue.
- **RF10** – O sistema deve registrar o entregador responsável por cada entrega.
- **RF11** – O entregador deve receber notificações sobre novos pedidos disponíveis no locker.

### Sistema/Admin

- **RF12** – O sistema deve cruzar automaticamente dados de endereço para vincular pedidos aos clientes.
- **RF13** – O sistema deve possibilitar, futuramente, a **integração com APIs de marketplaces**, utilizando **CPF e endereço como critérios de correspondência** de pedidos.
- **RF14** – O sistema deve controlar os status dos pedidos: `Aguardando no locker`, `Em rota`, `Entregue`.
- **RF15** – O sistema deve permitir a gestão de entregadores (cadastro, login, entregas realizadas, etc).

---

## **Requisitos Não Funcionais (RNF)**

Características que dizem respeito à **qualidade, performance e regras técnicas** do sistema:

### Técnicos

- **RNF01** – O **backend será desenvolvido em Python com Django REST Framework**.
- **RNF02** – O **frontend será um app mobile em React Native**.
- **RNF03** – O sistema deve estar pronto para **escalabilidade futura com integração via API**.
- **RNF04** – A autenticação dos usuários deve ser segura (JWT ou similar).
- **RNF05** – O sistema deve manter um **registro de logs** de entrega para controle e segurança.

### Usabilidade

- **RNF06** – O app deve ser intuitivo e simples, focado em moradores com pouca familiaridade tecnológica.
- **RNF07** – As notificações devem ser enviadas de forma clara e direta, com linguagem acessível.
- **RNF08** – A interface deve funcionar bem em dispositivos Android (foco inicial).

### Performance

- **RNF09** – O sistema deve processar notificações em **tempo real** ou próximo disso.
- **RNF10** – O app deve funcionar de forma fluida mesmo com conexão de internet instável, mantendo dados locais temporários.

### Segurança

- **RNF11** – O sistema não deve expor dados de clientes ou pedidos para usuários não autorizados.
- **RNF12** – Entregadores só devem ter acesso aos pedidos que estão autorizados a entregar.
- **RNF13** – O sistema deve armazenar **CPFs de forma segura e criptografada**, garantindo conformidade com a LGPD (Lei Geral de Proteção de Dados).
- **RNF14** – O CPF será utilizado apenas internamente para **vinculação de pedidos e identificação do cliente**, sem exposição pública.

---