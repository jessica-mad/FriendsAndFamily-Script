// ============================================================================
// ÁRBOL DE DECISIÓN DE TEXTOS - Sistema Optimizado
// ============================================================================
// Este archivo contiene el árbol de decisión completo para generar insights
// SIN usar OpenAI para buscar textos (ahorro de 80-100% en tokens)
//
// IMPORTANTE:
// - El PERFILADO (mal/bien/super bien) NO cambia
// - Los TEXTOS agrupan "bien" y "super bien" cuando tienen el mismo mensaje
// - Se usan las respuestas LITERALES del formulario (no se cambian)
// ============================================================================

// ============================================================================
// BLOQUES DE TEXTO DEL ÁRBOL DE DECISIÓN
// ============================================================================

const ARBOL_TEXTOS = {

  // ==========================================================================
  // 1. COLCHÓN DE EMERGENCIA (Autónomo vs Cuenta Ajena)
  // ==========================================================================
  colchon: {
    // Pregunta 3: Situación laboral
    // Pregunta 22: Colchón líquido

    autonomo: {
      // "Trabajo por cuenta propia"
      comun: "Como autónomo tus ingresos mensuales son irregulares. Por ello se recomienda tener un colchón de emergencia superior a 9 meses de tus ingresos, e idealmente 12. Recuerda que basta tener 3 meses de ingresos en la cuenta corriente y el resto del colchón mejor tenerlo en un producto remunerado y líquido.",

      // Perfilado MAL: "Mejor ni preguntes", "Menos de 3 meses", "Entre 3 y 6 meses"
      mal: "El colchón emergencia es fundamental para tu estabilidad económica. Es el primer objetivo que te tienes que marcar en tu ahorro. Cuando lo tengas cubierto tal y como te hemos indicado habrás logrado un gran paso.",

      // Perfilado BIEN/SUPER BIEN: "Más de 6 meses"
      bien: "El colchón emergencia es fundamental para tu estabilidad económica. Es el primer objetivo que te tienes que marcar en tu ahorro. Ahora mismo lo tienes bien controlado. Sigue cuidándolo. Cuando tengas un gasto para una emergencia tira de él."
    },

    cuenta_ajena: {
      // "Trabajo por cuenta ajena", "Estoy jubilado", contiene "funcionario"
      // "No estoy trabajando" + "Para mi unidad familiar"
      comun: "Como norma general se recomienda tener un colchón de emergencia superior a 6 meses de tus ingresos. Recuerda que basta tener 3 meses de ingresos en la cuenta corriente y el resto del colchón mejor tenerlo en un producto remunerado y líquido.",

      // Perfilado MAL: "Mejor ni preguntes", "Menos de 3 meses"
      mal: "El colchón emergencia es fundamental para tu estabilidad económica. Es el primer objetivo que te tienes que marcar en tu ahorro. Cuando lo tengas cubierto tal y como te hemos indicado habrás logrado un gran paso.",

      // Perfilado BIEN: "Entre 3 y 6 meses"
      // Perfilado SUPER BIEN: "Más de 6 meses"
      bien: "El colchón emergencia es fundamental para tu estabilidad económica. Es el primer objetivo que te tienes que marcar en tu ahorro. Ahora mismo lo tienes bien controlado. Sigue cuidándolo. Cuando tengas un gasto para una emergencia tira de él."
    }
  },

  // ==========================================================================
  // 2. VIVIENDA (Alquiler / Casa Pagada / Hipoteca)
  // ==========================================================================
  vivienda: {
    // Pregunta 23: Tipo de vivienda
    // Pregunta 24: Gasto en vivienda

    // --------------------------------------------------------------------------
    // 2.1 ALQUILER
    // --------------------------------------------------------------------------
    alquiler: {
      comun: "Actualmente en España el gasto más relevante es la vivienda. En tu caso, que te encuentras en régimen de alquiler. Por estar en alquiler deberías tener un ratio de vivienda más bajo y un ratio de ahorro mayor que aquel que está pagando una hipoteca.",

      // MATRIZ 2x2: Ratio Vivienda × Ratio Ahorro

      // 2.1.1 Ratio vivienda BIEN/SUPER BIEN
      // Perfilado Vivienda BIEN: "Menos de un tercio (33%)"

      // 2.1.1.1 + Ratio ahorro BIEN/SUPER BIEN
      // Perfilado Ahorro BIEN: "Entre el 30% y el 40%"
      // Perfilado Ahorro SUPER BIEN: "Más del 40%"
      ratio_bien_ahorro_bien: "Tu ratio de vivienda es adecuado, y además está acompañado de un buen ratio de ahorro. Con estos datos podemos decir que vas en la buena dirección para generar el suficiente ahorro para la compra de una vivienda.",

      // 2.1.1.2 + Ratio ahorro MAL
      // Perfilado Ahorro MAL: "No ahorro nada", "Menos del 10%", "Entre el 10% y el 30%"
      ratio_bien_ahorro_mal: "Tu ratio de vivienda es adecuado, pero sin embargo tienes un ratio de ahorro corto para el que deberías tener al estar en alquiler.",

      // 2.1.2 Ratio vivienda MAL
      // Perfilado Vivienda MAL: "Más del 50%", "Entre el 40% y el 50%", "Entre el 33% y el 40%"

      // 2.1.2.1 + Ratio ahorro MAL
      ratio_mal_ahorro_mal: "Estás gastando en la vivienda más de lo recomendado y además no estás ahorrando como debes, ya que al estar de alquiler deberías tener un ratio de ahorro superior a los que pagan una hipoteca. En el alquiler te debes gastar como máximo un 25% de tus ingresos y en el total de tu vivienda no puedes superar el 30%. Como los gastos de alquiler en el corto plazo son más complicados de ajustar, intenta mejorar el ratio de ahorro reduciendo los gastos discrecionales de tu día a día, es decir, aquellos que no son completamente necesarios.",

      // 2.1.2.2 + Ratio ahorro BIEN/SUPER BIEN
      ratio_mal_ahorro_bien: "Tienes un ratio de vivienda mayor del adecuado. En el alquiler te debes gastar como máximo un 25% de tus ingresos y en el total de tu vivienda no puedes superar el 30%. Como tu ratio de ahorro sí está en línea con lo recomendado solo te pedimos que mires si puedes ajustar alguno de los gastos de tu casa. Puede que algo sea optimizable en el corto plazo"
    },

    // --------------------------------------------------------------------------
    // 2.2 CASA PAGADA
    // --------------------------------------------------------------------------
    pagada: {
      comun: "Actualmente en España el gasto más relevante es la vivienda. En tu caso no se puede tener mejores noticias. Esa reducción de gasto mensual al no tener que pagar ni hipoteca o alquiler debe ayudarte enormemente de aquí en adelante",

      // MATRIZ 2x2: Ratio Vivienda × Ratio Ahorro

      // 2.2.1 Ratio vivienda BIEN/SUPER BIEN
      // Perfilado Vivienda BIEN: "Menos de un tercio (33%)"

      // 2.2.1.1 + Ratio ahorro BIEN/SUPER BIEN
      // Perfilado Ahorro BIEN: "Más del 40%"
      ratio_bien_ahorro_bien: "Tu ratio de vivienda es adecuado, y además está acompañado de un buen ratio de ahorro. Con estos datos podemos decir que tienes una base excepcional para tu futuro.",

      // 2.2.1.2 + Ratio ahorro MAL
      // Perfilado Ahorro MAL: "No ahorro nada", "Menos del 10%", "Entre el 10% y el 30%", "Entre el 30% y el 40%"
      ratio_bien_ahorro_mal: "Tu ratio de vivienda es adecuado, pero sin embargo tienes un ratio de ahorro corto para el que deberías conseguir al tener ya tu casa pagada. Es normal que con la casa pagada puedan aumentar otro tipo de gastos, pero en la medida de lo posible hay que ser exigente con el ratio de ahorro al estar en una situación mucho más favorable que los que tiene que pagar una hipoteca",

      // 2.2.2 Ratio vivienda MAL
      // Perfilado Vivienda MAL: "Más del 50%", "Entre el 40% y el 50%", "Entre el 33% y el 40%"

      // 2.2.2.1 + Ratio ahorro MAL
      ratio_mal_ahorro_mal: "Estás gastando en la vivienda más de lo recomendado y además no estás ahorrando como debes, ya que al tener ya la casa pagada deberías tener un ratio de ahorro superior a los que pagan una hipoteca. Intenta optimizar algunos gastos de la vivienda y reducir ciertos gastos discrecionales de tu día a día. Hay que intentar que el dinero que iría a una hipoteca se vaya casi al 100% al ahorro.",

      // 2.2.2.2 + Ratio ahorro BIEN/SUPER BIEN
      ratio_mal_ahorro_bien: "Tienes un ratio de vivienda mayor del adecuado. Como tu ratio de ahorro sí está en línea con lo recomendado solo te pedimos que mires si puedes ajustar alguno de los gastos de tu casa. Puede que algo sea optimizable en el corto plazo"
    },

    // --------------------------------------------------------------------------
    // 2.3 HIPOTECA
    // --------------------------------------------------------------------------
    hipoteca: {
      comun: "Actualmente en España el gasto más relevante es la vivienda. Y en tu caso, el gasto principal dentro de la vivienda es claramente tu cuota de hipoteca.",

      // MATRIZ 2x2: Ratio Vivienda × Ratio Ahorro

      // 2.3.1 Ratio vivienda BIEN/SUPER BIEN
      // Perfilado Vivienda BIEN: "Entre el 33% y el 40%"
      // Perfilado Vivienda SUPER BIEN: "Menos de un tercio (33%)"

      // 2.3.1.1 + Ratio ahorro BIEN/SUPER BIEN
      // Perfilado Ahorro BIEN: "Entre el 10% y el 30%"
      // Perfilado Ahorro SUPER BIEN: "Entre el 30% y el 40%", "Más del 40%"
      ratio_bien_ahorro_bien: "Tu ratio de vivienda es adecuado, y además está acompañado de un buen ratio de ahorro. Con estos datos podemos decir que vas por el buen camino en el control de tus finanzas.",

      // 2.3.1.2 + Ratio ahorro MAL
      // Perfilado Ahorro MAL: "No ahorro nada", "Menos del 10%"
      ratio_bien_ahorro_mal: "Falta texto para este caso",

      // 2.3.2 Ratio vivienda MAL
      // Perfilado Vivienda MAL: "Más del 50%", "Entre el 40% y el 50%"

      // 2.3.2.1 + Ratio ahorro MAL
      ratio_mal_ahorro_mal: "Estás gastando en la vivienda más de lo recomendado. Tus gastos en vivienda no deberían superar el 40% de tus ingresos y el de tu hipoteca debería ser del 30%. El superar estos ratios te está penalizando en tu ahorro. Tu ratio de ahorro es insuficiente y en tu caso una de las causas es el elevado gasto en tu vivienda.",

      // 2.3.2.2 + Ratio ahorro BIEN/SUPER BIEN
      ratio_mal_ahorro_bien: "Tienes un ratio de vivienda mayor del adecuado. Tus gastos en vivienda no deberían superar el 40% de tus ingresos y el de tu hipoteca debería ser del 30%. Como tu ratio de ahorro sí está en línea con lo recomendado solo te pedimos que mires si puedes ajustar alguno de los gastos de tu casa. Puede que algo sea optimizable en el corto plazo."
    }
  },

  // ==========================================================================
  // 3. AHORRO (cuando le preocupa)
  // ==========================================================================
  ahorro: {
    // Pregunta 17: Temas que preocupan
    // Pregunta 21: Ratio de ahorro
    // SOLO se muestra si menciona "ahorro" o "no llegar a final de mes" en preocupaciones

    general: "Nos transmites que entre los temas que te preocupan más está el ahorro y/o no llegar a final de mes.",

    // Texto que se repite siempre si le preocupa el ahorro
    particular_prefix: "Ya habíamos comentado anteriormente acerca de tu ratio de ahorro. En concreto nos respondiste que tu ahorro era",

    // Conclusión según estado de ahorro
    mal: "Falta texto para este caso",
    bien: "Falta texto para este caso"
  }
};

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Determina si es autónomo o cuenta ajena
 * Basado en pregunta 3 (situación laboral)
 */
function determinarSituacionLaboralParaColchon(userData) {
  const situacion = (userData.situacion_laboral || '').toLowerCase();

  // Autónomo: "Trabajo por cuenta propia"
  if (situacion.includes('cuenta propia') || situacion.includes('autónomo')) {
    return 'autonomo';
  }

  // Cuenta ajena (incluye):
  // - "Trabajo por cuenta ajena"
  // - "Estoy jubilado"
  // - contiene "funcionario"
  // - "No estoy trabajando" + pregunta 5 "Para mi unidad familiar"
  return 'cuenta_ajena';
}

/**
 * Determina el tipo de vivienda
 * Basado en pregunta 23
 */
function determinarTipoVivienda(userData) {
  const vivienda = (userData.vivienda_principal || '').toLowerCase();

  if (vivienda.includes('alquiler')) {
    return 'alquiler';
  } else if (vivienda.includes('pagad')) {
    return 'pagada';
  } else if (vivienda.includes('hipoteca')) {
    return 'hipoteca';
  }

  // Por defecto hipoteca si no se detecta
  return 'hipoteca';
}

/**
 * Verifica si le preocupa el ahorro
 * Basado en pregunta 17
 */
function lePreocupaElAhorro(userData) {
  const preocupaciones = (userData.temas_preocupan || '').toLowerCase();
  return preocupaciones.includes('ahorro') || preocupaciones.includes('fin de mes') || preocupaciones.includes('final de mes');
}

// ============================================================================
// GENERADORES DE BLOQUES
// ============================================================================

/**
 * Genera el bloque de colchón según el árbol de decisión
 */
function generarBloqueColchonArbol(userData, perfil) {
  const situacion = determinarSituacionLaboralParaColchon(userData);
  const estadoColchon = (perfil.colchon || '').toLowerCase();
  const respuestaUsuario = userData.colchon_liquido || 'No especificado';

  const bloques = [];

  // Nota inicial
  bloques.push("Ver la respuesta de la pregunta 3.");
  bloques.push("Solo va a tener impacto en lo relativo al colchón de emergencia. Pregunta 22.");
  bloques.push("");

  // Párrafo común (según sea autónomo o cuenta ajena)
  bloques.push(ARBOL_TEXTOS.colchon[situacion].comun);
  bloques.push("");

  // Párrafo de su respuesta
  bloques.push(`Respondiste: ${respuestaUsuario}`);
  bloques.push("");

  // Párrafo de conclusión (agrupamos bien y super bien)
  const esMal = estadoColchon.includes('mal');
  const esBienOSuperBien = estadoColchon.includes('bien') || estadoColchon.includes('super bien');

  if (esMal) {
    bloques.push(ARBOL_TEXTOS.colchon[situacion].mal);
  } else if (esBienOSuperBien) {
    bloques.push(ARBOL_TEXTOS.colchon[situacion].bien);
  }

  return bloques.join('\n');
}

/**
 * Genera el bloque de vivienda según el árbol de decisión
 */
function generarBloqueViviendaArbol(userData, perfil) {
  const tipoVivienda = determinarTipoVivienda(userData);
  const estadoVivienda = (perfil.vivienda || '').toLowerCase();
  const estadoAhorro = (perfil.ahorro || '').toLowerCase();
  const gastoVivienda = userData.gasto_vivienda || 'No especificado';

  const bloques = [];

  // Seleccionar conjunto de bloques según tipo de vivienda
  const bloquesVivienda = ARBOL_TEXTOS.vivienda[tipoVivienda];

  // Párrafo común
  bloques.push(bloquesVivienda.comun);
  bloques.push("");

  // Párrafo de su respuesta
  bloques.push(`En concreto destinas un ${gastoVivienda} de tus ingresos al pago de tu vivienda.`);
  bloques.push("");

  // Párrafo de conclusión - MATRIZ 2x2
  // Agrupamos bien y super bien para ambos ratios
  const ratioViviendaBien = estadoVivienda.includes('bien') || estadoVivienda.includes('super bien');
  const ratioAhorroBien = estadoAhorro.includes('bien') || estadoAhorro.includes('super bien');

  if (ratioViviendaBien && ratioAhorroBien) {
    bloques.push(bloquesVivienda.ratio_bien_ahorro_bien);
  } else if (ratioViviendaBien && !ratioAhorroBien) {
    bloques.push(bloquesVivienda.ratio_bien_ahorro_mal);
  } else if (!ratioViviendaBien && ratioAhorroBien) {
    bloques.push(bloquesVivienda.ratio_mal_ahorro_bien);
  } else { // ambos mal
    bloques.push(bloquesVivienda.ratio_mal_ahorro_mal);
  }

  return bloques.join('\n');
}

/**
 * Genera el bloque de ahorro (solo si le preocupa)
 */
function generarBloqueAhorroArbol(userData, perfil) {
  // Solo generar si le preocupa el ahorro
  if (!lePreocupaElAhorro(userData)) {
    return null; // No generar este bloque
  }

  const estadoAhorro = (perfil.ahorro || '').toLowerCase();
  const respuestaAhorro = userData.porcentaje_ahorro || 'No especificado';

  const bloques = [];

  // Párrafo general (siempre)
  bloques.push(ARBOL_TEXTOS.ahorro.general);
  bloques.push("");

  // Párrafo particular (siempre)
  bloques.push(`${ARBOL_TEXTOS.ahorro.particular_prefix} ${respuestaAhorro}`);
  bloques.push("");

  // Conclusión según estado (agrupamos bien y super bien)
  const esMal = estadoAhorro.includes('mal');
  const esBienOSuperBien = estadoAhorro.includes('bien') || estadoAhorro.includes('super bien');

  if (esMal) {
    bloques.push(ARBOL_TEXTOS.ahorro.mal);
  } else if (esBienOSuperBien) {
    bloques.push(ARBOL_TEXTOS.ahorro.bien);
  }

  return bloques.join('\n');
}

// ============================================================================
// FUNCIÓN PRINCIPAL: GENERADOR DE INSIGHT
// ============================================================================

/**
 * Genera el insight completo navegando el árbol de decisión
 * SIN usar OpenAI - Ahorro de 100% en tokens
 *
 * @param {Object} userData - Datos del usuario del formulario
 * @param {Object} perfil - Objeto con perfilado (mal/bien/super bien)
 * @returns {String} Insight completo
 */
function generarInsightDesdeArbolDecision(userData, perfil) {
  try {
    Logger.log('🌳 Generando insight desde árbol de decisión (SIN OpenAI)...');

    const secciones = [];

    // ========== SECCIÓN 1: COLCHÓN DE EMERGENCIA ==========
    if (perfil.colchon) {
      secciones.push("# 1. AUTÓNOMO/CUENTA AJENA");
      secciones.push("");
      secciones.push(generarBloqueColchonArbol(userData, perfil));
      secciones.push("");
      secciones.push("---");
      secciones.push("");
    }

    // ========== SECCIÓN 2: VIVIENDA ==========
    if (perfil.vivienda) {
      secciones.push("# 2. ALQUILER/HIPOTECA/CASA PAGADA");
      secciones.push("");
      secciones.push(generarBloqueViviendaArbol(userData, perfil));
      secciones.push("");
      secciones.push("---");
      secciones.push("");
    }

    // ========== SECCIÓN 3: AHORRO (solo si le preocupa) ==========
    const bloqueAhorro = generarBloqueAhorroArbol(userData, perfil);
    if (bloqueAhorro) {
      secciones.push("# 3. AHORRO");
      secciones.push("");
      secciones.push(bloqueAhorro);
    }

    const insightFinal = secciones.join('\n');

    Logger.log('✅ Insight generado desde árbol de decisión');
    Logger.log('📊 Tokens ahorrados: ~3500 tokens (100% de ahorro)');
    Logger.log(`📝 Longitud del insight: ${insightFinal.length} caracteres`);

    return insightFinal;

  } catch (error) {
    Logger.log('❌ Error generando insight desde árbol: ' + error.toString());
    return 'Error al generar insight. Revisa los logs para más detalles.';
  }
}

// ============================================================================
// EXPORTAR (para usar en Codigo.js)
// ============================================================================

// Estas funciones están disponibles para ser llamadas desde Codigo.js
// No necesitas hacer nada más, solo copiar este archivo completo al final de Codigo.js
