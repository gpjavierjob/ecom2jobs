import {
  apps,
  initializeApp,
  credential as _credential,
  auth,
} from "firebase-admin";

// Inicializar Firebase Admin
if (!apps.length) {
  initializeApp({
    credential: _credential.cert(
      JSON.parse(
        Buffer.from(process.env.FIREBASE_CREDENTIALS, "base64").toString()
      )
    ),
  });
}

const auth = auth();

export default async function handler(req, res) {
  // Verificar la clave API en el header
  const apiKey = req.headers.authorization?.split(" ")[1]; // Extrae el token del header

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ error: "No autorizado" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Se requiere email y contraseña" });
  }

  try {
    // Verificar si el usuario ya existe
    let user;
    try {
      user = await auth.getUserByEmail(email);
    } catch (err) {
      if (err.code !== "auth/user-not-found") throw err;
    }

    // Crear el usuario si no existe
    if (!user) {
      user = await auth.createUser({
        email,
        password,
      });
    }

    // Asignar atributos personalizados
    await auth.setCustomUserClaims(user.uid, { admin: true });

    res.status(200).json({
      message: "Usuario administrador configurado correctamente",
      uid: user.uid,
    });
  } catch (error) {
    console.error("Error creando el usuario administrador:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
