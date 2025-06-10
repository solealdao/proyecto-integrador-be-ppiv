# 🏥 Backend -Sistema de Gestión de Turnos para Clínicas y Consultorios

Este proyecto es parte del trabajo integrador final de la materia **Prácticas Profesionalizantes IV** y **Seminario de actualización DevOps**. Se trata de una **API RESTful** desarrollada con **Node.js** y **Express**, que permite gestionar usuarios, turnos médicos, mensajes, notificaciones, encuestas de satisfacción y más.

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
├── middlewares/ # Middlewares como autenticación, validaciones, manejo de errores
├── scripts/ # Scripts SQL para crear la base de datos y datos de prueba
├── .env # Variables de entorno
├── database.js # Configuración de conexión a la base de datos
├── index.js # Punto de entrada de la aplicación
├── testDb.js # Script para probar conexión a la base de datos
└── README.md # Documentación del proyecto

---

## ⚙️ Instalación y ejecución

### Variables de entorno (.env)

El archivo `.env` contiene las variables necesarias para la configuración de la conexión a la base de datos y otros secretos.

#### Importante sobre `DB_HOST`:

-  Si ejecutás el proyecto localmente, donde MySQL está instalado en tu máquina, configurá:

```bash
DB_HOST=127.0.0.1
```

-  Si ejecutás el proyecto con Docker Compose, el contenedor de la API debe conectarse al contenedor MySQL usando el nombre del servicio definido en `docker-compose.yml` (usualmente db):

```bash
DB_HOST=db
```

Esto es porque en Docker Compose los contenedores se comunican por nombre de servicio dentro de la red interna de Docker.

### Opción 1: Ejecutar localmente (Node.js + MySQL instalado localmente)

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
   Crear un archivo .env en la raíz del proyecto con el siguiente contenido:

   DB_USER=root
   DB_PASS=password
   DB_NAME=clinic_system
   DB_HOST=127.0.0.1
   DB_PORT=3306
   SECRET_KEY=superclaveultrasecreta
   EMAIL_USER=clinica.medica.ppiv@gmail.com
   EMAIL_PASS=klfmhhefpmvimgki

4. **Configuración de la conexión a la base de datos**
   Los datos de conexión a la base de datos están definidos en el archivo:

```bash
/config/config.js
```

Este archivo usa las variables del archivo `.env` para establecer la configuración del entorno development, incluyendo:

-  nombre de la base de datos (DB_NAME)
-  usuario (DB_USER)
-  contraseña (DB_PASSWORD)
-  host (DB_HOST)
-  dialecto

5. **Levantar la base de datos MySQL local**
   Se requerirá tener MySQL instalado y en funcionamiento.
   Se debe ejecutar los scripts SQL incluidos en la carpeta `/scripts` desde tu herramienta de gestión de bases de datos preferida (por ejemplo: MySQL Workbench, DBeaver, phpMyAdmin, etc.).

Los archivos .sql incluyen:

-  La creación de la base de datos y la creación de las tablas necesarias (`/scripts/scripts_structure.sql`)
-  Inserción de datos de prueba (`/scripts/scripts_data.sql`)

6. **Credenciales de prueba**
   Para facilitar el testeo del login, se incluyen usuarios de ejemplo en el script `scripts/scripts_data.sql`.

El `email` es el que figura en el script.
La `contraseña` para todos los usuarios de prueba es: `123456`
(las contraseñas están hasheadas en la base de datos, pero el valor en texto plano es este).

6. **Testear conexión a la DB**

```bash
node testDb.js
```

7. **Correr el servidor**

```bash
npm start
```

El servidor estará disponible en http://localhost:4001

### Opción 2: Ejecutar con Docker Compose (recomendado)

Si preferís usar Docker, podés levantar la API y la base de datos MySQL con un solo comando.

1. Asegurate de tener instalado Docker y Docker Compose.
2. Clonar el repositorio y entrar en la carpeta del proyecto:

```bash
git clone git@github.com:solealdao/proyecto-integrador-be-ppiv.git
cd proyecto-integrador-be-ppiv
```

3. Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido (ejemplo para Docker Compose):

DB_USER=root
DB_PASS=password
DB_NAME=clinic_system
DB_HOST=db
DB_PORT=3306
SECRET_KEY=superclaveultrasecreta
EMAIL_USER=clinica.medica.ppiv@gmail.com
EMAIL_PASS=klfmhhefpmvimgki

4. Levantar los servicios con Docker Compose:

```bash
docker compose up
```

Esto levantará un contenedor para la API y otro con MySQL configurado automáticamente con los datos definidos.

5. La API estará disponible en http://localhost:4001

---

## Endpoints disponibles

👤 Usuarios

| Método | Ruta                  | Descripción                |
| ------ | --------------------- | -------------------------- |
| POST   | `/api/users/register` | Registrar nuevo usuario    |
| POST   | `/api/users/login`    | Login de usuario           |
| GET    | `/api/users`          | Obtener todos los usuarios |
| PUT    | `/api/users/:id`      | Editar usuario por ID      |
| DELETE | `/api/users/:id`      | Eliminar usuario por ID    |

📅 Turnos

| Método | Ruta                                 | Descripción                            |
| ------ | ------------------------------------ | -------------------------------------- |
| GET    | `/api/appointments/all`              | Obtener todos los turnos               |
| POST   | `/api/appointments`                  | Crear un nuevo turno                   |
| GET    | `/api/appointments/me`               | Obtener turnos del usuario logueado    |
| GET    | `/api/appointments/:id`              | Obtener detalle de un turno por ID     |
| PUT    | `/api/appointments/:id`              | Modificar un turno existente           |
| DELETE | `/api/appointments/:id`              | Cancelar un turno                      |
| GET    | `/api/appointments/doctor/:doctorId` | Obtener turnos de un doctor específico |
| POST   | `/api/appointments/:id/complete`     | Completar un turno con notas           |

📆 Disponibilidades

| Método | Ruta                                          | Descripción                                             |
| ------ | --------------------------------------------- | ------------------------------------------------------- |
| GET    | `/api/availabilities`                         | Listar todas las disponibilidades                       |
| GET    | `/api/availabilities/doctor/:idDoctor`        | Listar disponibilidades por doctor                      |
| GET    | `/api/availabilities/doctor/:idDoctor/agenda` | Listar agenda completa (disponibilidades + excepciones) |
| POST   | `/api/availabilities`                         | Crear nueva disponibilidad                              |
| PUT    | `/api/availabilities/:id`                     | Modificar disponibilidad existente                      |
| DELETE | `/api/availabilities/:id`                     | Eliminar una disponibilidad                             |
| POST   | `/api/availabilities/unavailable`             | Crear una indisponibilidad (día no disponible)          |
| DELETE | `/api/availabilities/unavailable/:id`         | Eliminar una indisponibilidad                           |

💬 Mensajes

| Método | Ruta                                 | Descripción                                 |
| ------ | ------------------------------------ | ------------------------------------------- |
| GET    | `/api/messages/users`                | Obtener usuarios disponibles para chat      |
| GET    | `/api/messages/conversation/:userId` | Obtener conversación con usuario específico |
| POST   | `/api/messages/send`                 | Enviar un nuevo mensaje                     |
