# Polls

A API de Enquetes é uma aplicação simples desenvolvida durante o evento NLW Expert da Rocketseat, e posteriormente refatorada para aplicar os principais conceitos SOLID, visando melhorar a estrutura e organização da base de código. 

Esta API permite aos usuários criar enquetes e visualizar seus resultados em tempo real. 

## Tecnlogias

- **Node**.js: Ambiente de execução JavaScript do lado do servidor.
- **Fastify**: Um framework web leve e eficiente para Node.js.
- **Prisma**: ORM para manipulação de dados, facilitando a interação com o banco de dados.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar os dados das enquetes.
- **Redis**: Sistema de cache utilizado para armazenar e distribuir os resultados em tempo real.
- **WebSocket**: Protocolo de comunicação bidirecional em tempo real para envio das informações ao cliente.

## Instalação

> Certifique-se de ter o Node.js, Docker e Docker Compose instalados em sua máquina.

1. Clone este repositório:
```bash
git clone https://github.com/thenriquedb/polls-api/
```
2. Acesse o diretório do projeto:
```bash
cd polls-api
```
3. Instale as depedências:
```bash
npm install # or yarn
```
4. Execute o Docker Compose:
```bash
docker-compose up
```
5. Execute o projeto
```bash
npm run dev # ou yarn dev
```
A API estará disponível em **http://localhost:3333**.

## Endpoints

### POST ``/polls``
**Request body**
```json
  {
    "title": string,
    "options": string[],
  }
```

**Response**
```json
  {
    "pollId": UUID
  }
```

### GET ``/polls/:pollId``
**Response**
```json
    {
        "poll": {
            "id": UUID,
            "title": string,
            "options": {
                "id": UUID,
                "title": string,
                "score": number
            }[]
        }
    }
```

### POST ``/polls/:pollId/votes``
**Request body**
```json
  {
    "pollOptionId": UUID
  }
```

### WEBSOCKET ``/polls/:pollId/results``
```json
{
    "pollOptionId": string,
    "votes": number
}
```

## Estrutura do projeto
```bash
.
└── poll-api/
    ├── prisma 
    └── src/
        ├── infra/
        │   ├── http/
        │   │   ├── controllers
        │   │   ├── app.ts # HTTP app configure
        │   │   └── server.ts # Run server 
        │   └── storage/
        │       ├── prisma.ts # Prisma config file
        │       └── redis.ts # Redis singleton
        ├── repository # manage data access logic
        │   └── example-repository 
        ├── use-cases # bussines rules
        │   └── example-use-case/
        │       ├── example-use-case.ts
        │       ├── index.ts
        │       └── make-example-use-case.ts # Factory to build use-case
        └── util # common utilitaries
```

