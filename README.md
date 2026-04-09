# Login CRUD

App con **registro / login** y **CRUD de tareas**. Backend en **Node.js (Express + MongoDB)** y frontend en **React (Vite)**. La API usa **JWT en cookie**; las rutas de tareas solo responden si el usuario está autenticado.

## Requisitos

- Node.js  
- MongoDB (local o Atlas)

## Instalación

```bash
npm install
cd client && npm install && cd ..
```

## Configuración

En la raíz del proyecto, crea un archivo `.env` con `MONGO_URI`:

**Local:**

```env
MONGO_URI=mongodb://127.0.0.1:27017/login_crud
```

**MongoDB Atlas** (sustituye la contraseña y el nombre de la base; sin `< >`):

```env
MONGO_URI=mongodb+srv://admin:TU_CONTRASEÑA@clusterudla01.2tuipeo.mongodb.net/login_crud?retryWrites=true&w=majority
```

- Donde pone `TU_CONTRASEÑA`, pon la contraseña del usuario de la base (la que definiste en Atlas, no el texto literal `<db_password>`).
- Antes del `?` va el **nombre de la base** (ej. `login_crud`); puedes usar el que quieras.
- Si la contraseña tiene caracteres especiales (`@`, `#`, `/`, etc.), [codifícala para URL](https://www.urlencoder.org/) o cámbiala en Atlas por una más simple para desarrollo.

## Cómo ejecutarlo

Abre **dos terminales**:

1. **API** (puerto `4000`), en la raíz:

   ```bash
   npm run dev
   ```

2. **React**, en la carpeta `client`:

   ```bash
   npm run dev
   ```

Entra en la URL que muestre Vite (suele ser `http://localhost:5173`). Si el puerto del front no es 5173 ni 5174, añade esa URL en `cors` en `src/app.js`.

## Estructura rápida

- `src/` → servidor Express (rutas, controladores, modelos)  
- `client/src/` → interfaz React  

## Notas

- Sin sesión válida, el cliente redirige a `/login` y la API devuelve error si se llaman rutas de tareas sin token.  
- Cliente: `npm run build` en `client` para generar el build de producción.
