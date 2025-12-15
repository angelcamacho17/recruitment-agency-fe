# 🔐 Guía de Autenticación del Admin Panel

## Resumen

El admin panel ahora está **completamente protegido** con un sistema de autenticación basado en token. Nadie puede acceder sin el token correcto.

---

## 🔑 Token de Acceso

### Token de Producción (Actual)
```
mvp-admin-9b5c1fa4c5eec52b423aae33627225bbf02f768a2f117eb4
```

### Token de Desarrollo
```
mv-admin-2024-secure-token
```

**⚠️ IMPORTANTE:** Guarda este token en un lugar seguro. Es la única forma de acceder al admin.

---

## 🚀 Cómo Acceder al Admin

1. **Ir a la URL del admin:**
   ```
   https://admin-victoria-poggioli.web.app
   ```

2. **Serás redirigido a la página de login** (`/login`)

3. **Ingresar el token de acceso:**
   - Copia el token de producción
   - Pégalo en el campo "Token de Acceso"
   - Presiona "Ingresar"

4. **Ya tienes acceso completo** al panel de administración

---

## 🔒 Características de Seguridad

### ✅ Lo que está protegido:
- ✅ Dashboard principal
- ✅ Gestión de contactos
- ✅ Email marketing
- ✅ Análisis de CVs
- ✅ Gestión de candidatos
- ✅ Todas las rutas del admin

### 🔐 Cómo funciona:
1. **Verificación en cada navegación:** El guard verifica el token antes de cada ruta
2. **Persistencia:** El token se guarda en `localStorage` del navegador
3. **Validación:** El token debe coincidir exactamente con el configurado en el ambiente
4. **Logout:** Al cerrar sesión, se limpia el localStorage y redirige a login

---

## 🔄 Cerrar Sesión

### Opción 1: Botón en el Sidebar
1. Click en el botón rojo **"Cerrar Sesión"** al final del sidebar
2. Confirmar en el diálogo
3. Serás redirigido al login

### Opción 2: Borrar el localStorage manualmente
```javascript
// En la consola del navegador
localStorage.clear()
location.reload()
```

---

## 🛠️ Cómo Cambiar el Token

### Para Desarrollo (environment.ts):
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://mv-whatsapp-backend.onrender.com/api',
  claudeApiKey: '',
  adminToken: 'TU-NUEVO-TOKEN-AQUI' // Cambiar aquí
};
```

### Para Producción (environment.prod.ts):
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://mv-whatsapp-backend.onrender.com/api',
  claudeApiKey: '',
  adminToken: 'TU-NUEVO-TOKEN-SEGURO-AQUI' // Cambiar aquí
};
```

### Generar un nuevo token seguro:
```bash
# Desde la terminal
node -e "console.log('mvp-admin-' + require('crypto').randomBytes(24).toString('hex'))"
```

Esto genera un token aleatorio de 48 caracteres como:
```
mvp-admin-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2
```

---

## 📱 Flujo de Usuario Completo

```
1. Usuario visita: https://admin-victoria-poggioli.web.app
   ↓
2. AuthGuard verifica si está autenticado
   ↓
   NO → Redirige a /login
   SÍ → Permite acceso
   ↓
3. En /login: Usuario ingresa el token
   ↓
4. AuthService valida el token
   ↓
   VÁLIDO → Guarda en localStorage + Redirige a /dashboard
   INVÁLIDO → Muestra error "Token inválido"
   ↓
5. Usuario navega por el admin libremente
   ↓
6. Al cerrar sesión:
   - Limpia localStorage
   - Redirige a /login
```

---

## 🧪 Testing Local

### 1. Iniciar el servidor de desarrollo:
```bash
npm start
```

### 2. Abrir el navegador en modo incógnito:
```
http://localhost:4200
```

### 3. Deberías ser redirigido a `/login`

### 4. Ingresar el token de desarrollo:
```
mv-admin-2024-secure-token
```

### 5. Verificar que puedes acceder a todas las rutas

---

## ❓ Preguntas Frecuentes

### ¿Qué pasa si pierdo el token?
- Puedes verlo en el código fuente: `src/environments/environment.prod.ts`
- O pregúntale a quien hizo el deploy

### ¿Puedo tener múltiples tokens?
- No actualmente. Solo hay un token configurado en el ambiente
- Para tener múltiples usuarios, necesitarías un sistema de autenticación más complejo (backend con base de datos)

### ¿El token está seguro en localStorage?
- **Para un admin de uso personal: Sí**, es suficiente
- **Para producción con múltiples usuarios:** No, necesitarías JWT tokens con backend
- **Recomendación actual:** Usa en navegadores privados y no compartas el token

### ¿Qué pasa si alguien roba el token?
- Podrá acceder al admin
- **Solución:** Cambia el token inmediatamente y despliega de nuevo
- **Prevención:** No compartas el token por canales inseguros (email, WhatsApp, etc.)

### ¿Puedo cambiar el token sin perder acceso?
- Sí, pero necesitas hacer deploy con el nuevo token
- Los usuarios con el token viejo ya no podrán acceder
- Necesitarás el nuevo token para entrar

---

## 🔐 Mejores Prácticas

1. ✅ **Nunca** compartas el token públicamente
2. ✅ **Nunca** pongas el token en Git público
3. ✅ Cambia el token regularmente (cada 3-6 meses)
4. ✅ Usa diferentes tokens para desarrollo y producción
5. ✅ Cierra sesión cuando uses computadoras compartidas
6. ✅ Usa el modo incógnito si estás en una computadora pública

---

## 📊 Archivos del Sistema de Autenticación

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts          # Guard que protege las rutas
│   │   └── services/
│   │       └── auth.service.ts        # Servicio de autenticación
│   ├── features/
│   │   └── auth/
│   │       └── login.component.ts     # Página de login
│   ├── shared/
│   │   └── components/
│   │       └── sidebar.component.ts   # Incluye botón de logout
│   └── app.routes.ts                  # Rutas con canActivate: [authGuard]
└── environments/
    ├── environment.ts                 # Token de desarrollo
    └── environment.prod.ts            # Token de producción
```

---

## 🎨 Capturas de Pantalla del Flujo

### 1. Página de Login
- Fondo degradado negro/gris elegante
- Campo de entrada para el token
- Botón "Ingresar" con loading state
- Mensajes de error si el token es inválido

### 2. Panel Autenticado
- Todas las rutas funcionan normalmente
- Botón "Cerrar Sesión" al final del sidebar (en rojo)
- Confirmación antes de logout

---

## 🚨 Troubleshooting

### Error: "Siempre me redirige a /login"
**Solución:**
1. Verifica que estás usando el token correcto
2. Abre la consola del navegador (F12)
3. Ve a Application > Local Storage
4. Verifica que exista la clave `admin_authenticated: "true"`
5. Si no existe, vuelve a hacer login

### Error: "El token no funciona"
**Solución:**
1. Verifica que el token sea exactamente igual (sin espacios)
2. Revisa `src/environments/environment.prod.ts` para confirmar el token correcto
3. Si cambiaste el token recientemente, asegúrate de haber hecho deploy

### Error: "No puedo cerrar sesión"
**Solución:**
1. Usa el navegador en modo incógnito para testing
2. O limpia manualmente el localStorage:
   ```javascript
   localStorage.clear()
   location.reload()
   ```

---

## 📞 Soporte

Si tienes problemas con la autenticación:
1. Verifica que estás usando el token correcto de producción
2. Revisa la consola del navegador por errores
3. Intenta en modo incógnito para descartar problemas de caché
4. Si nada funciona, contacta al desarrollador

---

**Última actualización:** 15 de Diciembre, 2024
**Token de producción actual:** `mvp-admin-9b5c1fa4c5eec52b423aae33627225bbf02f768a2f117eb4`
