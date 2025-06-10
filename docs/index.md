# Ilha Delivery - Sistema de Entregas para a Ilha Primeira

**Número do Grupo**: 5<br>
**Código da Disciplina**: FGA0208-T01<br>
**Semestre**: 2025.1<br>

## Alunos
|Matrícula | Aluno |
| -- | -- |
| 202402851756  |  Arthur Peixoto Schiller |
| 202402697668  |  Guilherme Pardelhas de Araújo  |
| 202401667145  |  João Gabriel Miguel |
| 202301222401  |  Luã Japiassu Macedo Maia |
| 202402630776  |  Lucca Barcelos Cravo |
| 202307539783  |  Maria Claudia Freitas |

## Sobre 
O Ilha Delivery é um sistema completo de entregas desenvolvido para facilitar o transporte de mercadorias entre o continente e a Ilha Primeira. O projeto visa resolver desafios logísticos específicos das comunidades insulares, implementando um sistema com aplicativo móvel para clientes e um painel administrativo para operadores, integrado com um sistema físico de lockers e transporte por jet ski.

A solução permite que moradores e visitantes da ilha solicitem produtos do continente, que são então transportados de forma organizada e eficiente, com rastreamento em tempo real e gerenciamento completo do ciclo de entrega.

## Screenshots
![Tela de Login](/assets/prototipos/login.png)
![Painel Principal](/assets/prototipos/principal.png)
![Painel do Entregador](/assets/prototipos/painelEntregador.png)

## Instalação 
**Linguagens**: Python, JavaScript<br>
**Tecnologias**: Django, React Native, SQLite, JWT<br>

### Requisitos
- Python 3.9+
- Node.js 18+
- Expo CLI
- Django 4.2+

### Backend
```bash
cd ilhaDeliveryApp/backend
python -m venv venv
venv\Scripts\activate  # No Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd ilhaDeliveryApp/frontend
npm install
npx expo start
```

## Uso 
O sistema possui dois tipos de usuários principais:

### Para Clientes
1. Faça cadastro/login no aplicativo móvel
2. Solicite produtos informando origem, descrição e detalhes
3. Aguarde a cotação do operador
4. Confirme e pague o pedido
5. Acompanhe o status da entrega

### Para Operadores
1. Acesse o painel administrativo
2. Visualize pedidos pendentes
3. Envie cotações aos clientes
4. Gerencie o status das entregas
5. Finalize pedidos quando entregues

Para mais detalhes, consulte o [Tutorial de Uso](tutorial.md).

## Vídeo
<iframe width="560" height="315" src="https://www.youtube.com/embed/seu_video_aqui" frameborder="0" allowfullscreen></iframe>

## Documentação
O projeto segue a metodologia RUP adaptada, com documentação completa organizada nas fases de:
- [Iniciação](/_Iniciação/documento_de_visao/)
- [Elaboração](/__Elaboração/modelagem/)
- [Construção](/___Construção/)
- [Transição](/____Transição/)

## API
O sistema possui uma [API REST](/api/) completa documentada com Swagger.
