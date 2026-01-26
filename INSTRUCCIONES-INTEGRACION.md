# Instrucciones de Integración - Sistema Optimizado

## Resumen

Vas a reemplazar el sistema actual que usa OpenAI para buscar textos en el árbol de decisión por un sistema de bloques que genera las respuestas directamente en JavaScript.

**Resultado:** Ahorro de 80-90% en tokens (de ~3500 tokens/usuario a ~0 tokens/usuario)

---

## Opción Recomendada: Sistema de Bloques (SIN OpenAI)

### Paso 1: Abrir Google Apps Script

1. Abre tu Google Sheet
2. Ve a **Extensiones > Apps Script**
3. Verás el archivo `Codigo.js`

### Paso 2: Agregar los bloques de texto al final

1. Abre el archivo `todos-los-bloques-texto.js` que te he creado
2. Copia TODO su contenido
3. Pega al **FINAL** de tu archivo `Codigo.js`

### Paso 3: Modificar la función que genera insights

Busca en `Codigo.js` la función que procesa cada fila. Debería verse algo así:

```javascript
// BUSCA ALGO SIMILAR A ESTO:
function procesarFila(rowNumber, userData) {
  // ... código ...

  const perfil = generarPerfilado(userData);
  const respuestasLiterales = generarRespuestasLiterales(userData, perfil);

  // ⚠️ ESTA LÍNEA ES LA QUE VAMOS A CAMBIAR:
  const insight = generateInsightFromArbolDecision(respuestasLiterales);

  // ... más código ...
}
```

**REEMPLAZA** esa línea por:

```javascript
  // NUEVO: Sistema optimizado sin OpenAI
  const insight = generarInsightCompletoOptimizado(userData, perfil);
```

### Paso 4: (OPCIONAL) Comentar funciones viejas

Para evitar confusión, puedes comentar las funciones que ya no usarás:

```javascript
// YA NO SE USA - Sistema antiguo con OpenAI
// function generateInsightFromArbolDecision(respuestasLiterales) {
//   ...
// }

// YA NO SE USA - Respuestas literales
// function generarRespuestasLiterales(userData, perfil) {
//   ...
// }
```

### Paso 5: Guardar y probar

1. Haz clic en el botón **Guardar** (💾)
2. Vuelve a tu Google Sheet
3. Usa el menú **🤖 Weavers Automation > 🧪 Probar Script con Última Fila**
4. Revisa los logs para confirmar que dice:
   ```
   🚀 Generando insight con sistema optimizado (sin OpenAI)...
   ✅ Insight generado con sistema optimizado
   📊 Tokens ahorrados: ~3000-4000 tokens por usuario
   ```

---

## Opción Alternativa: Sistema Híbrido (Bloques + OpenAI para tono)

Si quieres mantener algo de OpenAI solo para dar un toque final al texto:

### Paso 3 alternativo:

En lugar de usar `generarInsightCompletoOptimizado`, usa:

```javascript
  // Sistema híbrido: bloques + OpenAI solo para tono
  const insight = generarInsightCompletoOptimizadoConOpenAI(userData, perfil);
```

Necesitarás agregar esta función al final de `Codigo.js`:

```javascript
function generarInsightCompletoOptimizadoConOpenAI(userData, perfil) {
  try {
    // 1. Generar insight base con bloques (SIN OpenAI)
    const insightBase = generarInsightCompletoOptimizado(userData, perfil);

    // 2. Enviar a OpenAI solo para mejorar tono
    const promptPersonalizacion = `Revisa el siguiente diagnóstico financiero y mejora ligeramente el tono para que sea más empático y cercano, SIN cambiar el contenido fundamental:

${insightBase}

Mantén toda la información técnica y los números. Solo mejora el tono para que sea más humano y empático.`;

    const response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + CONFIG.OPENAI_API_KEY,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Eres un asesor financiero empático. Mejora el tono del texto sin cambiar el contenido.'
          },
          {
            role: 'user',
            content: promptPersonalizacion
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      }),
      muteHttpExceptions: true
    });

    const result = JSON.parse(response.getContentText());

    if (result.error) {
      Logger.log('Error OpenAI API, usando versión sin personalizar: ' + JSON.stringify(result.error));
      return insightBase; // Devolver versión sin personalizar
    }

    Logger.log('✅ Insight personalizado con OpenAI');
    Logger.log('📊 Tokens usados: ~1000 (ahorro del 75% vs sistema anterior)');

    return result.choices[0].message.content;

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    // En caso de error, devolver la versión base sin OpenAI
    return generarInsightCompletoOptimizado(userData, perfil);
  }
}
```

---

## Comparación de Opciones

### Sistema Actual (que tienes ahora)
- ❌ ~3500 tokens/usuario
- ❌ Lento (2-3 segundos por llamada)
- ❌ Difícil agregar nuevos textos
- ✅ Variabilidad en tono (OpenAI puede variar respuestas)

### Opción 1: Solo Bloques (Recomendada)
- ✅ **0 tokens/usuario** 💰
- ✅ Instantáneo (<1 segundo)
- ✅ Fácil agregar textos nuevos
- ❌ Siempre mismo texto

### Opción 2: Híbrido (Bloques + OpenAI tono)
- ✅ ~1000 tokens/usuario (ahorro 75%)
- ⚠️ Medio (1-2 segundos)
- ✅ Fácil agregar textos base
- ✅ Algo de variabilidad

---

## Agregar Nuevos Bloques de Texto

Si quieres agregar más textos o modificar los existentes:

1. Ve a la constante `BLOQUES_COMPLETOS` en el archivo que pegaste
2. Busca la sección que quieres modificar, por ejemplo:

```javascript
const BLOQUES_COMPLETOS = {
  colchon: {
    autonomo: {
      comun: "Texto que quieras modificar...",
      mal: "Otro texto...",
      bien: "Más texto..."
    }
  },
  // ... resto de bloques
}
```

3. Modifica el texto entre comillas
4. Guarda
5. Listo

---

## Verificación del Ahorro de Tokens

Para confirmar el ahorro:

### Antes (sistema actual):
```
Logs de Google Apps Script:
🤖 Llamando a OpenAI con árbol de decisión...
📊 Tokens enviados: ~3000
📊 Tokens recibidos: ~500
💰 Costo: ~$0.03-0.04 por usuario
```

### Después (opción 1):
```
Logs de Google Apps Script:
🚀 Generando insight con sistema optimizado (sin OpenAI)...
✅ Insight generado con sistema optimizado
📊 Tokens ahorrados: ~3500 tokens por usuario
💰 Costo: $0.00 por usuario
```

### Después (opción 2 - híbrido):
```
Logs de Google Apps Script:
🚀 Generando insight base con bloques...
🤖 Personalizando tono con OpenAI...
✅ Insight personalizado con OpenAI
📊 Tokens usados: ~1000 (ahorro del 75% vs sistema anterior)
💰 Costo: ~$0.01 por usuario
```

---

## Beneficios Adicionales

1. **Control total**: Sabes exactamente qué texto se va a mostrar
2. **Consistencia**: No hay variaciones inesperadas de OpenAI
3. **Velocidad**: Respuestas instantáneas
4. **Debugging**: Fácil saber qué texto salió y por qué
5. **Escalabilidad**: Puedes procesar miles de usuarios sin preocuparte por costos

---

## Próximos Pasos Sugeridos

Una vez implementado el sistema básico, puedes:

1. **Agregar más secciones** siguiendo el mismo patrón
2. **Crear una hoja "Bloques"** en Google Sheets para editar textos sin tocar código
3. **Agregar variables dinámicas** en los textos (ej: `Tienes ${colchon_meses} meses`)
4. **Personalizar por perfil** (textos diferentes según edad, situación, etc.)

---

## ¿Necesitas Ayuda?

Si encuentras algún error o quieres agregar más bloques, avísame y te ayudo.
