# Análisis de CVs con Claude - Guía de Uso

## Descripción

Nueva funcionalidad integrada en el proyecto que permite analizar CVs de candidatos usando la API de Claude (Anthropic) **a través del backend**. El sistema analiza automáticamente candidatos para el puesto de Asistente Virtual de Victoria Poggioli y proporciona:

- Scoring automático (0-100 puntos)
- Categorización (Entrevistar / Quizás / Descartar)
- Top 3 candidatos recomendados
- Análisis detallado de fortalezas y debilidades
- Preguntas sugeridas para entrevistas

## Archivos Creados

1. **Modelos**: `src/app/core/models/cv-analysis.model.ts`
   - Define las interfaces para candidatos y resultados de análisis

2. **Servicio**: `src/app/core/services/cv-analysis.service.ts`
   - Integración con la API de Claude
   - Procesamiento de archivos Excel y PDF
   - Construcción del prompt de análisis

3. **Componente**: `src/app/features/cv-analysis/cv-analysis.component.ts`
   - Interfaz de usuario completa
   - Carga de archivos
   - Visualización de resultados

4. **Rutas**: Actualizado `app.routes.ts`
   - Nueva ruta: `/cv-analysis`

5. **Navegación**: Actualizado `sidebar.component.ts`
   - Nuevo link en el menú lateral

## ⚠️ IMPORTANTE: Arquitectura Backend

**El frontend YA NO llama directamente a Claude.** Ahora funciona así:

```
Usuario → Frontend → Backend → Claude API
                       ↓
                  API Key segura
```

**Ventajas:**
- ✅ API key protegida en el servidor
- ✅ Sin problemas de CORS
- ✅ Rate limiting controlado
- ✅ Validaciones centralizadas

---

## Cómo Usar

### 1. Configurar Backend (REQUERIDO)

**El backend debe implementar el endpoint:**

```
POST /api/cv-analysis/analyze
```

Ver documentación completa en: `FRONTEND_BACKEND_INTEGRATION.md`

**Variable de entorno requerida en el servidor:**

```bash
CLAUDE_API_KEY=sk-ant-api03-xxxxx
```

### 2. Preparar los Archivos

#### Archivo Excel (Obligatorio)
- Exporta las respuestas de Google Forms a Excel (.xlsx o .csv)
- El archivo debe contener las respuestas del formulario de candidatos

**Cómo exportar desde Google Forms:**
1. Abre Google Forms
2. Ve a "Respuestas"
3. Click en el ícono de Google Sheets
4. En Sheets: Archivo → Descargar → Excel (.xlsx)

#### CVs en PDF (Opcional)
- Puedes subir múltiples archivos PDF
- Los CVs ayudan al análisis pero no son obligatorios
- Claude puede analizar el contenido de los PDFs

### 3. Analizar Candidatos

1. **Asegúrate de que el backend esté corriendo**
2. Inicia el frontend: `npm start`
3. Ve a "Análisis de CVs" en el menú lateral (http://localhost:4200/cv-analysis)
4. Sube el archivo Excel con las respuestas
5. (Opcional) Sube los CVs en PDF
6. Click en "🚀 Analizar Candidatos"
7. Espera 1-2 minutos (dependiendo del número de candidatos)

### 4. Revisar Resultados

#### Resumen Ejecutivo
- Total de candidatos analizados
- Cantidad por categoría (Entrevistar / Quizás / Descartar)
- Top 3 candidatos recomendados con razones

#### Filtros
- **Todos**: Ver todos los candidatos
- **Entrevistar** (✅): Candidatos con score 75+
- **Quizás** (🤔): Candidatos con score 50-74
- **Descartar** (❌): Candidatos con score <50

#### Detalles de Cada Candidato
- Score (0-100)
- Categoría
- Fortaleza principal
- Bandera roja (si hay)
- Lista de fortalezas
- Áreas de atención
- Consistencia entre CV y formulario
- Pregunta sugerida para la entrevista
- Datos de contacto (email, teléfono)

## Criterios de Evaluación

El sistema evalúa automáticamente según estos criterios:

- **Experiencia relevante**: 25 puntos
- **Habilidades técnicas**: 20 puntos
- **Calidad de respuesta escrita**: 20 puntos
- **Conocimiento de Victoria/interés genuino**: 15 puntos
- **Disponibilidad y expectativas**: 10 puntos
- **Personalidad/cultura fit**: 10 puntos

## Categorías por Score

- **90-100**: Entrevistar (prioritario)
- **75-89**: Entrevistar
- **60-74**: Quizás (considerar)
- **40-59**: Descartar (candidato débil)
- **0-39**: Descartar (no cumple requisitos mínimos)

## Características Técnicas

### Arquitectura
- **Frontend:** Angular 19 (Standalone Components)
- **Backend:** Node.js/Express (a implementar)
- **IA:** Claude 3.5 Sonnet vía Anthropic API

### Modelo de IA
- Claude 3.5 Sonnet (claude-3-5-sonnet-20241022)
- Max tokens: 16,000
- API: Anthropic Messages API v2023-06-01
- **Llamado desde:** Backend (servidor)

### Procesamiento de Archivos
- **Frontend:** Envía archivos raw (File objects) al backend
- **Backend:** Procesa Excel y PDFs
- Excel: Se lee y parsea en el servidor
- PDF: Se extrae texto en el servidor
- FormData: Multipart upload

### Seguridad
- ✅ La API Key vive en el backend (.env)
- ✅ NUNCA se expone al cliente
- ✅ CORS manejado en el backend
- ✅ Rate limiting en el backend
- ✅ Validaciones server-side

## Costos

El análisis usa la API de Claude que es de pago (cargos al backend):

- **Modelo:** Claude 3.5 Sonnet
- **Costo aproximado:** ~$3 USD per million input tokens
- **Para ~20 candidatos con CVs:** ~$0.50-1.00 USD por análisis

**Nota:**
- Los cargos se hacen a la cuenta del backend (variable `CLAUDE_API_KEY`)
- Verifica los precios actuales en [anthropic.com/pricing](https://www.anthropic.com/pricing)
- El backend puede implementar rate limiting para controlar costos

## Troubleshooting

### Error: "Error al analizar los CVs"
- ✅ **Verifica que el backend esté corriendo**
- Revisa que `environment.apiUrl` apunte al backend correcto
- Asegúrate de que el backend tenga la API key configurada
- Verifica que haya créditos en la cuenta de Anthropic (del backend)
- Revisa que el archivo Excel tenga el formato correcto

### Error: "El servicio no está disponible"
- El backend no está corriendo
- La URL del backend es incorrecta en `environment.ts`
- CORS no está configurado en el backend

### Error: "Error al leer los archivos"
- Verifica que el archivo Excel sea .xlsx o .csv
- Asegúrate de que los PDFs no estén corruptos
- Intenta con menos archivos a la vez

### El análisis tarda mucho
- Es normal que tarde 1-2 minutos con muchos candidatos
- Claude procesa todo el contenido de los CVs
- Si tarda más de 5 minutos, recarga y vuelve a intentar

### Resultados inesperados
- Verifica que el Excel tenga las columnas correctas
- Asegúrate de que las respuestas estén completas
- Los CVs ayudan pero no son obligatorios

## Próximas Mejoras Posibles

- [ ] Exportar resultados a PDF
- [ ] Guardar análisis en base de datos
- [ ] Comparar múltiples análisis
- [ ] Enviar emails automáticos a candidatos seleccionados
- [ ] Integración con calendario para agendar entrevistas
- [ ] Análisis de video entrevistas

## Soporte

Si encuentras bugs o necesitas ayuda:
1. Revisa los logs en la consola del navegador (F12)
2. Verifica los errores en la terminal donde corre `npm start`
3. Contacta al desarrollador

---

**Desarrollado para**: Victoria Poggioli - Análisis de Candidatos
**Tecnología**: Angular 19 + Claude AI (Anthropic)
**Fecha**: Diciembre 2024
