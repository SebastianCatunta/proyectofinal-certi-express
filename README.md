# Sistema de gestión de evaluación académica de estudiantes

## 1. Nombre del proyecto

Sistema de gestión de evaluación académica de estudiantes

---

## 2. Descripción general del proyecto

El proyecto consiste en una API REST desarrollada con Node.js, Express.js y MongoDB para gestionar la evaluación académica de estudiantes dentro de una institución educativa.

El sistema permite administrar usuarios, estudiantes, maestros, materias, evaluaciones y calificaciones. Además, permite registrar observaciones, consultar notas por estudiante, calcular promedios por materia y generar reportes académicos.

Este proyecto resuelve el problema de la poca claridad y organización en el registro de calificaciones, ya que centraliza la información académica en una API ordenada, segura y documentada. El sistema está dirigido principalmente a administradores, maestros y estudiantes.

---

## 3. Objetivo general

Desarrollar una API REST utilizando Node.js, Express.js y MongoDB que permita administrar estudiantes, materias, evaluaciones y calificaciones, facilitando el seguimiento académico y la consulta detallada del rendimiento de los estudiantes.

---

## 4. Objetivos específicos

* Implementar autenticación de usuarios mediante JWT.
* Aplicar autorización basada en roles: administrador, maestro y estudiante.
* Gestionar usuarios, estudiantes, maestros, materias, evaluaciones y calificaciones.
* Permitir la inscripción de estudiantes en materias.
* Permitir que los maestros registren evaluaciones y calificaciones.
* Permitir la consulta de calificaciones por estudiante y por materia.
* Calcular el promedio académico de un estudiante dentro de una materia.
* Generar reportes académicos por materia.
* Documentar todos los endpoints mediante Swagger/OpenAPI.
* Implementar pruebas unitarias y pruebas e2e para validar el funcionamiento del sistema.

---

## 5. Usuarios o roles del sistema

### Administrador

Puede gestionar usuarios, crear materias, asignar un maestro a cada materia, registrar estudiantes y controlar los roles del sistema. También puede consultar la información general de usuarios, estudiantes, maestros, cursos, evaluaciones y calificaciones.

### Maestro

Puede visualizar las materias que le fueron asignadas, crear evaluaciones dentro de esas materias, registrar calificaciones, editar notas y agregar observaciones sobre el desempeño de los estudiantes.

### Estudiante

Puede consultar las materias en las que está inscrito, visualizar sus evaluaciones, revisar sus calificaciones y conocer su promedio académico.

---

## 6. Funcionalidades principales del proyecto

| Historia de usuario | Funcionalidad |
|---|---|
| HU-01 | Crear usuario |
| HU-02 | Gestionar roles |
| HU-03 | Crear materia |
| HU-04 | Asignar maestro a materia |
| HU-05 | Inscribir estudiantes en materia |
| HU-06 | Crear evaluación en materia asignada |
| HU-07 | Registrar calificación |
| HU-08 | Actualizar calificación |
| HU-09 | Agregar observación |
| HU-10 | Obtener calificaciones por materia |
| HU-11 | Consultar detalle de evaluación |
| HU-12 | Calcular promedio |
| HU-13 | Generar reporte por materia |

---

## 7. Tecnologías utilizadas

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT para autenticación
* Bcrypt para encriptar contraseñas
* Swagger / OpenAPI para documentación
* Express OpenAPI Validator para validación de requests
* Jest para pruebas unitarias y e2e
* Supertest para pruebas de endpoints
* MongoDB Memory Server para pruebas con base de datos en memoria
* Postman para pruebas manuales de la API
* GitHub para control de versiones

---

## 8. Arquitectura del proyecto

El proyecto utiliza una arquitectura por capas para separar responsabilidades y mantener el código ordenado.

```txt
ProyectoBackend_Certificacion1/
│
├── docs/
│   └── openapi.yaml
│
├── src/
│   ├── controllers/
│   ├── data/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── middlewares/
│   ├── app.e2e.test.js
│   ├── crud-extra.e2e.test.js
│   ├── error-branches.e2e.test.js
│   ├── final-coverage.e2e.test.js
│   └── setup.js
│
├── coverage/
├── package.json
├── jest.config.js
└── README.md
```

### Descripción de capas

| Carpeta | Descripción |
|---|---|
| `routes` | Define las rutas de la API y conecta cada endpoint con su controlador. |
| `controllers` | Recibe las peticiones HTTP, extrae datos del request y devuelve respuestas. |
| `services` | Contiene la lógica de negocio principal del sistema. |
| `data` | Contiene los modelos de Mongoose y la conexión a MongoDB. |
| `middlewares` | Contiene autenticación, autorización, ownership, logging y formato de respuestas. |
| `docs` | Contiene la documentación OpenAPI del proyecto. |
| `tests` | Contiene pruebas unitarias y pruebas e2e. |

---

## 9. Modelo de datos

### User

```js
{
  name: String,
  email: String,
  password: String,
  role: String,
  status: String
}
```

### Student

```js
{
  userId: String,
  studentCode: Number,
  career: String,
  semester: Number
}
```

### Teacher

```js
{
  userId: String,
  teacherCode: Number,
  subjectsCanTeach: [String]
}
```

### Course

```js
{
  name: String,
  description: String,
  code: Number,
  teacherId: String,
  studentIds: [String],
  status: String
}
```

### Evaluation

```js
{
  courseId: String,
  title: String,
  description: String,
  type: String,
  date: String,
  status: String
}
```

### Grade

```js
{
  studentId: String,
  evaluationId: String,
  score: Number,
  observation: String,
  dateRegistered: String,
  status: String
}
```

---

## 10. Reglas de negocio

* No se puede crear un usuario sin nombre, correo, contraseña, rol y estado.
* El correo de cada usuario debe ser único.
* La contraseña se almacena encriptada usando bcrypt.
* El inicio de sesión genera un token JWT.
* Los endpoints protegidos requieren el header `Authorization`.
* Solo un administrador puede gestionar usuarios y roles.
* Solo un administrador puede crear estudiantes y maestros.
* Solo un administrador puede crear materias.
* Solo un administrador puede asignar un maestro a una materia.
* Solo se puede crear un maestro a partir de un usuario con rol `teacher`.
* Solo se puede crear un estudiante a partir de un usuario con rol `student`.
* Solo un administrador o maestro autorizado puede inscribir estudiantes en una materia.
* No se debe registrar dos veces al mismo estudiante en la misma materia.
* Una evaluación debe pertenecer a una materia existente.
* Solo un administrador o maestro autorizado puede crear evaluaciones.
* Solo un administrador o maestro autorizado puede registrar calificaciones.
* La nota no puede ser menor a 0 ni mayor a 100.
* Las observaciones de una calificación pueden ser actualizadas mediante un endpoint específico.
* El estudiante solo puede consultar recursos académicos relacionados con su información.
* El maestro solo puede modificar recursos de las materias que tiene asignadas.
* El promedio de una materia se calcula en base a las calificaciones registradas del estudiante.
* El reporte de una materia muestra información académica relacionada con sus evaluaciones y calificaciones.

---

## 11. Instalación del proyecto

### 11.1 Clonar el repositorio

```bash
git clone https://github.com/maurocuba/ProyectoBackend_Certificacion1.git
```

### 11.2 Entrar a la carpeta del proyecto

```bash
cd ProyectoBackend_Certificacion1
```

### 11.3 Instalar dependencias

```bash
npm install
```

---

## 12. Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER/NOMBRE_BASE_DATOS
PORT=3000
JWT_SECRET=mi_clave_secreta_jwt
```

### Descripción de variables

| Variable | Descripción |
|---|---|
| `MONGODB_URI` | Cadena de conexión a MongoDB. |
| `PORT` | Puerto donde se ejecutará la API. |
| `JWT_SECRET` | Clave secreta usada para firmar y validar tokens JWT. |

Importante: el archivo `.env` no debe subirse al repositorio porque contiene información sensible.

---

## 13. Ejecución local

### Ejecutar en modo producción

```bash
npm start
```

### Ejecutar en modo desarrollo

```bash
npm run dev
```

Cuando el servidor inicia correctamente, la API queda disponible en:

```txt
http://localhost:3000
```

---

## 14. Documentación Swagger / OpenAPI

El proyecto cuenta con documentación Swagger/OpenAPI para los endpoints implementados.

Para ver la documentación, ejecutar el servidor y entrar a:

```txt
http://localhost:3000/api-docs
```

El archivo principal de documentación se encuentra en:

```txt
docs/openapi.yaml
```

Swagger permite revisar los endpoints, los modelos de datos, los parámetros requeridos y los ejemplos de request/response.

---

## 15. Autenticación y autorización

La API utiliza JWT para autenticación.

Primero se debe iniciar sesión con:

```txt
POST /api/users/login
```

El sistema devuelve un token. Ese token debe enviarse en los endpoints protegidos dentro del header:

```txt
Authorization: Bearer TOKEN_GENERADO
```

Ejemplo:

```txt
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles disponibles

| Rol | Permisos principales |
|---|---|
| `admin` | Gestiona usuarios, estudiantes, maestros, cursos, evaluaciones, calificaciones y reportes. |
| `teacher` | Gestiona cursos asignados, evaluaciones y calificaciones. |
| `student` | Consulta cursos, evaluaciones, calificaciones y promedio académico. |

---

## 16. Endpoints implementados de la API

### Users

| Método | Endpoint | Descripción | Rol permitido |
|---|---|---|---|
| POST | `/api/users/register` | Registrar usuario | Público |
| POST | `/api/users/login` | Iniciar sesión | Público |
| GET | `/api/users` | Listar usuarios | Admin |
| GET | `/api/users/:id` | Obtener usuario por ID | Admin |
| PUT | `/api/users/:id` | Actualizar usuario | Admin |
| DELETE | `/api/users/:id` | Eliminar usuario | Admin |
| PATCH | `/api/users/:id/role` | Actualizar rol de usuario | Admin |

### Students

| Método | Endpoint | Descripción | Rol permitido |
|---|---|---|---|
| GET | `/api/students` | Listar estudiantes | Admin, Teacher |
| POST | `/api/students` | Crear estudiante | Admin |
| GET | `/api/students/:id` | Obtener estudiante por ID | Admin, Teacher, Student |
| PUT | `/api/students/:id` | Actualizar estudiante | Admin, Student |
| DELETE | `/api/students/:id` | Eliminar estudiante | Admin |
| GET | `/api/students/:id/courses` | Ver cursos inscritos de un estudiante | Admin, Student |
| GET | `/api/students/:id/grades` | Ver calificaciones de un estudiante | Admin, Student |
| GET | `/api/students/:id/courses/:courseId/grades` | Ver calificaciones de un estudiante en un curso | Admin, Student |
| GET | `/api/students/:id/courses/:courseId/evaluations` | Ver evaluaciones de un estudiante en un curso | Admin, Student |
| GET | `/api/students/:id/courses/:courseId/average` | Ver promedio del estudiante en un curso | Admin, Student |

### Teachers

| Método | Endpoint | Descripción | Rol permitido |
|---|---|---|---|
| GET | `/api/teachers` | Listar maestros | Admin, Teacher |
| POST | `/api/teachers` | Crear maestro | Admin |
| GET | `/api/teachers/:id` | Obtener maestro por ID | Admin, Teacher |
| PUT | `/api/teachers/:id` | Actualizar maestro | Admin, Teacher |
| DELETE | `/api/teachers/:id` | Eliminar maestro | Admin |
| GET | `/api/teachers/:id/courses` | Ver cursos asignados a un maestro | Admin, Teacher |

### Courses

| Método | Endpoint | Descripción | Rol permitido |
|---|---|---|---|
| GET | `/api/courses` | Listar cursos | Admin, Teacher, Student |
| POST | `/api/courses` | Crear curso | Admin |
| GET | `/api/courses/:id` | Obtener curso por ID | Admin, Teacher, Student |
| PUT | `/api/courses/:id` | Actualizar curso | Admin, Teacher |
| DELETE | `/api/courses/:id` | Eliminar curso | Admin |
| PATCH | `/api/courses/:id/teacher` | Reasignar maestro a curso | Admin |
| POST | `/api/courses/:id/students` | Inscribir estudiante en curso | Admin, Teacher |
| GET | `/api/courses/:id/students` | Listar estudiantes de un curso | Admin, Teacher |
| DELETE | `/api/courses/:id/students/:studentId` | Retirar estudiante de un curso | Admin, Teacher |
| GET | `/api/courses/:id/evaluations` | Listar evaluaciones de un curso | Admin, Teacher, Student |
| GET | `/api/courses/:id/report` | Obtener reporte de calificaciones de un curso | Admin, Teacher |
| GET | `/api/courses/:id/averages` | Ver promedios de estudiantes en un curso | Admin, Teacher |

### Evaluations

| Método | Endpoint | Descripción | Rol permitido |
|---|---|---|---|
| GET | `/api/evaluations` | Listar evaluaciones | Admin, Teacher |
| POST | `/api/evaluations` | Crear evaluación | Teacher |
| GET | `/api/evaluations/:id` | Obtener evaluación por ID | Admin, Teacher, Student |
| PUT | `/api/evaluations/:id` | Actualizar evaluación | Teacher |
| DELETE | `/api/evaluations/:id` | Eliminar evaluación | Admin, Teacher |

### Grades

| Método | Endpoint | Descripción | Rol permitido |
|---|---|---|---|
| GET | `/api/grades` | Listar calificaciones | Admin |
| POST | `/api/grades` | Registrar calificación | Teacher |
| GET | `/api/grades/:id` | Obtener calificación por ID | Student |
| PUT | `/api/grades/:id` | Actualizar calificación | Teacher |
| PATCH | `/api/grades/:id/observation` | Actualizar observación de calificación | Admin, Teacher |

---

## 17. Guía de uso en Postman

### 17.1 Registrar usuario administrador

**Método:** POST  
**Endpoint:**

```txt
http://localhost:3000/api/users/register
```

**Body JSON:**

```json
{
  "name": "Admin Principal",
  "email": "admin@example.com",
  "password": "Password123",
  "role": "admin",
  "status": "active"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "ID_GENERADO",
    "name": "Admin Principal",
    "email": "admin@example.com",
    "role": "admin",
    "status": "active"
  }
}
```

---

### 17.2 Iniciar sesión

**Método:** POST  
**Endpoint:**

```txt
http://localhost:3000/api/users/login
```

**Body JSON:**

```json
{
  "email": "admin@example.com",
  "password": "Password123"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Successful Login",
  "data": {
    "name": "Admin Principal",
    "token": "TOKEN_GENERADO"
  }
}
```

Después del login, copiar el token y usarlo en Postman en:

```txt
Authorization > Bearer Token
```

---

### 17.3 Registrar usuario maestro

**Método:** POST  
**Endpoint:**

```txt
http://localhost:3000/api/users/register
```

**Body JSON:**

```json
{
  "name": "Carlos Mendoza",
  "email": "carlos.teacher@example.com",
  "password": "Password123",
  "role": "teacher",
  "status": "active"
}
```

---

### 17.4 Registrar usuario estudiante

**Método:** POST  
**Endpoint:**

```txt
http://localhost:3000/api/users/register
```

**Body JSON:**

```json
{
  "name": "Sebastian Rojas",
  "email": "sebastian.student@example.com",
  "password": "Password123",
  "role": "student",
  "status": "active"
}
```

---

### 17.5 Crear maestro

**Método:** POST  
**Endpoint:**

```txt
http://localhost:3000/api/teachers
```

**Body JSON:**

```json
{
  "userId": "ID_DEL_USUARIO_TEACHER",
  "teacherCode": 1001,
  "subjectsCanTeach": ["Backend", "Express.js", "MongoDB"]
}
```

---

### 17.6 Crear estudiante

**Método:** POST  
**Endpoint:**

```txt
http://localhost:3000/api/students
```

**Body JSON:**

```json
{
  "userId": "ID_DEL_USUARIO_STUDENT",
  "studentCode": 2026001,
  "career": "Ingeniería de Sistemas",
  "semester": 5
}
```

---

### 17.7 Crear curso

**Método:** POST  
**Endpoint:**

```txt
http://localhost:3000/api/courses
```

**Body JSON:**

```json
{
  "name": "Certificación Backend con Express.js",
  "description": "Curso orientado al desarrollo de APIs REST con Node.js, Express y MongoDB.",
  "code": 5001,
  "teacherId": "ID_DEL_TEACHER",
  "studentIds": [],
  "status": "active"
}
```

---

### 17.8 Inscribir estudiante en curso

**Método:** POST  
**Endpoint:**

```txt
http://localhost:3000/api/courses/ID_DEL_CURSO/students
```

**Body JSON:**

```json
{
  "studentId": "ID_DEL_STUDENT"
}
```

---

### 17.9 Crear evaluación

**Método:** POST  
**Endpoint:**

```txt
http://localhost:3000/api/evaluations
```

**Body JSON:**

```json
{
  "courseId": "ID_DEL_CURSO",
  "title": "Proyecto Final Backend",
  "description": "Evaluación final del sistema de gestión académica.",
  "type": "project",
  "date": "2026-06-26",
  "status": "active"
}
```

---

### 17.10 Registrar calificación

**Método:** POST  
**Endpoint:**

```txt
http://localhost:3000/api/grades
```

**Body JSON:**

```json
{
  "studentId": "ID_DEL_STUDENT",
  "evaluationId": "ID_DE_LA_EVALUACION",
  "score": 92,
  "observation": "Buen desarrollo del proyecto final.",
  "dateRegistered": "2026-06-26",
  "status": "active"
}
```

---

### 17.11 Actualizar observación de calificación

**Método:** PATCH  
**Endpoint:**

```txt
http://localhost:3000/api/grades/ID_DE_LA_CALIFICACION/observation
```

**Body JSON:**

```json
{
  "observation": "Excelente implementación de endpoints y reportes académicos."
}
```

---

### 17.12 Consultar calificaciones de un estudiante en un curso

**Método:** GET  
**Endpoint:**

```txt
http://localhost:3000/api/students/ID_DEL_STUDENT/courses/ID_DEL_CURSO/grades
```

---

### 17.13 Consultar promedio de un estudiante en un curso

**Método:** GET  
**Endpoint:**

```txt
http://localhost:3000/api/students/ID_DEL_STUDENT/courses/ID_DEL_CURSO/average
```

---

### 17.14 Consultar estudiantes inscritos en un curso

**Método:** GET  
**Endpoint:**

```txt
http://localhost:3000/api/courses/ID_DEL_CURSO/students
```

---

## 18. Evidencia de funcionamiento en Postman

Las siguientes capturas muestran el funcionamiento de los endpoints principales de la API mediante Postman.

### Registro de usuario administrador

![Registro de usuario administrador](docs/postman/users-register-admin.png)

---

### Registro de usuario maestro

![Registro de usuario maestro](docs/postman/users-register-teacher.png)

---

### Registro de usuario estudiante

![Registro de usuario estudiante](docs/postman/users-register-student.png)

---

### Login de administrador con JWT

![Login administrador](docs/postman/users-login-admin.png)

---

### Login de maestro con JWT

![Login maestro](docs/postman/users-login-teacher.png)

---

### Creación de maestro

![Creación de maestro](docs/postman/teachers-create.png)

---

### Creación de estudiante

![Creación de estudiante](docs/postman/students-create.png)

---

### Listado de cursos

![Listado de cursos](docs/postman/courses-list.png)

---

### Inscripción de estudiante en curso

![Inscripción de estudiante en curso](docs/postman/courses-enroll-student.png)

---

### Listado de estudiantes inscritos en curso

![Estudiantes inscritos en curso](docs/postman/courses-students-list.png)

---

### Creación de evaluación

![Creación de evaluación](docs/postman/evaluations-create.png)

---

### Creación de calificación

![Creación de calificación](docs/postman/grades-create.png)

---

### Actualización de observación de calificación

![Actualización de observación](docs/postman/grades-update-observation.png)

---

### Consulta de calificaciones del estudiante en un curso

![Calificaciones del estudiante en curso](docs/postman/students-course-grades.png)

---

### Consulta de promedio del estudiante en un curso

![Promedio del estudiante en curso](docs/postman/students-course-average.png)

---

## 19. Pruebas unitarias y pruebas e2e

El proyecto incluye pruebas con Jest, Supertest y MongoDB Memory Server.

Las pruebas validan:

* Funcionamiento de endpoints principales.
* Flujo académico completo.
* Registro e inicio de sesión.
* Middleware de autenticación.
* Middleware de autorización.
* Middleware de formato de respuesta.
* Casos de error.
* CRUD adicional.
* Cobertura de rutas, controladores, servicios y middlewares.

### Ejecutar pruebas

```bash
npm test
```

### Ejecutar pruebas en modo debug

```bash
npm run test:debug
```

### Resultado de pruebas

Según la ejecución realizada:

```txt
Test Suites: 6 passed, 6 total
Tests:       34 passed, 34 total
Snapshots:   0 total
```

### Cobertura general

```txt
Statements: 71.95%
Branches:   63.59%
Functions:  94.82%
Lines:      71.95%
```

### Evidencia de pruebas

![Cobertura de pruebas](docs/tests/npm-test-coverage.png)

---

## 20. Base de datos

El proyecto utiliza MongoDB como base de datos persistente y Mongoose para el modelado de objetos.

La conexión se realiza desde:

```txt
src/data/mongoConnection.js
```

La URI de conexión se configura mediante la variable de entorno:

```env
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER/NOMBRE_BASE_DATOS
```

Durante las pruebas se utiliza MongoDB Memory Server, lo cual permite ejecutar los tests sin afectar la base de datos real.

---

## 21. Documentación OpenAPI

El archivo OpenAPI del proyecto se encuentra en:

```txt
docs/openapi.yaml
```

La documentación incluye:

* Endpoints de usuarios.
* Endpoints de estudiantes.
* Endpoints de maestros.
* Endpoints de cursos.
* Endpoints de evaluaciones.
* Endpoints de calificaciones.
* Modelos de request.
* Modelos de response.
* Parámetros de ruta.
* Autenticación Bearer Token.

---

## 22. Despliegue de la API

La API puede ejecutarse localmente en:

```txt
http://localhost:3000
```

La documentación Swagger local está disponible en:

```txt
http://localhost:3000/api-docs
```

### URL pública del despliegue

Colocar aquí la URL pública cuando el proyecto esté desplegado:

```txt
https://COLOCAR-AQUI-LA-URL-DEL-DEPLOY
```

### Swagger del despliegue

```txt
https://COLOCAR-AQUI-LA-URL-DEL-DEPLOY/api-docs
```

---

## 23. Conexión a API externa

En la versión actual del proyecto, la funcionalidad principal se centra en la gestión académica interna usando MongoDB como base de datos.

Para cumplir completamente con el criterio de conexión a API externa, se intento agregar una API relacionada a mensajería SMS, la cual enviaría mensajes en caso de que un estudiante obtuviera una nota inferior a 51. Para esto se recomienda crearse una cuenta en Twilio y poner en las variables de entorno estos tres: TWILIO_ACCOUNT_SID_TEST, TWILIO_AUTH_TOKEN_TEST, TWILIO_PHONE_NUMBER_TEST

---

## 24. Estructura general de respuesta

La API responde de forma uniforme usando el middleware de formato.

### Respuesta exitosa

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Respuesta con error

```json
{
  "success": false,
  "message": "Error message",
  "errors": null
}
```

---

## 25. Alcance del proyecto

### Incluye:

* Registro e inicio de sesión de usuarios.
* Autenticación con JWT.
* Autorización por roles.
* Gestión de usuarios.
* Gestión de estudiantes.
* Gestión de maestros.
* Gestión de cursos.
* Inscripción de estudiantes en cursos.
* Gestión de evaluaciones.
* Gestión de calificaciones.
* Actualización de observaciones.
* Consulta de calificaciones por estudiante.
* Consulta de evaluaciones por curso.
* Consulta de promedio por estudiante y curso.
* Reporte académico por curso.
* Documentación Swagger/OpenAPI.
* Pruebas unitarias y e2e.
* Conexión con MongoDB.

### No incluye:

* Aplicación móvil.
* Interfaz gráfica avanzada.
* Envío real de correos electrónicos.
* Pasarela de pagos.
* Firma digital de actas.
* Generación avanzada de certificados.
* Integración directa con plataformas oficiales de la universidad.

---

## 26. Comandos importantes

| Comando | Descripción |
|---|---|
| `npm install` | Instala las dependencias del proyecto. |
| `npm start` | Ejecuta el servidor. |
| `npm run dev` | Ejecuta el servidor en modo desarrollo. |
| `npm test` | Ejecuta las pruebas con cobertura. |
| `npm run test:debug` | Ejecuta pruebas mostrando detalles de operaciones abiertas. |

---

## 27. Conclusión

El Sistema de gestión de evaluación académica de estudiantes cumple con el objetivo de administrar usuarios, roles, estudiantes, maestros, cursos, evaluaciones y calificaciones mediante una API REST.

El proyecto aplica arquitectura por capas, autenticación con JWT, autorización basada en roles, conexión a MongoDB, documentación Swagger/OpenAPI y pruebas automatizadas. Además, las capturas en Postman demuestran el funcionamiento de los endpoints principales y la cobertura de pruebas evidencia la validación del sistema.

Este backend facilita el control académico y permite que administradores, maestros y estudiantes accedan a información organizada, segura y clara sobre el rendimiento académico.