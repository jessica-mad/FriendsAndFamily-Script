# Cómo Integrar el Árbol de Decisión

## 📋 Resumen

He creado `arbol-decision-textos.js` que implementa el árbol de decisión completo para generar insights **SIN usar OpenAI**.

### ✅ Características

- **Mantiene el perfilado actual** (mal/bien/super bien) - NO cambia
- **Usa respuestas literales** del formulario (ej: "Más de 6 meses")
- **Agrupa bien/super bien** solo para textos del insight
- **Placeholders** donde falta texto: "Falta texto para este caso"
- **100% ahorro de tokens** - No usa OpenAI para buscar textos

---

## 🚀 Integración Paso a Paso

### Paso 1: Abrir Google Apps Script

1. Abre tu Google Sheet
2. Ve a **Extensiones > Apps Script**
3. Verás el archivo `Codigo.js`

### Paso 2: Copiar el árbol de decisión

1. Abre el archivo `arbol-decision-textos.js`
2. Copia **TODO** su contenido
3. Pega al **FINAL** de tu archivo `Codigo.js`

### Paso 3: Modificar la función que genera insights

Busca en `Codigo.js` la función que genera el insight. Debería estar en una función que procesa filas, algo como:

```javascript
function procesarFilaParaInsight(rowNumber) {
  // ... código ...

  const userData = obtenerDatosUsuario(rowNumber);
  const perfil = generarPerfilado(userData);

  // ⚠️ ENCUENTRA Y REEMPLAZA ESTA LÍNEA:
  const respuestasLiterales = generarRespuestasLiterales(userData, perfil);
  const insight = generateInsightFromArbolDecision(respuestasLiterales);

  // ... más código ...
}
```

**REEMPLAZA** esas líneas por:

```javascript
function procesarFilaParaInsight(rowNumber) {
  // ... código ...

  const userData = obtenerDatosUsuario(rowNumber);
  const perfil = generarPerfilado(userData);

  // ✅ NUEVO: Sistema de árbol de decisión sin OpenAI
  const insight = generarInsightDesdeArbolDecision(userData, perfil);

  // ... más código ...
}
```

### Paso 4: (OPCIONAL) Comentar funciones antiguas

Para evitar confusión, comenta las funciones que ya no usarás:

```javascript
// ============================================================================
// SISTEMA ANTIGUO - YA NO SE USA
// ============================================================================

/*
function generarRespuestasLiterales(userData, perfil) {
  // ... código antiguo ...
}

function generateInsightFromArbolDecision(respuestasLiterales) {
  // ... código antiguo ...
}
*/
```

### Paso 5: Guardar y probar

1. Haz clic en **Guardar** (💾)
2. Vuelve a tu Google Sheet
3. Ejecuta: **🤖 Weavers Automation > 🧪 Probar Script con Última Fila**
4. Revisa los logs (Ver > Registros de ejecución)

Deberías ver:
```
🌳 Generando insight desde árbol de decisión (SIN OpenAI)...
✅ Insight generado desde árbol de decisión
📊 Tokens ahorrados: ~3500 tokens (100% de ahorro)
📝 Longitud del insight: XXX caracteres
```

---

## 📖 Estructura del Árbol

### 1. Colchón de Emergencia

```
Pregunta 3: Situación laboral
├─ Autónomo
│  └─ Pregunta 22: Colchón
│     ├─ MAL: "Mejor ni preguntes", "Menos de 3 meses", "Entre 3 y 6 meses"
│     └─ BIEN/SUPER BIEN: "Más de 6 meses"
└─ Cuenta ajena (incluye jubilado, funcionario)
   └─ Pregunta 22: Colchón
      ├─ MAL: "Mejor ni preguntes", "Menos de 3 meses"
      ├─ BIEN: "Entre 3 y 6 meses"
      └─ SUPER BIEN: "Más de 6 meses"
```

### 2. Vivienda

```
Pregunta 23: Tipo de vivienda
├─ Alquiler
├─ Casa pagada
└─ Hipoteca

Para cada tipo:
  MATRIZ 2x2:
  ┌─────────────────┬──────────────┬──────────────┐
  │                 │ Ahorro BIEN  │ Ahorro MAL   │
  ├─────────────────┼──────────────┼──────────────┤
  │ Vivienda BIEN   │ Texto A      │ Texto B      │
  │ Vivienda MAL    │ Texto C      │ Texto D      │
  └─────────────────┴──────────────┴──────────────┘
```

### 3. Ahorro (condicional)

```
Pregunta 17: ¿Menciona "ahorro" o "no llegar a fin de mes"?
├─ SÍ → Mostrar bloque
│  └─ Pregunta 21: Ratio ahorro
│     ├─ MAL → "Falta texto para este caso"
│     └─ BIEN/SUPER BIEN → "Falta texto para este caso"
└─ NO → No mostrar este bloque
```

---

## 🔧 Textos Faltantes (Placeholders)

Los siguientes casos tienen "Falta texto para este caso":

### 2.3.1.2 - Hipoteca + Vivienda BIEN + Ahorro MAL
```javascript
// En ARBOL_TEXTOS.vivienda.hipoteca
ratio_bien_ahorro_mal: "Falta texto para este caso"
```

### 3.1.1 - Le preocupa ahorro + Ratio MAL
```javascript
// En ARBOL_TEXTOS.ahorro
mal: "Falta texto para este caso"
```

### 3.1.2 - Le preocupa ahorro + Ratio BIEN
```javascript
// En ARBOL_TEXTOS.ahorro
bien: "Falta texto para este caso"
```

**Para agregar textos:** Edita el objeto `ARBOL_TEXTOS` en el archivo que pegaste en `Codigo.js`

---

## 📊 Ejemplo de Salida

### Usuario Ejemplo:
- Situación laboral: "Trabajo por cuenta propia" (Autónomo)
- Colchón: "Entre 3 y 6 meses" → Perfilado: MAL
- Vivienda: "Es de alquiler"
- Gasto vivienda: "Menos de un tercio (33%)" → Perfilado Vivienda: BIEN
- Ahorro: "Menos del 10%" → Perfilado Ahorro: MAL
- Preocupaciones: "El ahorro y la jubilación"

### Insight Generado:

```markdown
# 1. AUTÓNOMO/CUENTA AJENA

Ver la respuesta de la pregunta 3.
Solo va a tener impacto en lo relativo al colchón de emergencia. Pregunta 22.

Como autónomo tus ingresos mensuales son irregulares. Por ello se recomienda
tener un colchón de emergencia superior a 9 meses de tus ingresos, e idealmente 12.
Recuerda que basta tener 3 meses de ingresos en la cuenta corriente y el resto
del colchón mejor tenerlo en un producto remunerado y líquido.

Respondiste: Entre 3 y 6 meses de ingresos netos

El colchón emergencia es fundamental para tu estabilidad económica. Es el primer
objetivo que te tienes que marcar en tu ahorro. Cuando lo tengas cubierto tal y
como te hemos indicado habrás logrado un gran paso.

---

# 2. ALQUILER/HIPOTECA/CASA PAGADA

Actualmente en España el gasto más relevante es la vivienda. En tu caso, que te
encuentras en régimen de alquiler. Por estar en alquiler deberías tener un ratio
de vivienda más bajo y un ratio de ahorro mayor que aquel que está pagando una hipoteca.

En concreto destinas un Menos de un tercio (33%) de tus ingresos al pago de tu vivienda.

Tu ratio de vivienda es adecuado, pero sin embargo tienes un ratio de ahorro corto
para el que deberías tener al estar en alquiler.

---

# 3. AHORRO

Nos transmites que entre los temas que te preocupan más está el ahorro y/o no
llegar a final de mes.

Ya habíamos comentado anteriormente acerca de tu ratio de ahorro. En concreto
nos respondiste que tu ahorro era Menos del 10%

Falta texto para este caso
```

---

## ⚙️ Personalización

### Agregar nuevos textos

Edita el objeto `ARBOL_TEXTOS` en `Codigo.js`:

```javascript
const ARBOL_TEXTOS = {
  colchon: {
    autonomo: {
      comun: "Tu texto aquí...",
      mal: "Otro texto...",
      bien: "Más texto..."
    }
  },
  // ... resto del árbol
}
```

### Agregar nuevas secciones

Crea una nueva función generadora:

```javascript
function generarBloqueNuevaSeccion(userData, perfil) {
  const bloques = [];

  // Tu lógica aquí
  bloques.push("Texto de la nueva sección");

  return bloques.join('\n');
}

// Agregar al generador principal
function generarInsightDesdeArbolDecision(userData, perfil) {
  // ... código existente ...

  // Nueva sección
  secciones.push("# 4. NUEVA SECCIÓN");
  secciones.push(generarBloqueNuevaSeccion(userData, perfil));

  // ... resto del código ...
}
```

---

## 🆚 Comparación: Antes vs Ahora

| Aspecto | Sistema Anterior | Sistema Nuevo (Árbol) |
|---------|-----------------|----------------------|
| **Tokens/usuario** | ~3,500 | 0 ✅ |
| **Costo/usuario** | $0.115 | $0.00 ✅ |
| **Velocidad** | 2-3 segundos | <1 segundo ✅ |
| **Llamadas OpenAI** | 1 por usuario | 0 ✅ |
| **Control textos** | Medio | Total ✅ |
| **Mantenibilidad** | Difícil (árbol en Sheet) | Fácil (código) ✅ |
| **Debugging** | Complejo | Simple ✅ |
| **Escalabilidad** | Caro (crece lineal) | Gratis (sin límite) ✅ |

---

## ❓ Preguntas Frecuentes

### ¿Puedo seguir usando OpenAI para algo?

Sí, puedes crear una función híbrida que:
1. Genere el insight con el árbol (0 tokens)
2. Opcionalmente envíe a OpenAI solo para mejorar tono (~500-1000 tokens)

Esto te daría 65-75% de ahorro en vez de 100%, pero con algo de variabilidad.

### ¿Cómo agrego los textos que faltan?

Edita el objeto `ARBOL_TEXTOS` en `Codigo.js` y reemplaza `"Falta texto para este caso"` por el texto real.

### ¿Puedo cambiar la lógica de perfilado?

NO deberías. El perfilado (mal/bien/super bien) es independiente del árbol de textos. Si cambias la lógica de perfilado, asegúrate de que siga devolviendo los mismos estados.

### ¿Qué pasa si agrego nuevas preguntas?

1. Agrega las funciones auxiliares necesarias (ej: `determinarNuevoFactor()`)
2. Agrega los textos al objeto `ARBOL_TEXTOS`
3. Crea una función generadora (ej: `generarBloqueNuevoFactor()`)
4. Agrégala a `generarInsightDesdeArbolDecision()`

---

## 🐛 Debugging

Si algo no funciona:

1. **Abre los logs**: Ver > Registros de ejecución
2. **Busca errores**: Los mensajes de error indican qué falló
3. **Verifica datos**: Asegúrate de que `userData` y `perfil` tienen los datos correctos
4. **Prueba sección por sección**: Comenta secciones del insight para aislar el problema

Ejemplo de log exitoso:
```
🌳 Generando insight desde árbol de decisión (SIN OpenAI)...
✅ Insight generado desde árbol de decisión
📊 Tokens ahorrados: ~3500 tokens (100% de ahorro)
📝 Longitud del insight: 1234 caracteres
```

---

## 📞 Próximos Pasos

1. ✅ Integrar en `Codigo.js` siguiendo esta guía
2. ✅ Probar con varias filas de prueba
3. ⏳ Agregar textos faltantes (reemplazar placeholders)
4. ⏳ (Opcional) Agregar más secciones al árbol
5. ⏳ Procesar todas las filas pendientes

¿Necesitas ayuda? Avísame y te guío en cada paso.
