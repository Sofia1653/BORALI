# BORALI - Backend (API)

Este é o backend da aplicação Borali, desenvolvido em Java com Spring Boot, utilizando arquitetura modular e PostgreSQL como banco de dados.

## Pré-requisitos
* **Java 17** ou superior instalado.
* **PostgreSQL** instalado e rodando localmente.

---

## 🛠️ Configuração do Banco de Dados
A API está configurada para conectar a um banco local chamado `borali`.

1. **Abra o terminal do seu PostgreSQL** (ou use uma ferramenta visual como DBeaver/pgAdmin) e execute o comando para criar a base de dados:
   ```sql
   CREATE DATABASE borali;
   ```
2. **Crie a role (usuário) `admin`** se ela não existir no seu PostgreSQL local:
   ```sql
   CREATE ROLE admin WITH LOGIN SUPERUSER PASSWORD '';
   ```

*Caso precise alterar o usuário ou senha de conexão com o banco de dados, edite o arquivo:*
`backend/borali/src/main/resources/application.properties`

---

## 🚀 Como Rodar o Projeto

Navegue até a pasta correspondente ao backend (`backend/borali`):

```bash
cd backend/borali
```

### 1. Executar os testes automatizados
Para compilar a aplicação, criar automaticamente a estrutura física das tabelas no banco de dados e rodar a suíte de testes de integração e testes unitários:

```bash
./mvnw clean test
```

### 2. Iniciar a API localmente
Para subir o servidor de desenvolvimento na porta padrão (`8080`):

```bash
./mvnw spring-boot:run
```

Uma vez rodando, a API estará acessível em `http://localhost:8080`.

---

## 🗺️ Principais Endpoints da API

* **Categorias** (`/categorias`): CRUD completo para gerenciar tipos de interesse.
* **Usuários** (`/usuarios`): CRUD de usuários, além de rotas especializadas para adicionar amigos (`/usuarios/{id}/amigos/{amigoId}`) e registrar interesses (`/usuarios/{id}/interesses/{categoriaId}`).
* **Eventos** (`/eventos`): CRUD completo de eventos (contendo dados integrados de localização embutida e infraestruturas).
* **Favoritos** (`/favoritos`): Marcar (`POST`) e desmarcar (`DELETE`) favoritos para usuários.
* **Busca Geográfica** (`/eventos/proximos`): Retorna eventos num raio em quilômetros baseado na fórmula de Haversine:
  * Exemplo: `GET /eventos/proximos?latitude=-8.05&longitude=-34.88&raio=10.0`
* **Recomendações** (`/eventos/recomendados`): Recomendação de eventos filtrados pelas categorias de interesse do usuário:
  * Exemplo: `GET /eventos/recomendados?usuarioId=1`