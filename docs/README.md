# 🍰 Postres Saludables “Delicioso y Sano”

**Proyecto Final – SENA Mujeres Digitales 2025**
**API Backend desarrollada con NestJS, TypeOrm y PostgreSQL**

---

## Descripción General

**Delicioso y Sano** es una API backend creada para gestionar la venta de postres saludables, elaborados con ingredientes naturales y bajos en azúcar.
Permite registrar usuarios, manejar productos, categorías, carritos, pedidos, pagos y domicilios, con autenticación JWT y control de roles.

Se trata de un API que contribuye tanto al bienestar de las personas como al desarrollo económico de la comunidad, integrando salud, sabor y gestión empresarial en una misma solución.

## Objetivo del API

El **objetivo** es ofrecer una solución digital que promueva una alimentación más consciente sin renunciar al sabor dulce. A la vez que facilita el acceso a postres saludables, el API también apoya la economía local, ya que permite al pequeño y mediano negocio gestionar de manera más eficiente sus procesos de venta, pedidos y control de inventario.

De esta forma, no solo se impulsa un estilo de vida más equilibrado para los consumidores, sino que se fortalece la sostenibilidad de los emprendimientos locales, brindándoles herramientas tecnológicas que optimizan su operación, mejoran la experiencia del cliente y aumentan su competitividad en el mercado.

---

## Idea de Negocio

**Título:** Postres Saludables “Delicioso y Sano”

**Propósito:** Brindar postres nutritivos y deliciosos elaborados con harinas integrales, endulzantes naturales y frutas frescas.

**Público objetivo:** Personas con restricciones de azúcar, deportistas y familias que buscan opciones más saludables.

---

## Entidades Principales

| Entidad         | Descripción                                                     |
| --------------- | --------------------------------------------------------------- |
| **User**       | Usuarios registrados (clientes y administradores).              |
| **Credential** | Maneja el acceso y contraseñas cifradas.                        |
| **Category**  | Agrupa los postres por tipo (brownies, galletas, mousse, etc.). |
| **Product**    | Información de los postres saludables.                          |
| **Cart**    | Carritos de compra por usuario.                                 |
| **Cart_detail**   | Se refiere a los productos que componen un carrito al ser llenado o manipulado.   |
| **Order**      | Pedidos generados a partir de los carritos.                     |
| **Order_detail** | Detalles de productos que conforman una orden.    |
| **Payment**       | Información y gestión del pago de cada pedido.                            |
| **Delivery** | Corresponde a la gestión administrativa de los domicilios locales de los pedidos.  |


---

## Autenticación y Roles

* **JWT** para autenticación segura.
* **Roles:**

  * **Admin:** puede gestionar todos los recursos.
  * **User:** puede registrarse, crear carritos y hacer pedidos.

---

## Rutas Principales (Endpoints)

### **Auth (Registro y Autenticación)**

| Método | Endpoint        | Descripción                                                                 |
|--------|-----------------|-----------------------------------------------------------------------------|
| POST   | `/auth/sign-up` | Registrar un nuevo usuario. Crea credenciales y perfil asociado. **PÚBLICA** |
| POST   | `/auth/login`   | Iniciar sesión. Valida credenciales y retorna un token JWT. **PÚBLICA**      |

### **Credentials (Gestión de credenciales de usuarios)**

Todas las rutas requieren autenticación con **JWT** y están protegidas por **JwtAuthGuard** y **RolesGuard**.  
Dependiendo del rol (ADMIN o USER) se habilitan diferentes acciones.

| Método | Endpoint                        | Descripción                                                                 | Roles permitidos       |
|--------|---------------------------------|-----------------------------------------------------------------------------|------------------------|
| GET    | `/credentials/all`              | Listar todas las credenciales (activas e inactivas). Permite filtrar por `username` vía query param. | **ADMIN**                  |
| GET    | `/credentials/:uuid`            | Obtener una credencial por su UUID.                                         | **ADMIN**                  |
| PUT    | `/credentials/change-username/:uuid` | Actualizar el nombre de usuario (solo el propietario de la cuenta).         | **ADMIN, USER**            |
| PATCH  | `/credentials/change-password/:uuid` | Cambiar la contraseña personal (solo el propietario de la cuenta).          | **ADMIN, USER**            |
| DELETE | `/credentials/desactivate/:uuid` | Desactivar una credencial y su perfil asociado (soft delete). Admin cualquiera. User la propia.               | **ADMIN, USER**            |
| PUT    | `/credentials/activate/:uuid`   | Reactivar una credencial previamente desactivada junto con su perfil.       | **ADMIN**                  |
| PUT    | `/credentials/change-role/:uuid`| Cambiar el rol de un usuario (User ↔ Admin).                                | **ADMIN**                 |

### **Users (Gestión de perfiles de usuario)**

Todas las rutas requieren autenticación con **JWT** y están protegidas por **JwtAuthGuard** y **RolesGuard**.  
Dependiendo del rol (ADMIN o USER) se habilitan diferentes acciones.

| Método | Endpoint                  | Descripción                                                                 | Roles permitidos       |
|--------|---------------------------|-----------------------------------------------------------------------------|------------------------|
| GET    | `/users/all`              | Listar todos los usuarios (activos e inactivos). Permite filtrar por `name` y `lastName`. | **ADMIN**                  |
| GET    | `/users/find/:uuid`       | Obtener un usuario por su UUID.                                             | **ADMIN**                  |
| GET    | `/users/my-profile`       | Ver el perfil del usuario autenticado.                                      | **ADMIN, USER**            |
| PUT    | `/users/update-my-profile`| Actualizar datos personales básicos del usuario autenticado.                | **ADMIN, USER**            |

### **Categories (Gestión de categorías de productos)**

Este módulo permite gestionar las categorías de productos.  
Algunas rutas son **públicas** y otras requieren autenticación con **JWT** y rol **ADMIN**.

| Método | Endpoint              | Descripción                                                                 | Roles permitidos |
|--------|-----------------------|-----------------------------------------------------------------------------|------------------|
| GET    | `/categories/all`         | Listar todas las categorías disponibles.                                    | **PÚBLICA**          |
| GET    | `/categories/:uuid`   | Obtener una categoría específica por su UUID.                               | **PÚBLICA**        |
| POST   | `/categories/new`     | Crear una nueva categoría.                                                  | **ADMIN**            |
| PATCH  | `/categories/update/:uuid`   | Actualizar una categoría existente por su UUID.                             | **ADMIN**            |
| DELETE | `/categories/delete/:uuid`   | Eliminar una categoría existente por su UUID.                               | **ADMIN**            |


### **Products (Gestión de productos)**

Este módulo permite gestionar los productos del sistema.  
Algunas rutas son **públicas** y otras requieren autenticación con **JWT** y rol **ADMIN**.

| Método | Endpoint                  | Descripción                                                                 | Roles permitidos |
|--------|---------------------------|-----------------------------------------------------------------------------|------------------|
| GET    | `/products/all`           | Listar todos los productos activos.                                         | **PÚBLICA**          |
| GET    | `/products/:uuid`         | Obtener un producto específico por su UUID.                                 | **PÚBLICA**          |
| POST   | `/products/create`        | Crear un nuevo producto.                                                    | **ADMIN**            |
| PATCH  | `/products/update/:uuid`  | Actualizar un producto existente por su UUID.                               | **ADMIN**            |
| DELETE | `/products/delete/:uuid`  | Eliminar un producto (borrado lógico) por su UUID.                          | **ADMIN**            |

### **Cart (Gestión de carritos)**

Este módulo permite gestionar los carritos de compra del sistema.  
Todas las rutas requieren autenticación con **JWT** y rol específico (**USER** o **ADMIN**).

| Método | Endpoint      | Descripción                                                                 | Roles permitidos |
|--------|---------------|-----------------------------------------------------------------------------|------------------|
| GET    | `/cart/get`   | Obtener el carrito activo del usuario. Si no existe, se crea automáticamente. | USER             |
| DELETE | `/cart/empty` | Vaciar el carrito activo del usuario.                                        | USER             |
| GET    | `/cart/all`   | Listar todos los carritos existentes en el sistema.                         | ADMIN            |
| GET    | `/cart/:uuid` | Obtener los detalles de un carrito específico mediante su UUID.              | ADMIN            |

### **Cart Details (Gestión de detalles del carrito)**

Este módulo permite gestionar los productos dentro del carrito activo del usuario.  
Todas las rutas requieren autenticación con **JWT** y rol **USER**.

| Método | Endpoint                                      | Descripción                                                                 | Roles permitidos |
|--------|-----------------------------------------------|-----------------------------------------------------------------------------|------------------|
| POST   | `/cart-details/add-product`                   | Agregar un producto al carrito activo del usuario.                          | USER             |
| PUT    | `/cart-details/update-product-quantity/:uuid` | Actualizar la cantidad de un producto en el carrito activo mediante su UUID. | USER             |
| DELETE | `/cart-details/delete-product/:uuid`          | Eliminar un producto del carrito activo mediante su UUID.                   | USER             |


### **Orders (Gestión de órdenes de compra)**

Este módulo permite gestionar las órdenes de compra del sistema.  
Todas las rutas requieren autenticación con **JWT** y rol específico (**USER** o **ADMIN**).

| Método | Endpoint                     | Descripción                                                                 | Roles permitidos |
|--------|-------------------------------|-----------------------------------------------------------------------------|------------------|
| GET    | `/orders/all`                 | Listar todas las órdenes existentes en el sistema.                          | **ADMIN**            |
| PUT    | `/orders/update-status/:uuid` | Actualizar el estado de una orden mediante su UUID.                         | **ADMIN**            |
| DELETE | `/orders/delete/:uuid`        | Eliminar una orden (soft delete) mediante su UUID.                          | **ADMIN**            |
| POST   | `/orders/create`              | Crear una nueva orden a partir del carrito activo del usuario.              | **USER**             |
| GET    | `/orders/history`             | Ver el historial de órdenes del usuario autenticado.                        | **USER**             |
| PUT    | `/orders/cancel/:uuid`        | Cancelar una orden del usuario (solo si aún no tiene domicilio registrado). | **USER**             |
| GET    | `/orders/:uuid`               | Obtener una orden específica mediante su UUID.                              | **ADMIN, USER**      |

### **Order Details (Gestión de detalles de la orden)**

Este módulo permite consultar los detalles que componen una orden específica.  
Todas las rutas requieren autenticación con **JWT** y rol específico (**USER** o **ADMIN**).

| Método | Endpoint                  | Descripción                                                                 | Roles permitidos |
|--------|---------------------------|-----------------------------------------------------------------------------|------------------|
| GET    | `/order-details/admin/:uuid` | Ver todos los detalles de una orden específica mediante su UUID.             | **ADMIN**            |
| GET    | `/order-details/user/:uuid`  | Ver todos los detalles de una orden propia mediante su UUID.                 | **USER**             |

### **Payments (Gestión de pagos)**

Este módulo permite gestionar los pagos del sistema.  
Todas las rutas requieren autenticación con **JWT** y rol específico (**USER** o **ADMIN**).

| Método | Endpoint                     | Descripción                                                                 | Roles permitidos |
|--------|-------------------------------|-----------------------------------------------------------------------------|------------------|
| GET    | `/payments/all`               | Listar todos los pagos registrados en el sistema.                           | **ADMIN**            |
| PUT    | `/payments/confirm/:uuid`     | Confirmar un pago existente mediante su UUID.                               | **ADMIN**            |
| PUT    | `/payments/update-status/:uuid` | Actualizar manualmente el estado de un pago mediante su UUID.                | **ADMIN**            |
| DELETE | `/payments/delete/:uuid`      | Marcar un pago como fallido (soft delete).                                  | **ADMIN**            |
| POST   | `/payments/checkout`          | Registrar un nuevo pago con estado pendiente mientras se confirma.          | **USER**             |
| GET    | `/payments/:uuid`             | Obtener un pago específico mediante su UUID.                                | **ADMIN, USER**      |

### Deliveries (Gestión de domicilios)

Este módulo permite gestionar los domicilios asociados a las órdenes del sistema.  
Todas las rutas requieren autenticación con **JWT** y rol específico (**USER** o **ADMIN**).

| Método | Endpoint                        | Descripción                                                                 | Roles permitidos |
|--------|---------------------------------|-----------------------------------------------------------------------------|------------------|
| GET    | `/deliveries/all`               | Listar todos los domicilios registrados en el sistema.                      | **ADMIN**            |
| POST   | `/deliveries/create`            | Registrar un nuevo domicilio asociado a una orden.                          | **ADMIN**            |
| PUT    | `/deliveries/update-status/:uuid` | Actualizar el estado de un domicilio mediante su UUID.                       | **ADMIN**            |
| GET    | `/deliveries/:uuid`             | Obtener un domicilio específico mediante su UUID.                           | **ADMIN, USER**      |

---

## Tecnologías Utilizadas

* **NestJS** – Framework principal
* **TypeORM + PostgreSQL** – Base de datos relacional
* **JWT & Bcrypt** – Autenticación y seguridad
* **Swagger** – Documentación de la API
* **Jest** – Pruebas unitarias
* **Render** – Despliegue del proyecto

---

## Instalación Rápida

## Instrucciones para ejecutar la API localmente

**1. Clonar el repositorio**

```bash
git clone https://github.com/anamaria1215/Postres-Saludables-Deliciosos-y-Sanos.git
```

**2. Instalar dependencias**

Tener **Node.js** y **npm** instalados para ejecutar:

```bash
npm install
```

**3. Configurar variables de entorno en el archivo .env**

*La explicación de las variables requeridas se encuentran en la siguiente sección.*


**3. Ejecutar el servidor**

```bash
npm run start:dev
```

**4. Abrir API en Swagger**

```
http://localhost:3002/api

```

---

## Variables de entorno requeridas


Antes de iniciar la aplicación, se deben definir las siguientes variables de entorno en el archivo `.env`:

```env
DB_NAME=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
JWT_EXPIRES_IN=
```

### Descripción de cada variable:


**DB_NAME** → Nombre de la base de datos PostgreSQL.

**DB_HOST** → Dirección del servidor donde corre la base de datos (ejemplo: localhost).

**DB_PORT** → Puerto de conexión de PostgreSQL (por defecto suele ser 5432).

**DB_USERNAME** → Usuario de la base de datos PostgreSQL.

**DB_PASSWORD** → Contraseña del usuario de PostgreSQL.

**JWT_SECRET** → Clave secreta usada para firmar los tokens JWT.

**JWT_EXPIRES_IN** → Tiempo de expiración del token JWT (ejemplo: 1h).

---


## Despliegue en Render

La API está desplegada en **Render** y disponible en el siguiente enlace:

🔗 https://postres-deliciosos-y-sanos.onrender.com/api

---

## Pruebas Unitarias y Evidencias

El proyecto cuenta con una amplia cobertura de pruebas unitarias implementadas con Jest y el módulo de testing de NestJS.

## Módulos funcionales

Cada módulo principal del sistema cuenta con pruebas unitarias tanto para su **Controller** como para su **Service**:


| Módulo       | Pruebas en Controller | Pruebas en Service |
|--------------|------------------------|--------------------|
| **User**     | ✔️                     | ✔️                 |
| **Credential** | ✔️                   | ✔️                 |
| **Products** | ✔️                     | ✔️                 |
| **Categories** | ✔️                   | ✔️                 |
| **Cart**     | ✔️                     | ✔️                 |
| **CartDetail** | ✔️                   | ✔️                 |
| **Order**    | ✔️                     | ✔️                 |
| **OrderDetail** | ✔️                  | ✔️                 |
| **Payment**  | ✔️                     | ✔️                 |
| **Delivery** | ✔️                     | ✔️                 |



En cada caso se validan los flujos básicos (creación, consulta, actualización, eliminación) y las excepciones correspondientes, asegurando que la lógica de negocio y las rutas estén correctamente implementadas.

## Seguridad, registro, autenticación y otros componentes

Además de los módulos funcionales, se implementaron pruebas específicas para los siguientes componentes:

| Componente                | Descripción de las pruebas                                                                 |
|----------------------------|---------------------------------------------------------------------------------------------|
| **Auth (registro y autenticación)** | Validación de creación de credenciales y perfiles asociados, login y generación de tokens JWT. |
| **JwtAuthGuard**           | Validación del acceso mediante tokens JWT.                                                  |
| **RolesGuard**             | Verificación de roles y permisos en los endpoints.                                          |
| **AppController y AppService** | Pruebas del método `getHello()` que genera el mensaje de bienvenida.                     |
| **InitialDataLoader**      | Validación de la precarga de datos iniciales en el AppService, con uso de archivos JSON y su correcta inserción en la base de datos mockeada. |

## Resultado de la ejecución

Al ejecutar los tests con:

```bash
npm run test
```

Se obtuvo el siguiente **resultado** (ejemplo):

```bash
  ...
Test Suites: 28 passed, 28 total
Tests:       200 passed, 200 total
Snapshots:   0 total
```

Todos los casos de prueba se ejecutaron correctamente, confirmando el funcionamiento esperado de los controladores, servicios, guards, módulo de autenticación y componentes de inicialización.

---

## Equipo de Desarrollo

| Integrante                         | Rol                                                             |
| ---------------------------------- | --------------------------------------------------------------- |
| **Ana María Vargas Mejía**         | **Lead Backend Developer / DevOps**                             |
| **Mónica López Bedoya**            | **Backend Developer / QA Engineer**                             |
| **Angie Tatiana Alba Amado**       | **Junior Backend Developer / Business Research & Presentation** |
| **Anellis Nicols Duarte Calderón** | **Junior Backend Developer / Business Research & Presentation** |
| **Norida Elena Rueda Peña**        | **Junior Backend Developer / Business Research & Presentation** |


---

**Delicioso y Sano** combina tecnología y bienestar, ofreciendo una API sólida y segura que impulsa un negocio saludable.
Desarrollada con buenas prácticas, autenticación JWT y estructura modular, esta API refleja el aprendizaje y compromiso del equipo.
