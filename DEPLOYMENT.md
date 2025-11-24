# WhatsApp Admin Dashboard - Deployment Guide

## Despliegue Exitoso

Tu aplicación Angular ha sido desplegada exitosamente en Firebase Hosting.

**URL de la aplicación**: https://admin-victoria-poggioli.web.app

---

## Configuración de la API Backend

IMPORTANTE: Actualmente la aplicación está configurada para conectarse a:
```
http://localhost:3000/api
```

Para conectar con tu API en producción (Render), necesitas actualizar el archivo de environment:

### Paso 1: Actualizar la URL de la API

Edita el archivo: `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://TU-URL-DE-RENDER.onrender.com/api'  // Reemplaza con tu URL real de Render
};
```

### Paso 2: Configurar CORS en el Backend

Asegúrate de que tu backend (Render) acepte peticiones desde:
- https://admin-victoria-poggioli.web.app
- https://admin-victoria-poggioli.firebaseapp.com

En tu archivo `server.js` del backend, actualiza la configuración de CORS:

```javascript
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://admin-victoria-poggioli.web.app',
    'https://admin-victoria-poggioli.firebaseapp.com'
  ],
  credentials: true
}));
```

### Paso 3: Reconstruir y Redesplegar

Después de actualizar la URL:

```bash
npm run build
firebase deploy --only hosting
```

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── services/        # ApiService, DashboardService, ContactsService
│   │   └── models/          # TypeScript interfaces
│   ├── features/
│   │   ├── dashboard/       # Dashboard principal con gráficas
│   │   └── contacts/        # Lista y detalle de contactos
│   └── shared/
│       └── components/      # Navbar, Sidebar, Loading
└── environments/            # Configuración de API URLs
```

---

## Funcionalidades Implementadas

### Dashboard
- Tarjetas de estadísticas (Total contactos, Mensajes, Tasa de recurrencia)
- Gráfica de actividad diaria (últimos 30 días)
- Top 10 tags más usados
- Mensajes recientes (últimos 20)
- Auto-refresh cada 30 segundos

### Contactos
- Lista paginada de contactos (50 por página)
- Búsqueda por teléfono y tags
- Filtros por estado (active, inactive, blocked)
- Ver detalle de contacto
- Historial completo de mensajes
- Agregar tags a contactos
- Cambiar estado de contactos

---

## Comandos Útiles

### Desarrollo Local
```bash
npm start                 # Iniciar servidor de desarrollo (puerto 4200)
npm run build             # Build para producción
npm test                  # Ejecutar tests
```

### Firebase
```bash
firebase serve            # Preview local antes de deploy
firebase deploy           # Desplegar a producción
firebase hosting:channel:create preview  # Crear preview channel
```

---

## Endpoints de la API

### Dashboard
- GET /dashboard/all - Todas las métricas en una sola llamada
- GET /dashboard/overview - Estadísticas generales
- GET /dashboard/daily-activity - Actividad por día
- GET /dashboard/top-tags - Tags más usados
- GET /dashboard/top-contacts?limit=10 - Contactos más activos
- GET /dashboard/recent-messages?limit=20 - Mensajes recientes

### Contactos
- GET /contacts?page=1&limit=50&status=active - Lista paginada
- POST /contacts/search - Búsqueda con filtros
- GET /contacts/:id/history - Historial de mensajes
- PATCH /contacts/:id/status - Actualizar estado
- POST /contacts/:id/tags - Agregar tags

---

## Solución de Problemas

### La API no responde
1. Verifica que el backend en Render esté activo
2. Revisa la URL en `environment.prod.ts`
3. Verifica la configuración de CORS
4. Abre las DevTools del navegador (F12) y revisa la consola

### Error "First request may take 30-60 seconds"
- El tier gratuito de Render "duerme" después de 15 min sin uso
- La primera petición puede tardar en despertar el servicio

### Estilos no se ven correctamente
1. Limpia el caché del navegador (Ctrl+Shift+R)
2. Verifica que TailwindCSS esté compilando correctamente
3. Ejecuta: `npm run build` y revisa que no haya errores

---

## Próximos Pasos Recomendados

1. Actualizar `src/environments/environment.prod.ts` con tu URL de Render
2. Configurar CORS en el backend
3. Redesplegar con `firebase deploy`
4. Probar todas las funcionalidades en producción
5. (Opcional) Configurar un dominio personalizado

---

## Recursos

- [Documentación de Angular](https://angular.io/docs)
- [Documentación de Firebase Hosting](https://firebase.google.com/docs/hosting)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Chart.js](https://www.chartjs.org/docs/latest/)

---

## Contacto y Soporte

Si encuentras algún problema, revisa:
1. Logs de Firebase: https://console.firebase.google.com/project/admin-victoria-poggioli/hosting
2. Logs de Render: Dashboard de tu servicio backend
3. Consola del navegador (F12) para errores del frontend
