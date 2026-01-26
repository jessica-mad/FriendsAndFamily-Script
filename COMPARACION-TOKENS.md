# Comparación de Consumo de Tokens

## Sistema ACTUAL (con OpenAI buscando en árbol)

### Llamada a OpenAI:

```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "Eres un asistente que extrae textos literales de un árbol de decisión.\n\nTu tarea es:\n1. Recibir una lista de respuestas literales (claves)\n2. Buscar en el árbol de decisión el texto/contenido que corresponde a cada clave\n3. Devolver SOLO el contenido/texto asociado a cada clave..."
    },
    {
      "role": "user",
      "content": "Árbol de decisión:\n\n[AQUÍ VA TODO EL ÁRBOL - 2000-3000 TOKENS]\n\nColchon bien, cuenta ajena: Como norma general se recomienda...\nColchon mal, cuenta ajena: El colchón emergencia es fundamental...\nVivienda bien con hipoteca: Tu ratio de vivienda es adecuado...\n... [MÁS BLOQUES] ...\n\nRespuestas literales a buscar:\nColchon bien, cuenta ajena\nVivienda bien con hipoteca\nAhorro mal con hipoteca\n..."
    }
  ],
  "temperature": 0.1,
  "max_tokens": 2000
}
```

### Desglose de tokens:

| Componente | Tokens | Descripción |
|------------|--------|-------------|
| System prompt | ~200 | Instrucciones de cómo buscar |
| Árbol completo | **2500** | TODO el árbol con TODOS los casos |
| Respuestas literales | ~50 | Claves a buscar |
| Ejemplo | ~100 | Ejemplo de formato |
| **TOTAL INPUT** | **~2850** | Lo que envías |
| Output (respuesta) | ~500 | Lo que recibes |
| **TOTAL** | **~3350** | **Total por usuario** |

### Costo aproximado:

**GPT-4 Pricing:**
- Input: $0.03 / 1K tokens
- Output: $0.06 / 1K tokens

**Por usuario:**
- Input: 2850 tokens × $0.03 / 1000 = **$0.0855**
- Output: 500 tokens × $0.06 / 1000 = **$0.03**
- **Total: ~$0.115 por usuario**

**100 usuarios:** ~$11.50
**1000 usuarios:** ~$115.00

---

## Sistema NUEVO - Opción 1: Solo Bloques

### NO hay llamada a OpenAI

El insight se genera directamente en JavaScript:

```javascript
function generarInsightCompletoOptimizado(userData, perfil) {
  const secciones = [];

  // Sección colchón
  if (perfil.colchon) {
    const situacion = userData.situacion_laboral.includes('autónomo') ? 'autonomo' : 'cuenta_ajena';
    const estado = perfil.colchon.toLowerCase();

    secciones.push(BLOQUES_COMPLETOS.colchon[situacion].comun);
    secciones.push(`Respondiste: ${userData.colchon_liquido}`);

    if (estado.includes('mal')) {
      secciones.push(BLOQUES_COMPLETOS.colchon[situacion].mal);
    } else {
      secciones.push(BLOQUES_COMPLETOS.colchon[situacion].bien);
    }
  }

  // ... más secciones ...

  return secciones.join('\n\n');
}
```

### Desglose de tokens:

| Componente | Tokens | Descripción |
|------------|--------|-------------|
| Llamadas a OpenAI | **0** | No se usa OpenAI |
| **TOTAL** | **0** | **Total por usuario** |

### Costo aproximado:

**Por usuario:** $0.00
**100 usuarios:** $0.00
**1000 usuarios:** $0.00

### Ahorro:

- **Por usuario:** $0.115 → $0.00 = **100% ahorro**
- **100 usuarios:** $11.50 → $0.00 = **$11.50 ahorrados**
- **1000 usuarios:** $115.00 → $0.00 = **$115.00 ahorrados**

---

## Sistema NUEVO - Opción 2: Híbrido (Bloques + OpenAI solo para tono)

### Llamada a OpenAI (SOLO para personalizar tono):

```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "Eres un asesor financiero empático. Mejora el tono del texto sin cambiar el contenido."
    },
    {
      "role": "user",
      "content": "Revisa el siguiente diagnóstico financiero y mejora ligeramente el tono:\n\n[AQUÍ VA EL INSIGHT YA GENERADO - 400-600 TOKENS]\n\nMantén toda la información técnica y los números. Solo mejora el tono."
    }
  ],
  "temperature": 0.3,
  "max_tokens": 1500
}
```

### Desglose de tokens:

| Componente | Tokens | Descripción |
|------------|--------|-------------|
| System prompt | ~30 | Instrucción simple |
| Insight base | **500** | El texto ya generado con bloques |
| Instrucción | ~50 | "Mejora el tono..." |
| **TOTAL INPUT** | **~580** | Lo que envías |
| Output (respuesta) | ~600 | Texto con mejor tono |
| **TOTAL** | **~1180** | **Total por usuario** |

### Costo aproximado:

**Por usuario:**
- Input: 580 tokens × $0.03 / 1000 = **$0.0174**
- Output: 600 tokens × $0.06 / 1000 = **$0.036**
- **Total: ~$0.053 por usuario**

**100 usuarios:** ~$5.30
**1000 usuarios:** ~$53.00

### Ahorro:

- **Por usuario:** $0.115 → $0.053 = **54% ahorro**
- **100 usuarios:** $11.50 → $5.30 = **$6.20 ahorrados**
- **1000 usuarios:** $115.00 → $53.00 = **$62.00 ahorrados**

---

## Comparación Visual

```
SISTEMA ACTUAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Token usage: ████████████████████████████████████ 3350 tokens
Cost:        ████████████████████████████████████ $0.115
Time:        ████████████████████ 2-3 segundos


OPCIÓN 1: SOLO BLOQUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Token usage:  0 tokens
Cost:         $0.000
Time:        █ <1 segundo
AHORRO:      ████████████████████████████████████ 100%


OPCIÓN 2: HÍBRIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Token usage: ████████████ 1180 tokens
Cost:        ████████████ $0.053
Time:        ██████████ 1-2 segundos
AHORRO:      ████████████████████████ 65%
```

---

## Tabla Resumen

| Métrica | Sistema Actual | Opción 1: Bloques | Opción 2: Híbrido |
|---------|---------------|------------------|------------------|
| **Tokens/usuario** | 3,350 | 0 | 1,180 |
| **Costo/usuario** | $0.115 | $0.000 | $0.053 |
| **Tiempo** | 2-3s | <1s | 1-2s |
| **Ahorro tokens** | - | 100% ✅ | 65% ✅ |
| **Ahorro costo** | - | 100% ✅ | 54% ✅ |
| **Costo 100 users** | $11.50 | $0.00 | $5.30 |
| **Costo 1K users** | $115.00 | $0.00 | $53.00 |
| **Variabilidad tono** | Alta | Nula | Media |
| **Control contenido** | Medio | Total | Alto |

---

## Ejemplo Real: Procesando 500 usuarios/mes

### Sistema Actual
- **Tokens mensuales:** 500 × 3,350 = 1,675,000 tokens
- **Costo mensual:** $57.50
- **Costo anual:** $690.00

### Opción 1: Solo Bloques
- **Tokens mensuales:** 0
- **Costo mensual:** $0.00
- **Costo anual:** $0.00
- **AHORRO ANUAL:** $690.00 💰

### Opción 2: Híbrido
- **Tokens mensuales:** 500 × 1,180 = 590,000 tokens
- **Costo mensual:** $26.50
- **Costo anual:** $318.00
- **AHORRO ANUAL:** $372.00 💰

---

## ¿Cuándo usar cada opción?

### Usa Opción 1 (Solo Bloques) si:
- ✅ Quieres **costo CERO**
- ✅ Priorizas **velocidad**
- ✅ Necesitas **consistencia** total
- ✅ Tienes muchos usuarios (cientos o miles)
- ✅ Los textos financieros son técnicos (no necesitan variabilidad)

### Usa Opción 2 (Híbrido) si:
- ✅ Quieres **balance costo/calidad**
- ✅ Valoras algo de **variabilidad** en tono
- ✅ Quieres textos más "humanos"
- ✅ Procesas volumen medio (decenas o cientos)
- ❌ NO si tienes miles de usuarios (el costo escala)

### NO uses Sistema Actual si:
- ❌ Procesas más de 50 usuarios/mes
- ❌ Te preocupa el costo
- ❌ Quieres respuestas rápidas
- ❌ Necesitas control exacto del contenido

---

## Recomendación

Para tu caso, **recomiendo Opción 1 (Solo Bloques)** porque:

1. Los insights financieros son técnicos y no necesitan mucha variabilidad
2. Ahorras 100% en tokens = $0 por usuario
3. Respuestas instantáneas
4. Control total sobre el contenido
5. Fácil de mantener y expandir

Si en el futuro necesitas algo de personalización, siempre puedes cambiar a la Opción 2.
