# Eliminar Usuarios Anónimos en Firebase

Este proyecto es un backend simple desplegado en **Vercel** que se encarga de eliminar periódicamente a los usuarios anónimos en tu base de datos de Firebase Authentication. Utiliza una **API Route** en Vercel que es ejecutada automáticamente utilizando **GitHub Actions**.

## Funcionalidad

El propósito de este proyecto es ejecutar un script de eliminación de usuarios anónimos a través de una API en Vercel. El script revisa los usuarios registrados en Firebase y elimina aquellos que hayan sido creados de manera anónima y no hayan iniciado sesión en los últimos 30 días.

## Arquitectura

1. **Vercel API Route**: La función principal que elimina los usuarios anónimos está implementada como una API Route en Vercel. Esta función es llamada mediante una solicitud HTTP GET.
   
2. **Firebase Admin SDK**: Usado para interactuar con Firebase Authentication y manejar la eliminación de usuarios.

3. **GitHub Actions**: Configurado para ejecutar el cron job automáticamente. Esto hace que la función se ejecute periódicamente sin intervención manual.

## Configuración

### 1. Desplegar en Vercel

Para desplegar este proyecto en Vercel, sigue estos pasos:

1. Crea una cuenta en [Vercel](https://vercel.com/).
2. Crea un nuevo proyecto y conecta tu repositorio de GitHub donde has subido este código.
3. Asegúrate de configurar las variables de entorno en Vercel para el acceso a Firebase, como el archivo de credenciales de servicio.

### 2. Variables de Entorno en Vercel

En la configuración de tu proyecto en Vercel, agrega las siguientes variables de entorno necesarias para que el **Firebase Admin SDK** funcione:

- `GOOGLE_APPLICATION_CREDENTIALS`: Debe apuntar al archivo de credenciales de Firebase.

### 3. Configuración de GitHub Actions

GitHub Actions se encarga de ejecutar el cron job automáticamente. El archivo de configuración se encuentra en `.github/workflows/delete-users.yml`.

Este archivo configura un cron job para ejecutar el script todos los días a las 2:00 AM UTC. Puedes modificar la frecuencia del cron job si es necesario.

#### Estructura del Cron Job:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Se ejecuta todos los días a las 2 AM UTC
  workflow_dispatch:  # Permite ejecutar manualmente el workflow
```

Este cron job ejecuta el script de eliminación de usuarios anónimos mediante una solicitud HTTP GET a la API de Vercel.

## Endpoints

### `GET /api/eliminar-usuarios`

Este endpoint está diseñado para ser ejecutado periódicamente para eliminar a los usuarios anónimos. La API realiza lo siguiente:

1. Obtiene todos los usuarios desde Firebase.
2. Filtra a los usuarios anónimos.
3. Elimina a aquellos que no hayan iniciado sesión en los últimos 30 días.

## Contribuciones

Si deseas contribuir a este proyecto, por favor abre un **pull request** con las modificaciones necesarias. Asegúrate de probar los cambios antes de enviarlos.

## Licencia

Este proyecto está bajo la licencia MIT. Para más detalles, consulta el archivo [LICENSE](LICENSE).

---

Gracias por utilizar este proyecto para mantener tu base de datos de Firebase limpia de usuarios anónimos.

