# Guía de Optimización de Tokens

## Problema Actual

El sistema actual envía **TODO el árbol de decisión** a OpenAI en cada llamada para que busque los textos correspondientes a cada clave.

**Consumo actual:** ~3000-4000 tokens por usuario
- System prompt: ~200 tokens
- Árbol de decisión completo: ~2000-3000 tokens
- Respuestas literales: ~50 tokens
- Respuesta de OpenAI: ~500 tokens

**Con 100 usuarios:** ~300,000-400,000 tokens

## Solución Propuesta: Sistema de Bloques

En lugar de enviar todo a OpenAI, componer el texto directamente en JavaScript usando bloques predefinidos.

**Consumo nuevo:** ~0 tokens por usuario (o ~500-1000 si usas OpenAI solo para personalización final)

**Ahorro:** 80-90% de tokens

---

## Opción 1: Bloques en JavaScript (Más eficiente)

### Ventajas
- ✅ **CERO tokens** usados para buscar textos
- ✅ Respuesta instantánea (sin esperar a OpenAI)
- ✅ Total control sobre el texto
- ✅ Fácil debugging

### Desventajas
- ⚠️ Requiere modificar código JavaScript para cambiar textos
- ⚠️ No hay variabilidad en el tono (siempre el mismo texto)

### Implementación

Ya está lista en `generador-bloques-texto.js`. Solo necesitas:

1. Copiar las funciones al archivo `Codigo.js`
2. Modificar la función principal para usar `generateInsightOptimizadoSinOpenAI()` en lugar de `generateInsightFromArbolDecision()`

```javascript
// EN Codigo.js, MODIFICAR la función que procesa cada fila:

// ANTES:
const insight = generateInsightFromArbolDecision(respuestasLiterales);

// AHORA:
const insight = generateInsightOptimizadoSinOpenAI(userData, perfil);
```

---

## Opción 2: Bloques en Google Sheets (Más flexible)

### Ventajas
- ✅ Editar textos sin tocar código
- ✅ Fácil para no-programadores
- ✅ Misma eficiencia (0 tokens para buscar)

### Desventajas
- ⚠️ Requiere estructura de Sheet adicional

### Implementación

#### 1. Crear nueva hoja "Bloques de Texto"

Estructura:

| Categoría | Subcategoría | Condición | Texto |
|-----------|-------------|-----------|-------|
| colchon | autonomo | comun | Como autónomo tus ingresos mensuales... |
| colchon | autonomo | mal | El colchón emergencia es fundamental... |
| colchon | cuenta_ajena | comun | Como norma general se recomienda... |
| vivienda | alquiler | comun | Actualmente en España el gasto... |
| vivienda | alquiler | ratio_bien_ahorro_bien | Tu ratio de vivienda es adecuado... |
| ... | ... | ... | ... |

#### 2. Función para leer bloques

```javascript
function leerBloquesDeSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Bloques de Texto');

  if (!sheet) {
    Logger.log('⚠️ No se encontró la hoja "Bloques de Texto"');
    return {};
  }

  const data = sheet.getDataRange().getValues();
  const bloques = {};

  // Saltar encabezado
  for (let i = 1; i < data.length; i++) {
    const [categoria, subcategoria, condicion, texto] = data[i];

    if (!bloques[categoria]) {
      bloques[categoria] = {};
    }
    if (!bloques[categoria][subcategoria]) {
      bloques[categoria][subcategoria] = {};
    }

    bloques[categoria][subcategoria][condicion] = texto;
  }

  return bloques;
}
```

---

## Opción 3: Híbrido - Bloques + OpenAI para personalización (Recomendado)

La mejor de ambas opciones:

1. **Generar estructura base** con bloques (0 tokens)
2. **Opcional:** Enviar a OpenAI solo para dar tono/personalización (~500-1000 tokens)

### Ventajas
- ✅ Ahorro masivo de tokens (75-85%)
- ✅ Mantiene algo de "humanidad" en el texto
- ✅ Control sobre contenido + flexibilidad en tono

### Implementación

Ya está en `generador-bloques-texto.js` como `generateInsightOptimizadoConOpenAI()`

```javascript
// Usa bloques para generar el 90% del contenido
const insightBase = generarInsightOptimizado(userData, perfil);

// OpenAI solo mejora el tono
const insightFinal = personalizarConOpenAI(insightBase);
```

---

## Comparación de las 3 Opciones

| Aspecto | Actual | Opción 1: Solo Bloques | Opción 2: Bloques en Sheet | Opción 3: Híbrido |
|---------|--------|----------------------|--------------------------|------------------|
| **Tokens por usuario** | 3000-4000 | 0 | 0 | 500-1000 |
| **Costo 100 usuarios** | $0.30-0.40 | $0.00 | $0.00 | $0.05-0.10 |
| **Velocidad** | Lento (API calls) | Instantáneo | Instantáneo | Medio |
| **Facilidad de edición** | ⚠️ Difícil | ⚠️ Código | ✅ Fácil | ⚠️ Código |
| **Variabilidad de tono** | ✅ Alta | ❌ Nula | ❌ Nula | ✅ Media |

---

## Migración Paso a Paso

### Para Opción 1 (Recomendado para empezar):

1. ✅ Abre `Codigo.js` en tu Google Apps Script
2. ✅ Copia TODO el contenido de `generador-bloques-texto.js` al final de `Codigo.js`
3. ✅ Busca la línea que llama a `generateInsightFromArbolDecision(respuestasLiterales)`
4. ✅ Reemplázala por `generateInsightOptimizadoSinOpenAI(userData, perfil)`
5. ✅ Guarda y prueba con el botón "🧪 Probar Script con Última Fila"

### Para Opción 3 (Si quieres mantener algo de OpenAI):

1. ✅ Sigue pasos 1-2 de Opción 1
2. ✅ Reemplaza por `generateInsightOptimizadoConOpenAI(userData, perfil)`
3. ✅ Guarda y prueba

---

## Próximos Pasos

1. **Agregar más bloques** para cubrir todos los casos que me mostraste:
   - Ahorro y preocupación
   - Deuda
   - Capacidad de reacción
   - Etc.

2. **Estructura modular:** Cada sección financiera es un bloque independiente que se puede componer

3. **Variables dinámicas:** Los bloques pueden incluir variables como `${porcentaje}`, `${meses}`, etc.

---

## Ejemplo de Resultado

```javascript
// Para un usuario con:
// - Autónomo
// - Colchón mal
// - Alquiler
// - Ratio vivienda bien, ahorro mal

generateInsightOptimizadoSinOpenAI(userData, perfil);

// Genera:

## COLCHÓN DE EMERGENCIA

Como autónomo tus ingresos mensuales son irregulares. Por ello se recomienda
tener un colchón de emergencia superior a 9 meses de tus ingresos, e idealmente 12.
Recuerda que basta tener 3 meses de ingresos en la cuenta corriente y el resto
del colchón mejor tenerlo en un producto remunerado y líquido.

Respondiste: 2 meses de ingresos

El colchón emergencia es fundamental para tu estabilidad económica. Es el primer
objetivo que te tienes que marcar en tu ahorro. Cuando lo tengas cubierto tal y
como te hemos indicado habrás logrado un gran paso.

---

## TU VIVIENDA

Actualmente en España el gasto más relevante es la vivienda. En tu caso, que te
encuentras en régimen de alquiler. Por estar en alquiler deberías tener un ratio
de vivienda más bajo y un ratio de ahorro mayor que aquel que está pagando una hipoteca.

En concreto destinas un 25% de tus ingresos al pago de tu vivienda.

Tu ratio de vivienda es adecuado, pero sin embargo tienes un ratio de ahorro corto
para el que deberías tener al estar en alquiler.
```

---

## ¿Necesitas ayuda para implementarlo?

Dime y te ayudo a:
1. Integrar esto en tu `Codigo.js` actual
2. Agregar todos los bloques que me mostraste (ahorro, deuda, etc.)
3. Configurar la hoja de "Bloques de Texto" si prefieres esa opción
