# 🔐 Configuración Segura de API Key de Claude

## ⚠️ IMPORTANTE - PRIMERO REVOCA LA API KEY EXPUESTA

**Antes de continuar, DEBES hacer esto:**

1. Ve a [console.anthropic.com](https://console.anthropic.com/)
2. Inicia sesión
3. Ve a "API Keys"
4. **Revoca/elimina** la API key que compartiste públicamente
5. **Crea una nueva** API key
6. **Guárdala en un lugar seguro** (nunca la compartas en chat, email, código, etc.)

---

## ✅ Configuración Completada

Ya se configuró el proyecto para usar variables de entorno locales de forma segura:

### Archivos Creados/Modificados:

1. ✅ `src/environments/environment.local.ts` - Tu archivo local (NO se sube a Git)
2. ✅ `.gitignore` - Actualizado para excluir archivos con secretos
3. ✅ `angular.json` - Configuración "local" agregada
4. ✅ `package.json` - Scripts nuevos agregados
5. ✅ Componente actualizado - Auto-carga la API key del environment

---

## 🚀 Cómo Usar

### Paso 1: Configura tu API Key (solo una vez)

Edita el archivo: `src/environments/environment.local.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://mv-whatsapp-backend.onrender.com/api',
  claudeApiKey: 'sk-ant-api03-TU_NUEVA_API_KEY_AQUI' // <-- Pega tu NUEVA API key aquí
};
```

**IMPORTANTE**:
- Este archivo está en `.gitignore` y NUNCA se subirá a Git
- Es seguro poner tu API key aquí
- Solo existe en tu máquina local

### Paso 2: Inicia la app con configuración local

Usa el nuevo comando:

```bash
npm run start:local
```

O si prefieres el comando normal (sin API key pre-cargada):

```bash
npm start
```

### Paso 3: Verifica que funcione

1. Ve a [http://localhost:4200/cv-analysis](http://localhost:4200/cv-analysis)
2. Si usaste `npm run start:local`, verás "✓ API key configurada" en verde
3. Si no, puedes ingresar la API key manualmente en la interfaz

---

## 📋 Scripts Disponibles

| Comando | Descripción | API Key |
|---------|-------------|---------|
| `npm start` | Desarrollo normal | Manual (escribes en UI) |
| `npm run start:local` | Desarrollo con API key | Auto-cargada desde env |
| `npm run build` | Build producción | Sin API key |
| `npm run build:local` | Build con API key local | Auto-cargada desde env |

---

## 🔒 Seguridad - Confirmación

### ✅ Lo que SÍ está protegido:

- ✅ `environment.local.ts` está en `.gitignore`
- ✅ La API key NO se incluye en el código fuente
- ✅ La API key NO se sube a Git
- ✅ La API key NO está en producción
- ✅ Solo existe en tu máquina local

### ❌ Lo que NO debes hacer:

- ❌ NO edites `environment.ts` o `environment.prod.ts` con tu API key
- ❌ NO compartas el archivo `environment.local.ts`
- ❌ NO hagas commit de `environment.local.ts`
- ❌ NO compartas tu API key en ningún lado (chat, email, código)
- ❌ NO uses `git add -A` sin revisar qué archivos estás subiendo

---

## 🧪 Verificación de Seguridad

Para verificar que tu API key NO se subirá a Git:

```bash
# Ver qué archivos se subirían a Git
git status

# Ver archivos ignorados
git status --ignored

# Verificar que environment.local.ts aparece como ignored
git check-ignore -v src/environments/environment.local.ts
```

Deberías ver algo como:
```
.gitignore:45:/src/environments/environment.local.ts	src/environments/environment.local.ts
```

---

## 🔄 Para Otros Desarrolladores del Equipo

Si otro desarrollador clona el proyecto:

1. NO tendrá tu `environment.local.ts` (porque está en .gitignore)
2. Debe crear su propio `environment.local.ts`
3. Debe obtener su propia API key de Claude
4. Debe seguir estos mismos pasos

**Archivo template para compartir** (sin la API key):

```typescript
// src/environments/environment.local.ts.template
export const environment = {
  production: false,
  apiUrl: 'https://mv-whatsapp-backend.onrender.com/api',
  claudeApiKey: '' // <-- Cada desarrollador pone su propia API key aquí
};
```

---

## 📦 Para Producción

En producción, las API keys se deben manejar de forma diferente:

### Opciones:

1. **Variables de entorno del servidor** (recomendado)
2. **Secrets management** (AWS Secrets Manager, Google Secret Manager, etc.)
3. **Backend proxy** - El frontend llama a tu backend, y el backend llama a Claude

**NUNCA pongas API keys en el código de producción que se despliega al cliente.**

---

## 🆘 Troubleshooting

### "No veo mi API key cargada"

- Verifica que usaste `npm run start:local` (no `npm start`)
- Verifica que el archivo sea `environment.local.ts` (no `.txt`, no `.js`)
- Verifica que la ruta sea correcta: `src/environments/environment.local.ts`
- Reinicia el servidor después de editar el archivo

### "Git está intentando subir environment.local.ts"

```bash
# Asegúrate de que está en .gitignore
cat .gitignore | grep environment.local

# Si ya lo agregaste por error, remuévelo del staging
git reset HEAD src/environments/environment.local.ts

# Añádelo a .gitignore si no está
echo "/src/environments/environment.local.ts" >> .gitignore
```

### "La API key no funciona"

1. Verifica que creaste una NUEVA API key (no uses la que compartiste)
2. Verifica que tenga el formato correcto: `sk-ant-api03-...`
3. Verifica que tengas créditos en tu cuenta de Anthropic
4. Revisa la consola del navegador (F12) para ver el error exacto

---

## 📚 Recursos

- [Anthropic Console](https://console.anthropic.com/) - Obtén tu API key
- [Anthropic Pricing](https://www.anthropic.com/pricing) - Costos de la API
- [Angular Environments](https://angular.dev/tools/cli/environments) - Documentación oficial

---

**¿Dudas?** Revisa el archivo `CV_ANALYSIS_README.md` para instrucciones de uso del análisis de CVs.
