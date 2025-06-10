# Ilha Delivery

**Número do Grupo**: 5<br>
**Código da Disciplina**: FGA0208-T01<br>
**Semestre**: 2025.1

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
**Ilha Delivery** é uma plataforma que atua como intermediadora logística especializada em entregas para regiões de difícil acesso — como a Ilha Primeira. O sistema integra um aplicativo móvel para clientes, um painel administrativo para operadores, e um sistema físico de lockers com entregadores utilizando jet skis.

O cliente faz seus pedidos diretamente no aplicativo Ilha Delivery, especificando a origem e os produtos desejados. O sistema notifica os operadores, que preparam cotações e gerenciam todo o processo de entrega, utilizando nosso sistema de jet skis para garantir entregas rápidas e eficientes entre o continente e a ilha.

## Documentação

A documentação completa do projeto está disponível em nosso site MkDocs. Para visualizá-la, existem duas opções:

### Visualização Online

A documentação está disponível online em: [https://projetos-de-extensao.github.io/PBE_25.1_8001_V_Mbappython/](https://projetos-de-extensao.github.io/PBE_25.1_8001_V_Mbappython/)

### Executar Localmente

Para executar a documentação localmente:

1. Instale as dependências:
```bash
pip install mkdocs mkdocs-material
```

2. Execute o servidor MkDocs:
```bash
mkdocs serve
```

3. Acesse a documentação em `http://localhost:8000`

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
PBE_25.1_8001_V_Mbappython/
├── docs/                # Documentação do projeto (MkDocs)
├── ilhaDeliveryApp/     # Código-fonte do aplicativo
│   ├── backend/         # Backend Django 
│   └── frontend/        # Frontend React Native
└── site/                # Site gerado pelo MkDocs (não editar diretamente)
```

## Instalação e Uso

Para instruções detalhadas de instalação e uso, consulte:

- [Instalação do Backend](docs/instalacao_backend.md)
- [Instalação do Frontend](docs/instalacao_frontend.md)
- [Tutorial de Uso](docs/tutorial.md)

## Contribuição

Interessado em contribuir? Confira nosso [Guia de Contribuição](docs/contribuir.md).

## Licença

Este projeto está licenciado sob os termos da licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Screenshots
Adicione 3 ou mais screenshots do projeto em termos de interface e funcionamento.

## Instalação 
**Linguagens**: Python<br>
**Tecnologias**: xxxxxx<br>
Descreva os pré-requisitos para rodar o seu projeto e os comandos necessários.
Insira um manual ou um script para auxiliar ainda mais.

## Uso 
Explique como usar seu projeto caso haja algum passo a passo após o comando de execução.

## Vídeo
Adicione 1 ou mais vídeos com a execução do projeto final.

## Apresentação Ap1
- Link: [Slide AP1](https://www.canva.com/design/DAGjzYR3QG0/-ZHnESnXi8wIDCaj6bXXyw/edit)
## Apresentação AP2
- Link:[Slide AP2](https://www.canva.com/design/DAGouqPobZQ/VLemmKqpWglJlfGi7lqYPw/edit?utm_content=DAGouqPobZQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
  
## Outros 
Quaisquer outras informações sobre seu projeto podem ser descritas abaixo.

## ✅ Passos para desenvolvedores rodarem o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/Projetos-de-Extensao/PBE_25.1_8001_V_Mbappython
cd PBE_25.1_8001_V_Mbappython
cd ilhaDeliveryApp
```

### 2. Backend (Python)

```bash
cd backend
python -m venv venv
source venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

### 3. Frontend (React Native)

```bash
cd ../frontend
npm install  
npm start
```
## Vídeos
- Instalação do projeto: [Link](https://youtu.be/_Bc3TPKPEBo)
- Demonstração: [Link](https://youtu.be/TCxq6m7jjgc)

