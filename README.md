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

```bash
/proyecto-integrador-be-ppiv
│
├── .github/workflows # Configuración de GitHub Actions para CI/CD
├── config # Configuración de conexión a la base de datos
├── controllers/ # Lógica de negocio (register, login, ABM de usuarios, etc.)
├── jobs/ # Cron jobs programados (envío de recordatorios diarios, aviso de mensajes sin leer)
├── logs/ # Archivos de logs del sistema
├── routes/ # Rutas organizadas por entidad
├── models/ # Definición de modelos Sequelize
├── middlewares/ # Middlewares como autenticación, validaciones, manejo de errores
├── scripts/ # Scripts SQL para crear la base de datos y datos de prueba
├── tests/ # Archivos correspondientes a pruebas unitarias y de integración
├── utils/ # Funciones auxiliares de uso general
├── .env # Variables de entorno
├── app.js # Punto de entrada de la aplicación
├── docker-compose.yml # Configuración de servicios (API + MySQL)
├── Dockerfile # Imagen Docker del backend
├── testDb.js # Script para probar conexión a la base de datos
└── README.md # Documentación del proyecto
```

> 🕒 Nota: El cron job ubicado en jobs/ se ejecuta automáticamente todos los días a las 09:00 AM. Su función es enviar recordatorios por correo electrónico a los pacientes con turnos programados para el día siguiente.

---

## ⚙️ Instalación y ejecución

### Levantar el backend con Docker Compose

Es posible levantar la API y la base de datos MySQL con un solo comando.

1. Asegurate de tener instalado Docker y Docker Compose.
2. Clonar el repositorio y entrar en la carpeta del proyecto:

```bash
git clone git@github.com:solealdao/proyecto-integrador-be-ppiv.git
cd proyecto-integrador-be-ppiv
```

3. Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido::

DB_USER=root
DB_PASS=password
DB_NAME=clinic_system
DB_HOST=db
DB_PORT=3306
SECRET_KEY=superclaveultrasecreta
EMAIL_USER=clinica.medica.ppiv@gmail.com
EMAIL_PASS=klfmhhefpmvimgki

4. **Levantar los servicios con Docker Compose:**

```bash
docker compose up
```

Esto levantará un contenedor para la API y otro con MySQL configurado automáticamente con los datos definidos.

5. La API estará disponible en http://localhost:4001

6. **Levantar base de datos MySQL con Docker**
   El archivo `docker-compose.yml` está configurado para que, al levantar los servicios, se ejecute automáticamente la creación de la base de datos y la inserción de datos de prueba.

Esto se logra a través de los scripts SQL ubicados en la carpeta `/scripts`:

-  `/scripts/1.scripts_structure.sql` → crea la base de datos y las tablas necesarias.

-  `/scripts/2.scripts_data.sql` → inserta usuarios y datos de ejemplo.

> ⚙️ No es necesario ejecutar estos scripts manualmente: Docker los ejecuta al iniciar el contenedor de la base de datos.

7. **Credenciales de prueba**
   Para facilitar el testeo del login, se incluyen usuarios de ejemplo en el script `scripts/1.scripts_data.sql`.

El `email` es el que figura en el script.
La `contraseña` para todos los usuarios de prueba es: `123456`
(las contraseñas están hasheadas en la base de datos, pero el valor en texto plano es este).

---

## Endpoints disponibles

👤 **Usuarios**

| Método | Ruta                  | Descripción                |
| ------ | --------------------- | -------------------------- |
| POST   | `/api/users/register` | Registrar nuevo usuario    |
| POST   | `/api/users/login`    | Login de usuario           |
| GET    | `/api/users`          | Obtener todos los usuarios |
| PUT    | `/api/users/:id`      | Editar usuario por ID      |
| DELETE | `/api/users/:id`      | Eliminar usuario por ID    |

📅 **Turnos**

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

📆 **Disponibilidades**

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

💬 **Mensajes**

| Método | Ruta                                 | Descripción                                 |
| ------ | ------------------------------------ | ------------------------------------------- |
| GET    | `/api/messages/users`                | Obtener usuarios disponibles para chat      |
| GET    | `/api/messages/conversation/:userId` | Obtener conversación con usuario específico |
| POST   | `/api/messages/send`                 | Enviar un nuevo mensaje                     |

---

## Despliegue automático (CI/CD)

El proyecto cuenta con una pipeline CI/CD integrada mediante GitHub Actions.

-  Cada vez que se hace un push a la rama `main`:
-  Se instala el entorno Node.js y las dependencias.
-  Se ejecutan los tests (si están definidos).
-  Se construye la imagen Docker del backend.
-  Se publica la imagen automáticamente en Docker Hub.
-  Render utiliza esa imagen para desplegar automáticamente el sistema en producción.

> ⚙️ Imagen publicada como: `solealdao/clinic-system-backend`

Este flujo garantiza un entorno siempre actualizado, confiable y listo para pruebas o demostraciones.
