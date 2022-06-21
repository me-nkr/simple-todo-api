# Simple Todo API

A simple multiuser todo management API server

## Tech Stack
    - Runtime Environment: Node
    - Language: JavaScript
    - Server: Express
    - Database: MongoDB
    - ODM: Mongoose
    - Auth: Basic Auth + JWT

## Software Architecture: Layered Architecture

### Layers
    - Application Logic Layer - Routes and Controllers
    - Data Access Layer - Mongoose Models
    - Data Storage Layer - MongoDB

## Environment Variables
    - MONGO_SCHEME - scheme of mongoDB url (eg: mongodb+srv://)
    - MONGO_USER - mongoDB username
    - MONGO_PASS - mongoDB password
    - MONGO_HOST - mongoDB Host server address
    - MONGO_DB_DEV - mongoDB development database name
    - MONGO_DB_TEST - mongoDB test database name
    - JWT_SECRET - JWT signature secret