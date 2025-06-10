graph TD
    A[Cliente Mobile] -->|Requisições HTTP| B[API Backend]
    B -->|Respostas JSON| A
    C[Operador Web] -->|Requisições HTTP| B
    B -->|Respostas JSON| C
    B -->|Armazena Dados| D[(Banco de Dados)]
    B -->|Armazena Arquivos| E[Sistema de Arquivos]
    F[Administrador] -->|Gerencia| B
    
    subgraph Frontend
    A
    C
    end
    
    subgraph Backend
    B
    D
    E
    end
