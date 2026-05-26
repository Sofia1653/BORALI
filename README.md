# BORALI

Este é o projeto Borali, composto por um backend em Java com Spring Boot (utilizando PostgreSQL como banco de dados) e um frontend em Angular.

## Links importantes de Dados:
* (Colab)[https://colab.research.google.com/drive/1ySObSrMZVLPjAbLPajN6X_jbYYKxduCu?usp=sharing]
* (Docs)[https://docs.google.com/document/d/1ypHtN37TZuM2q_GBxEnuExDmdFfz7SA_OwX9WoAtSv4/edit?usp=sharing]

## Pré-requisitos

Para rodar o projeto, você precisará ter instalado em sua máquina:
* Java 17 ou superior.
* Node.js e npm.
* PostgreSQL instalado e rodando localmente.

---

## Configuração do Banco de Dados

A API está configurada para conectar a um banco local chamado `borali`.

1. Abra o terminal do seu PostgreSQL (ou use uma ferramenta visual como DBeaver/pgAdmin) e execute o comando para criar a base de dados:
   ```sql
   CREATE DATABASE borali;
   ```
2. Crie a role (usuário) `admin` se ela não existir no seu PostgreSQL local:
   ```sql
   CREATE ROLE admin WITH LOGIN SUPERUSER PASSWORD '';
   ```

Caso precise alterar o usuário ou senha de conexão com o banco de dados, edite o arquivo:
`backend/borali/src/main/resources/application.properties`

---

## Como Rodar o Projeto por Completo

Para rodar a aplicação completa, você precisará iniciar tanto o backend quanto o frontend de forma simultânea. Siga os passos abaixo em terminais separados:

### 1. Rodando o Backend (API)

Navegue até a pasta do backend:
```bash
cd backend/borali
```

Para compilar, rodar testes e criar as tabelas no banco de dados automaticamente:
```bash
./mvnw clean test
```

Para iniciar a API localmente na porta 8080:
```bash
./mvnw spring-boot:run
```

A API estará acessível em `http://localhost:8080`.

### 2. Rodando o Frontend (Angular)

Navegue até a pasta do frontend:
```bash
cd frontend
```

Instale as dependências necessárias do projeto:
```bash
npm install
```

Para iniciar o servidor de desenvolvimento do Angular:
```bash
npm start
```

O frontend estará disponível em `http://localhost:4200`.

---

## Principais Endpoints da API

* Categorias (`/categorias`): CRUD completo para gerenciar tipos de interesse.
* Usuários (`/usuarios`): CRUD de usuários, além de rotas especializadas para adicionar amigos (`/usuarios/{id}/amigos/{amigoId}`) e registrar interesses (`/usuarios/{id}/interesses/{categoriaId}`).
* Eventos (`/eventos`): CRUD completo de eventos (contendo dados integrados de localização embutida e infraestruturas).
* Favoritos (`/favoritos`): Marcar (`POST`) e desmarcar (`DELETE`) favoritos para usuários.
* Busca Geográfica (`/eventos/proximos`): Retorna eventos num raio em quilômetros baseado na fórmula de Haversine:
  * Exemplo: `GET /eventos/proximos?latitude=-8.05&longitude=-34.88&raio=10.0`
* Recomendações (`/eventos/recomendados`): Recomendação de eventos filtrados pelas categorias de interesse do usuário:
  * Exemplo: `GET /eventos/recomendados?usuarioId=1`