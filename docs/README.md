# 🍰 Postres Saludables “Delicioso y Sano”

**Proyecto Final – SENA Mujeres Digitales 2025**
**API Backend desarrollada con NestJS y PostgreSQL**

---

## Descripción General

**Delicioso y Sano** es una API backend creada para gestionar la venta de postres saludables, elaborados con ingredientes naturales y bajos en azúcar.
Permite registrar usuarios, manejar productos, categorías, carritos, pedidos y pagos, con autenticación JWT y control de roles.

El objetivo es ofrecer una solución digital que promueva una alimentación más consciente sin renunciar al sabor dulce.

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
| **Order**      | Pedidos generados a partir de los carritos.                     |
| **Order_detail** | Detalles de productos que conforman una orden.    |
| **Payment**       | Información del pago de cada pedido.                            |

---

## Autenticación y Roles

* **JWT** para autenticación segura.
* **Roles:**

  * **Admin:** puede gestionar todos los recursos.
  * **User:** puede registrarse, crear carritos y hacer pedidos.

---

## Rutas Principales (Endpoints)

### **Auth**

| Método | Endpoint         | Descripción                        |
| ------ | ---------------- | ---------------------------------- |
| POST   | `/auth/register` | Registrar nuevo usuario            |
| POST   | `/auth/login`    | Iniciar sesión (obtener token JWT) |
| GET    | `/auth/profile`  | Ver perfil (requiere JWT válido)   |

### **Users**

| Método | Endpoint        | Descripción                            |
| ------ | --------------- | -------------------------------------- |
| GET    | `/users`        | Listar todos los usuarios (solo Admin) |
| POST   | `/users`        | Crear usuario (solo Admin)             |
| GET    | `/users/{uuid}` | Ver usuario por UUID (autenticado)     |
| PATCH  | `/users/{uuid}` | Actualizar usuario (solo Admin)        |
| DELETE | `/users/{uuid}` | Borrado lógico de usuario (solo Admin) |

### **Credentials**

| Método | Endpoint              | Descripción                          |
| ------ | --------------------- | ------------------------------------ |
| GET    | `/credentials`        | Listar credenciales (solo Admin)     |
| POST   | `/credentials`        | Crear credencial (solo Admin)        |
| GET    | `/credentials/{uuid}` | Ver credencial por UUID (solo Admin) |
| PATCH  | `/credentials/{uuid}` | Actualizar credencial (solo Admin)   |
| DELETE | `/credentials/{uuid}` | Eliminar credencial (solo Admin)     |

### **Categories**

| Método | Endpoint             | Descripción                        |
| ------ | -------------------- | ---------------------------------- |
| GET    | `/categories`        | Listar todas las categorías        |
| POST   | `/categories`        | Crear nueva categoría (solo Admin) |
| GET    | `/categories/{uuid}` | Ver categoría por UUID             |
| PATCH  | `/categories/{uuid}` | Actualizar categoría (solo Admin)  |
| DELETE | `/categories/{uuid}` | Eliminar categoría (solo Admin)    |

### **Products**

| Método | Endpoint           | Descripción                      |
| ------ | ------------------ | -------------------------------- |
| GET    | `/products`        | Listar productos activos         |
| POST   | `/products`        | Crear producto (solo Admin)      |
| GET    | `/products/{uuid}` | Ver producto por UUID            |
| PATCH  | `/products/{uuid}` | Actualizar producto (solo Admin) |
| DELETE | `/products/{uuid}` | Eliminar producto (solo Admin)   |

### **Carts**

| Método | Endpoint           | Descripción                         |
| ------ | ------------------ | ----------------------------------- |
| GET    | `/carritos`        | Listar todos (solo Admin)           |
| POST   | `/carritos`        | Crear carrito (usuario autenticado) |
| GET    | `/carritos/{uuid}` | Ver carrito (Admin o dueño)         |
| DELETE | `/carritos/{uuid}` | Eliminar carrito (solo Admin)       |

### **Orders**

| Método | Endpoint            | Descripción                              |
| ------ | ------------------- | ---------------------------------------- |
| GET    | `/orders`           | Listar órdenes (solo Admin)              |
| GET    | `/orders/{uuid}`    | Ver orden (Admin o dueño)                |
| POST   | `/orders/from-cart` | Crear orden desde el carrito del usuario |

### **Payments**

| Método | Endpoint        | Descripción                       |
| ------ | --------------- | --------------------------------- |
| GET    | `/pagos`        | Listar pagos (solo Admin)         |
| POST   | `/pagos`        | Registrar nuevo pago (solo Admin) |
| GET    | `/pagos/{uuid}` | Ver pago por UUID (solo Admin)    |
| PATCH  | `/pagos/{uuid}` | Actualizar pago (solo Admin)      |
| DELETE | `/pagos/{uuid}` | Eliminar pago (solo Admin)        |

---

## Tecnologías Utilizadas

* **NestJS** – Framework principal
* **TypeORM + PostgreSQL** – Base de datos relacional
* **JWT & Bcrypt** – Autenticación y seguridad
* **Swagger** – Documentación de la API
* **Jest** – Pruebas unitarias
* **Render / Railway** – Despliegue del proyecto

---

## Instalación Rápida

```bash
git clone https://github.com/anamaria1215/Postres-Saludables-Delicioso-y-Sano.git

npm install
```


Ejecuta el servidor:

```bash
npm run start:dev
```

Abre Swagger:

```
http://localhost:3002/api
```

---

## Equipo de Desarrollo

**Grupo 1 – Mujeres Digitales 2025**

* Ana María Vargas Mejía 
* Angie Tatiana Alba Amado
* Norida Elena Rueda Peña
* Mónica López Bedoya
* Anellis Nicols Duarte Calderón

---

**Delicioso y Sano** combina tecnología y bienestar, ofreciendo una API sólida y segura que impulsa un negocio saludable.
Desarrollada con buenas prácticas, autenticación JWT y estructura modular, esta API refleja el aprendizaje y compromiso del equipo.
