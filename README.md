# 🏥 Backend -Sistema de Gestión de Turnos para Clínicas y Consultorios

Este proyecto es parte del trabajo integrador final de la materia **Prácticas Profesionalizantes IV**. Se trata de una **API RESTful** desarrollada con **Node.js** y **Express**, que permite gestionar usuarios, turnos médicos, mensajes, notificaciones, encuestas de satisfacción y más.

---

## Grupo 9:

-  Silvina Villanueva
-  Florencia Casanova
-  Pamela Gómez
-  Verónica Menéndez
-  Soledad Aldao

---

## 📌 Objetivos del Proyecto

-  Permitir el **registro y login de usuarios** (pacientes, médicos y administradores).
-  Gestionar turnos médicos y su historial.
-  Enviar mensajes y notificaciones entre usuarios.
-  Recoger encuestas de satisfacción sobre los turnos.

---

## 🚀 Tecnologías y Librerías

-  **Node.js** - entorno de ejecución.
-  **Express** - framework web para construir la API.
-  **Sequelize** - ORM para interactuar con MySQL.
-  **MySQL** - base de datos relacional.
-  **bcrypt** - para hashear contraseñas de forma segura.
-  **jsonwebtoken** - para generar y verificar tokens JWT.
-  **dotenv** - para gestionar variables de entorno.

---

## 📁 Estructura del Proyecto

/proyecto-integrador-be-ppiv
│
├── controllers/ # Lógica de negocio (register, login, ABM de usuarios, etc.)
├── routes/ # Rutas organizadas por entidad
├── models/ # Definición de modelos Sequelize
├── .env # Variables de entorno
├── database.js # Configuración de conexión a la base de datos
├── index.js # Punto de entrada de la aplicación
├── testDb.js # Script para probar conexión a la base de datos
└── README.md # Documentación del proyecto

---

## ⚙️ Instalación y ejecución

1. **Clonar el repositorio**

```bash
git clone git@github.com:solealdao/proyecto-integrador-be-ppiv.git
cd proyecto-integrador-be-ppiv
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Crear archivo .env**
   DB_NAME=clinic_system
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_HOST=localhost
   DB_DIALECT=mysql
   SECRET_KEY=tu_clave_secreta_segura

4. **Correr el servidor**

```bash
npm start
```

5. **Testear conexión a la DB**

```bash
node testDb.js
```

---

## Endpoints disponibles

| Método | Ruta                  | Descripción                |
| ------ | --------------------- | -------------------------- |
| POST   | `/api/users/register` | Registrar nuevo usuario    |
| POST   | `/api/users/login`    | Login de usuario           |
| GET    | `/api/users`          | Obtener todos los usuarios |
| PUT    | `/api/users/:id`      | Editar usuario por ID      |
| DELETE | `/api/users/:id`      | Eliminar usuario por ID    |
