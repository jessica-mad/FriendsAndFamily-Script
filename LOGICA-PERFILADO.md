# Lógica de Perfilado y Respuestas

## Estados de Perfilado

Cada aspecto financiero se clasifica en 3 niveles:
- ❌ **mal**
- ✅ **bien**
- ⭐ **super bien**

## Agrupación para Respuestas

En las respuestas de texto, **"bien" y "super bien" se tratan igual** en la mayoría de casos:

### 1. Colchón de Emergencia

| Situación | Estado Perfilado | Respuesta |
|-----------|-----------------|-----------|
| Autónomo | mal | Mensaje: Necesitas mejorar |
| Autónomo | bien / super bien | Mensaje: Lo tienes controlado |
| Cuenta ajena | mal | Mensaje: Necesitas mejorar |
| Cuenta ajena | bien / super bien | Mensaje: Lo tienes controlado |

**Código:**
```javascript
if (estadoColchon.includes('mal')) {
  // Mostrar mensaje de "mal"
} else if (estadoColchon.includes('bien') || estadoColchon.includes('super bien')) {
  // Mostrar mensaje de "bien" (agrupa bien y super bien)
}
```

---

### 2. Vivienda (Matriz de decisión)

La vivienda combina 2 dimensiones:
- Estado de **ratio vivienda**: mal / bien-super bien
- Estado de **ratio ahorro**: mal / bien-super bien

| Ratio Vivienda | Ratio Ahorro | Respuesta |
|----------------|--------------|-----------|
| bien/super bien | bien/super bien | ✅✅ Excelente situación |
| bien/super bien | mal | ✅❌ Vivienda bien, pero ahorro corto |
| mal | bien/super bien | ❌✅ Vivienda alta, pero ahorras bien |
| mal | mal | ❌❌ Ambos necesitan mejora |

**Código:**
```javascript
const ratioViviendaBien = estadoVivienda.includes('bien') || estadoVivienda.includes('super bien');
const ratioAhorroBien = estadoAhorro.includes('bien') || estadoAhorro.includes('super bien');

if (ratioViviendaBien && ratioAhorroBien) {
  // Mensaje: ambos bien
} else if (ratioViviendaBien && !ratioAhorroBien) {
  // Mensaje: vivienda bien, ahorro mal
} else if (!ratioViviendaBien && ratioAhorroBien) {
  // Mensaje: vivienda mal, ahorro bien
} else {
  // Mensaje: ambos mal
}
```

---

### 3. Ahorro (cuando le preocupa)

EXCEPCIÓN: Aquí sí distinguimos entre bien y super bien

| Estado Perfilado | Respuesta |
|-----------------|-----------|
| mal | ❌ Preocupación justificada, necesitas mejorar |
| bien | ✅ Lo estás haciendo bien, mantén la disciplina |
| super bien | ⭐ Lo estás haciendo muy bien, piensa en optimizar |

**Código:**
```javascript
if (estadoAhorro.includes('mal')) {
  // Mensaje: necesitas mejorar
} else if (estadoAhorro.includes('super bien')) {
  // Mensaje: excelente, optimiza
} else if (estadoAhorro.includes('bien')) {
  // Mensaje: bien, mantén
}
```

---

### 4. Deuda

| Estado Perfilado | Respuesta |
|-----------------|-----------|
| mal | ❌ Nivel alto, prioriza amortizar |
| bien | ✅ Nivel razonable, mantén control |
| super bien | ⭐ Sin deuda, enhorabuena |

**Código:**
```javascript
if (estadoDeuda.includes('super bien')) {
  // Mensaje: sin deuda
} else if (estadoDeuda.includes('bien')) {
  // Mensaje: nivel razonable
} else {
  // Mensaje: nivel alto
}
```

---

### 5. Capacidad de Reacción

| Estado Perfilado | Respuesta |
|-----------------|-----------|
| mal | ❌ Capacidad limitada |
| bien | ✅ Capacidad adecuada |
| muy bien | ⭐ Capacidad excelente |

**Código:**
```javascript
if (estadoCapacidad.includes('muy bien')) {
  // Mensaje: excelente
} else if (estadoCapacidad.includes('bien')) {
  // Mensaje: adecuada
} else {
  // Mensaje: limitada
}
```

---

## Tabla Resumen: Cuándo agrupar bien/super bien

| Aspecto | ¿Agrupa bien y super bien? | Motivo |
|---------|---------------------------|---------|
| Colchón | ✅ SÍ | El mensaje es el mismo: "lo tienes controlado" |
| Vivienda (ratio) | ✅ SÍ | Se combina con ahorro en matriz 2x2 |
| Ahorro (si preocupa) | ❌ NO | Queremos dar mensaje diferente para super bien |
| Deuda | ❌ NO | "super bien" = sin deuda (mensaje especial) |
| Capacidad reacción | ❌ NO | "muy bien" merece mensaje diferente |

---

## Ejemplo Completo

### Usuario: María
- Situación: Autónoma
- Colchón: **bien** (8 meses)
- Vivienda: Alquiler
  - Ratio vivienda: **super bien** (20%)
  - Ratio ahorro: **mal** (5%)
- Deuda: **super bien** (sin deuda)
- Le preocupa: El ahorro

### Respuestas generadas:

#### 1. Colchón
```
Como autónomo tus ingresos mensuales son irregulares. Por ello se recomienda
tener un colchón de emergencia superior a 9 meses de tus ingresos, e idealmente 12.
Recuerda que basta tener 3 meses de ingresos en la cuenta corriente y el resto
del colchón mejor tenerlo en un producto remunerado y líquido.

Respondiste: 8 meses de ingresos

El colchón emergencia es fundamental para tu estabilidad económica. Es el primer
objetivo que te tienes que marcar en tu ahorro. Ahora mismo lo tienes bien
controlado. Sigue cuidándolo.
```
> ✅ Agrupa "bien" (aunque no llegue a los 12 meses, 8 está bien)

#### 2. Vivienda
```
Actualmente en España el gasto más relevante es la vivienda. En tu caso, que te
encuentras en régimen de alquiler. Por estar en alquiler deberías tener un ratio
de vivienda más bajo y un ratio de ahorro mayor que aquel que está pagando una hipoteca.

En concreto destinas un 20% de tus ingresos al pago de tu vivienda.

Tu ratio de vivienda es adecuado, pero sin embargo tienes un ratio de ahorro
corto para el que deberías tener al estar en alquiler.
```
> ✅ Vivienda "super bien" se trata como "bien" en la matriz
> ❌ Ahorro "mal" genera mensaje de advertencia

#### 3. Ahorro
```
Nos transmites que entre los temas que te preocupan más está el ahorro
y/o no llegar a final de mes.

Ya habíamos comentado anteriormente acerca de tu ratio de ahorro.
En concreto nos respondiste que tu ahorro era 5% anual

Tu preocupación por el ahorro está justificada. Basándonos en tu situación
actual, deberías priorizar aumentar tu capacidad de ahorro.
```
> ❌ Como es "mal", se da mensaje de mejora

#### 4. Deuda
```
Enhorabuena, no tienes deuda sin contar la hipoteca.

Respondiste que tu deuda representa un 0% de tus ingresos anuales.

Esta es una situación ideal. Mantente así y evita caer en la tentación
de financiar gastos no esenciales.
```
> ⭐ "super bien" = mensaje especial de "sin deuda"

---

## Resumen para Implementación

```javascript
// REGLA GENERAL:
// - Si el texto es el mismo para "bien" y "super bien" → AGRUPAR
// - Si "super bien" merece mensaje especial → SEPARAR

// Agrupar (bien = super bien):
if (estado.includes('bien') || estado.includes('super bien')) {
  // Mensaje único
}

// Separar (super bien distinto):
if (estado.includes('super bien')) {
  // Mensaje especial super bien
} else if (estado.includes('bien')) {
  // Mensaje bien
} else {
  // Mensaje mal
}
```
