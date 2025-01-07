import { apps, initializeApp, credential as _credential, auth } from 'firebase-admin';

// Inicializar Firebase Admin SDK
if (!apps.length) {
  initializeApp({
    credential: _credential.applicationDefault(),
  });
}

// Función para eliminar usuarios anónimos
async function deleteAnonymousUsers() {
  const currentTime = new Date().getTime();
  const users = await auth().listUsers();
  const promises = users.users.map(async (user) => {
    if (user.providerData.length === 0) {
      const lastSignInTime = user.metadata.lastSignInTime;
      if (currentTime - new Date(lastSignInTime).getTime() > 30 * 24 * 60 * 60 * 1000) {
        // Eliminar el usuario si no ha iniciado sesión en 30 días
        await auth().deleteUser(user.uid);
        console.log(`Usuario anónimo con UID ${user.uid} eliminado.`);
      }
    }
  });
  await Promise.all(promises);
}

// API Route de Vercel
export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      await deleteAnonymousUsers();
      res.status(200).send('Usuarios anónimos eliminados exitosamente.');
    } catch (error) {
      console.error('Error al eliminar usuarios:', error);
      res.status(500).send('Hubo un error al eliminar los usuarios.');
    }
  } else {
    res.status(405).send('Método no permitido');
  }
};
