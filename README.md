# FIREBASE JOBS

Este proyecto es un backend simple para desplegar en Vercel que contiene jobs útiles para una aplicación desplegada en Firebase. Jobs incluidos:

* [create-admin-user.js](#job-create-admin-userjs)
* [delete-users.js](#job-delete-usersjs)

## Desplegar en Vercel

Para desplegar este proyecto en Vercel, sigue estos pasos:

1. Crea una cuenta en [Vercel](https://vercel.com/).
2. Crea un nuevo proyecto y conecta tu repositorio de GitHub donde has subido este código.
3. Asegúrate de configurar las variables de entorno FIREBASE_CREDENTIALS y ADMIN_API_KEY utilizadas por todos los jobs.

## Job create-admin-user.js

Este job se encarga de adicionar un usuario de administración predeterminado a la aplicación Firebase. Utiliza una **API Route** que está ideada para ser ejecutada una sola vez. Si se ejecuta más de una, no creará conflictos.

### Funcionalidad

El propósito de este job es ejecutar un script de creación del usuario de administración predeterminado a través de una API. El script revisa si el usuario existe y si no es así, crea uno nuevo con las credenciales proporcionadas. Luego adiciona al usuario el token `admin` con valor `true`.

### Arquitectura

1. **API Route**: La función principal que adiciona el usuario de administración está implementada como una API Route. Esta función es llamada mediante una solicitud HTTP POST.
   
2. **Firebase Admin SDK**: Usado para interactuar con Firebase Authentication y manejar la creación del usuario y el token que lo identificará como administrador.

3. **GitHub Actions**: Configurado para permitir ejecutar el job de manera manual.

### Configuración

#### 1. Variables de Entorno en Vercel

En la configuración de tu proyecto en Vercel, agrega las siguientes variables de entorno necesarias para que el **Firebase Admin SDK** funcione:

- `FIREBASE_CREDENTIALS`: Debe almacenar en código base64 el contenido del archivo de credenciales de Firebase.
- `ADMIN_API_KEY`: Debe contener la misma clave que la variable secret correspondiente del repositorio desde donde se ejecuta este proyecto.

#### 2. Configuración de GitHub Actions

GitHub Actions se encarga de permitir la ejecución del job. El archivo de configuración se encuentra en `.github/workflows/create-admin-user.yml`.

Asegurese de crear la action secret `ADMIN_API_KEY`. Debe contener una clave que permitirá establecer la conexión con la API de Vercel de manera segura. En Vercel deberá existir una variable de entorno de igual nombre y valor.

### Estructura del Job:

```yaml
on:
  workflow_dispatch: # Solo ejecución manual
```

Este job ejecuta el script de eliminación de usuarios anónimos mediante una solicitud HTTP POST a la API de Vercel.

### Endpoint

 `GET /api/create-admin-user`

La API realiza lo siguiente:

1. Verifica si existe el usuario con las credenciales proporcionadas. Si no existe, lo crea.
2. Adiciona al usuario el token que lo identifica como administrador.

## Job delete-users.js

Este job se encarga de eliminar periódicamente a los usuarios anónimos en tu base de datos de Firebase Authentication. Utiliza una **API Route** que es ejecutada automáticamente utilizando **GitHub Actions**.

### Funcionalidad

El propósito de este proyecto es ejecutar un script de eliminación de usuarios anónimos a través de una API. El script revisa los usuarios registrados en Firebase y elimina aquellos que hayan sido creados de manera anónima y no hayan iniciado sesión en los últimos 30 días.

### Arquitectura

1. **API Route**: La función principal que elimina los usuarios anónimos está implementada como una API Route. Esta función es llamada mediante una solicitud HTTP GET.
   
2. **Firebase Admin SDK**: Usado para interactuar con Firebase Authentication y manejar la eliminación de usuarios.

3. **GitHub Actions**: Configurado para ejecutar el cron job automáticamente. Esto hace que la función se ejecute periódicamente sin intervención manual.

### Configuración

#### 1. Variables de Entorno en Vercel

En la configuración de tu proyecto en Vercel, agrega las siguientes variables de entorno necesarias para que el **Firebase Admin SDK** funcione:

- `FIREBASE_CREDENTIALS`: Debe apuntar al archivo de credenciales de Firebase o almacenar todo su contenido en código base64.
- `ADMIN_API_KEY`: Debe contener la misma clave que la variable secret correspondiente del repositorio desde donde se ejecuta este proyecto.

#### 2. Configuración de GitHub Actions

GitHub Actions se encarga de ejecutar el cron job automáticamente. El archivo de configuración se encuentra en `.github/workflows/delete-users.yml`.

Este archivo configura un cron job para ejecutar el script todos los días a las 2:00 AM UTC. Puedes modificar la frecuencia del cron job si es necesario.

Asegurese de crear la action secret `ADMIN_API_KEY`. Debe contener una clave que permitirá establecer la conexión con la API de Vercel de manera segura. En Vercel deberá existir una variable de entorno de igual nombre y valor.

### Estructura del Cron Job:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Se ejecuta todos los días a las 2 AM UTC
  workflow_dispatch:  # Permite ejecutar manualmente el workflow
```

Este cron job ejecuta el script de eliminación de usuarios anónimos mediante una solicitud HTTP GET a la API de Vercel.

### Endpoint

 `GET /api/delete-users`
 
Este endpoint está diseñado para ser ejecutado periódicamente para eliminar a los usuarios anónimos. La API realiza lo siguiente:

1. Obtiene todos los usuarios desde Firebase.
2. Filtra a los usuarios anónimos.
3. Elimina a aquellos que no hayan iniciado sesión en los últimos 30 días.

## Contribuciones

Si deseas contribuir a este proyecto, por favor abre un **pull request** con las modificaciones necesarias. Asegúrate de probar los cambios antes de enviarlos.

## Licencia

Este proyecto está bajo la licencia MIT. Para más detalles, consulta el archivo [LICENSE](LICENSE).

---

Gracias por utilizar este proyecto.
