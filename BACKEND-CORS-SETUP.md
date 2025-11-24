# Configuración de CORS en el Backend

Para que tu frontend en Firebase pueda conectarse correctamente con tu backend en Render, necesitas actualizar la configuración de CORS.

## Actualización Requerida en el Backend

En tu archivo `server.js` (o el archivo principal de tu backend), actualiza la configuración de CORS para incluir las URLs del frontend:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:4200',           // Para desarrollo local
    'http://localhost:4201',           // Para desarrollo local (puerto alternativo)
    'https://admin-victoria-poggioli.web.app',        // Firebase Hosting URL principal
    'https://admin-victoria-poggioli.firebaseapp.com' // Firebase Hosting URL alternativa
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Verificación

Después de actualizar el backend:

1. Redeploya tu backend en Render
2. Espera a que el deployment termine (puede tardar 2-3 minutos)
3. Abre tu frontend: https://admin-victoria-poggioli.web.app
4. Abre las DevTools (F12) y ve a la pestaña "Console"
5. Si todo está bien, deberías ver los datos cargándose sin errores de CORS

## Errores Comunes

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
- **Causa**: El backend no está aceptando peticiones desde el frontend
- **Solución**: Verifica que las URLs en la configuración de CORS sean exactamente las mismas

### Error: "Failed to fetch"
- **Causa**: El backend no está respondiendo o la URL es incorrecta
- **Solución**:
  1. Verifica que el backend esté activo en Render
  2. Prueba la URL directamente: https://mv-whatsapp-backend.onrender.com/api/health
  3. Si el backend estaba "dormido", espera 30-60 segundos para que se active

### El dashboard no muestra datos
- **Causa**: La API puede estar devolviendo un formato diferente
- **Solución**:
  1. Abre DevTools (F12) → Network
  2. Recarga la página
  3. Busca la petición a `/dashboard/all`
  4. Revisa la respuesta JSON

## Testing Local

Si quieres probar la conexión localmente antes de desplegar:

```bash
# En el proyecto frontend
npm start

# Abre el navegador en http://localhost:4200
# El frontend usará environment.ts que apunta a localhost:3000
# O puedes cambiar environment.ts temporalmente para apuntar a Render
```

## Configuración Actual

**Frontend**: https://admin-victoria-poggioli.web.app
**Backend**: https://mv-whatsapp-backend.onrender.com/api

El frontend ya está configurado y desplegado con la URL correcta del backend.
