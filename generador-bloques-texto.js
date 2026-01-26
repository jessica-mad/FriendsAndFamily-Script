// ============================================================================
// GENERADOR DE BLOQUES DE TEXTO - OPTIMIZADO PARA AHORRO DE TOKENS
// ============================================================================

/**
 * Sistema de bloques reutilizables para generar respuestas financieras
 * SIN necesidad de OpenAI - Ahorra ~80-90% de tokens
 */

// ============================================================================
// BLOQUES DE TEXTO REUTILIZABLES
// ============================================================================

const BLOQUES_TEXTO = {
  // ========== COLCHÓN DE EMERGENCIA ==========
  colchon: {
    autonomo: {
      comun: "Como autónomo tus ingresos mensuales son irregulares. Por ello se recomienda tener un colchón de emergencia superior a 9 meses de tus ingresos, e idealmente 12. Recuerda que basta tener 3 meses de ingresos en la cuenta corriente y el resto del colchón mejor tenerlo en un producto remunerado y líquido.",
      mal: "El colchón emergencia es fundamental para tu estabilidad económica. Es el primer objetivo que te tienes que marcar en tu ahorro. Cuando lo tengas cubierto tal y como te hemos indicado habrás logrado un gran paso.",
      bien: "El colchón emergencia es fundamental para tu estabilidad económica. Es el primer objetivo que te tienes que marcar en tu ahorro. Ahora mismo lo tienes bien controlado. Sigue cuidándolo. Cuando tengas un gasto para una emergencia tira de él."
    },
    cuenta_ajena: {
      comun: "Como norma general se recomienda tener un colchón de emergencia superior a 6 meses de tus ingresos. Recuerda que basta tener 3 meses de ingresos en la cuenta corriente y el resto del colchón mejor tenerlo en un producto remunerado y líquido.",
      mal: "El colchón emergencia es fundamental para tu estabilidad económica. Es el primer objetivo que te tienes que marcar en tu ahorro. Cuando lo tengas cubierto tal y como te hemos indicado habrás logrado un gran paso.",
      bien: "El colchón emergencia es fundamental para tu estabilidad económica. Es el primer objetivo que te tienes que marcar en tu ahorro. Ahora mismo lo tienes bien controlado. Sigue cuidándolo. Cuando tengas un gasto para una emergencia tira de él."
    }
  },

  // ========== VIVIENDA - ALQUILER ==========
  vivienda_alquiler: {
    comun: "Actualmente en España el gasto más relevante es la vivienda. En tu caso, que te encuentras en régimen de alquiler. Por estar en alquiler deberías tener un ratio de vivienda más bajo y un ratio de ahorro mayor que aquel que está pagando una hipoteca.",
    ratio_bien_ahorro_bien: "Tu ratio de vivienda es adecuado, y además está acompañado de un buen ratio de ahorro. Con estos datos podemos decir que vas en la buena dirección para generar el suficiente ahorro para la compra de una vivienda.",
    ratio_bien_ahorro_mal: "Tu ratio de vivienda es adecuado, pero sin embargo tienes un ratio de ahorro corto para el que deberías tener al estar en alquiler.",
    ratio_mal_ahorro_mal: "Estás gastando en la vivienda más de lo recomendado y además no estás ahorrando como debes, ya que al estar de alquiler deberías tener un ratio de ahorro superior a los que pagan una hipoteca. En el alquiler te debes gastar como máximo un 25% de tus ingresos y en el total de tu vivienda no puedes superar el 30%. Como los gastos de alquiler en el corto plazo son más complicados de ajustar, intenta mejorar el ratio de ahorro reduciendo los gastos discrecionales de tu día a día, es decir, aquellos que no son completamente necesarios.",
    ratio_mal_ahorro_bien: "Tienes un ratio de vivienda mayor del adecuado. En el alquiler te debes gastar como máximo un 25% de tus ingresos y en el total de tu vivienda no puedes superar el 30%. Como tu ratio de ahorro sí está en línea con lo recomendado solo te pedimos que mires si puedes ajustar alguno de los gastos de tu casa. Puede que algo sea optimizable en el corto plazo"
  },

  // ========== VIVIENDA - CASA PAGADA ==========
  vivienda_pagada: {
    comun: "Actualmente en España el gasto más relevante es la vivienda. En tu caso no se puede tener mejores noticias. Esa reducción de gasto mensual al no tener que pagar ni hipoteca o alquiler debe ayudarte enormemente de aquí en adelante",
    ratio_bien_ahorro_bien: "Tu ratio de vivienda es adecuado, y además está acompañado de un buen ratio de ahorro. Con estos datos podemos decir que tienes una base excepcional para tu futuro.",
    ratio_bien_ahorro_mal: "Tu ratio de vivienda es adecuado, pero sin embargo tienes un ratio de ahorro corto para el que deberías conseguir al tener ya tu casa pagada. Es normal que con la casa pagada puedan aumentar otro tipo de gastos, pero en la medida de lo posible hay que ser exigente con el ratio de ahorro al estar en una situación mucho más favorable que los que tiene que pagar una hipoteca",
    ratio_mal_ahorro_mal: "Estás gastando en la vivienda más de lo recomendado y además no estás ahorrando como debes, ya que al tener ya la casa pagada deberías tener un ratio de ahorro superior a los que pagan una hipoteca. Intenta optimizar algunos gastos de la vivienda y reducir ciertos gastos discrecionales de tu día a día. Hay que intentar que el dinero que iría a una hipoteca se vaya casi al 100% al ahorro.",
    ratio_mal_ahorro_bien: "Tienes un ratio de vivienda mayor del adecuado. Como tu ratio de ahorro sí está en línea con lo recomendado solo te pedimos que mires si puedes ajustar alguno de los gastos de tu casa. Puede que algo sea optimizable en el corto plazo"
  },

  // ========== VIVIENDA - HIPOTECA ==========
  vivienda_hipoteca: {
    comun: "Actualmente en España el gasto más relevante es la vivienda. Y en tu caso, el gasto principal dentro de la vivienda es claramente tu cuota de hipoteca.",
    ratio_bien_ahorro_bien: "Tu ratio de vivienda es adecuado, y además está acompañado de un buen ratio de ahorro. Con estos datos podemos decir que vas por el buen camino en el control de tus finanzas.",
    ratio_bien_ahorro_mal: "Tu ratio de vivienda es adecuado, pero tu ratio de ahorro podría mejorar. Intenta optimizar algunos gastos discrecionales para poder aumentar tu capacidad de ahorro mensual.",
    ratio_mal_ahorro_mal: "Estás gastando en la vivienda más de lo recomendado. Tus gastos en vivienda no deberían superar el 40% de tus ingresos y el de tu hipoteca debería ser del 30%. El superar estos ratios te está penalizando en tu ahorro. Tu ratio de ahorro es insuficiente y en tu caso una de las causas es el elevado gasto en tu vivienda.",
    ratio_mal_ahorro_bien: "Tienes un ratio de vivienda mayor del adecuado. Tus gastos en vivienda no deberían superar el 40% de tus ingresos y el de tu hipoteca debería ser del 30%. Como tu ratio de ahorro sí está en línea con lo recomendado solo te pedimos que mires si puedes ajustar alguno de los gastos de tu casa. Puede que algo sea optimizable en el corto plazo."
  }
};

// ============================================================================
// FUNCIONES DE GENERACIÓN DE BLOQUES
// ============================================================================

/**
 * Genera el bloque de texto sobre colchón de emergencia
 */
function generarBloqueColchon(userData, perfil) {
  const situacion = determinarSituacionLaboral(userData);
  const estadoColchon = perfil.colchon ? perfil.colchon.toLowerCase() : '';
  const respuestaUsuario = userData.colchon_liquido || 'No especificado';

  let bloques = [];

  // Párrafo común
  if (situacion === 'autonomo') {
    bloques.push(BLOQUES_TEXTO.colchon.autonomo.comun);
  } else {
    bloques.push(BLOQUES_TEXTO.colchon.cuenta_ajena.comun);
  }

  // Párrafo de respuesta
  bloques.push(`Respondiste: ${respuestaUsuario}`);

  // Párrafo de conclusión
  // NOTA: "bien" y "super bien" se tratan igual para esta lógica
  if (estadoColchon.includes('mal')) {
    bloques.push(situacion === 'autonomo'
      ? BLOQUES_TEXTO.colchon.autonomo.mal
      : BLOQUES_TEXTO.colchon.cuenta_ajena.mal);
  } else if (estadoColchon.includes('bien') || estadoColchon.includes('super bien')) {
    bloques.push(situacion === 'autonomo'
      ? BLOQUES_TEXTO.colchon.autonomo.bien
      : BLOQUES_TEXTO.colchon.cuenta_ajena.bien);
  }

  return bloques.join('\n\n');
}

/**
 * Genera el bloque de texto sobre vivienda
 */
function generarBloqueVivienda(userData, perfil) {
  const tipoVivienda = determinarTipoVivienda(userData);
  const estadoVivienda = perfil.vivienda ? perfil.vivienda.toLowerCase() : '';
  const estadoAhorro = perfil.ahorro ? perfil.ahorro.toLowerCase() : '';
  const gastoVivienda = userData.gasto_vivienda || 'No especificado';

  let bloques = [];

  // Seleccionar conjunto de bloques según tipo de vivienda
  let bloquesVivienda;
  if (tipoVivienda === 'alquiler') {
    bloquesVivienda = BLOQUES_TEXTO.vivienda_alquiler;
  } else if (tipoVivienda === 'pagada') {
    bloquesVivienda = BLOQUES_TEXTO.vivienda_pagada;
  } else { // hipoteca
    bloquesVivienda = BLOQUES_TEXTO.vivienda_hipoteca;
  }

  // Párrafo común
  bloques.push(bloquesVivienda.comun);

  // Párrafo de respuesta
  bloques.push(`En concreto destinas un ${gastoVivienda} de tus ingresos al pago de tu vivienda.`);

  // Párrafo de conclusión - combinar estado de vivienda y ahorro
  // NOTA: "bien" y "super bien" se tratan igual para esta lógica
  const ratioViviendaBien = estadoVivienda.includes('bien') || estadoVivienda.includes('super bien');
  const ratioAhorroBien = estadoAhorro.includes('bien') || estadoAhorro.includes('super bien');

  if (ratioViviendaBien && ratioAhorroBien) {
    bloques.push(bloquesVivienda.ratio_bien_ahorro_bien);
  } else if (ratioViviendaBien && !ratioAhorroBien) {
    bloques.push(bloquesVivienda.ratio_bien_ahorro_mal);
  } else if (!ratioViviendaBien && !ratioAhorroBien) {
    bloques.push(bloquesVivienda.ratio_mal_ahorro_mal);
  } else if (!ratioViviendaBien && ratioAhorroBien) {
    bloques.push(bloquesVivienda.ratio_mal_ahorro_bien);
  }

  return bloques.join('\n\n');
}

/**
 * Genera el insight completo componiendo todos los bloques
 */
function generarInsightOptimizado(userData, perfil) {
  const secciones = [];

  // Sección 1: Colchón de emergencia
  if (perfil.colchon) {
    secciones.push('## COLCHÓN DE EMERGENCIA\n' + generarBloqueColchon(userData, perfil));
  }

  // Sección 2: Vivienda
  if (perfil.vivienda) {
    secciones.push('## TU VIVIENDA\n' + generarBloqueVivienda(userData, perfil));
  }

  // Sección 3: Ahorro (si es que se preocupa por el ahorro)
  const temasPreocupan = userData.temas_preocupan || '';
  if (temasPreocupan.toLowerCase().includes('ahorro')) {
    secciones.push('## TU AHORRO\n' + generarBloqueAhorro(userData, perfil));
  }

  return secciones.join('\n\n---\n\n');
}

/**
 * Genera el bloque de ahorro
 */
function generarBloqueAhorro(userData, perfil) {
  const bloques = [];
  const temasPreocupan = userData.temas_preocupan || '';
  const porcentajeAhorro = userData.porcentaje_ahorro || 'No especificado';
  const estadoAhorro = perfil.ahorro ? perfil.ahorro.toLowerCase() : '';

  // Párrafo general
  bloques.push("Nos transmites que entre los temas que te preocupan más está el ahorro y/o no llegar a final de mes.");

  // Párrafo particular
  bloques.push(`Ya habíamos comentado anteriormente acerca de tu ratio de ahorro. En concreto nos respondiste que tu ahorro era ${porcentajeAhorro}`);

  // Conclusión según estado
  if (estadoAhorro.includes('mal')) {
    bloques.push("Tu preocupación por el ahorro está justificada. Basándonos en tu situación actual, deberías priorizar aumentar tu capacidad de ahorro. Revisa tus gastos discrecionales y establece objetivos concretos de ahorro mensual.");
  } else if (estadoAhorro.includes('bien') || estadoAhorro.includes('super bien')) {
    bloques.push("Aunque el ahorro te preocupa, los números muestran que lo estás haciendo bien. Tu ratio de ahorro es adecuado para tu situación. Continúa con esta disciplina y considera establecer objetivos de ahorro específicos para tus metas a medio y largo plazo.");
  }

  return bloques.join('\n\n');
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Determina si la persona es autónomo o cuenta ajena
 */
function determinarSituacionLaboral(userData) {
  const situacion = (userData.situacion_laboral || '').toLowerCase();

  if (situacion.includes('cuenta propia') || situacion.includes('autónomo')) {
    return 'autonomo';
  }

  // Por defecto: cuenta ajena (incluye jubilados, funcionarios, etc.)
  return 'cuenta_ajena';
}

/**
 * Determina el tipo de vivienda: alquiler, hipoteca o pagada
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

  return 'hipoteca'; // Por defecto
}

// ============================================================================
// COMPARACIÓN DE USO DE TOKENS
// ============================================================================

/**
 * ANTES (con OpenAI buscando en árbol):
 * - System prompt: ~200 tokens
 * - Árbol de decisión completo: ~2000-3000 tokens
 * - Respuestas literales: ~50 tokens
 * - Respuesta de OpenAI: ~500 tokens
 * TOTAL: ~3000-4000 tokens POR USUARIO
 *
 * AHORA (con bloques en JavaScript):
 * - NO se usa OpenAI para buscar textos
 * - Los bloques se componen directamente en código
 * - OPCIONAL: Solo se usa OpenAI si quieres personalización extra del texto final
 * TOTAL: ~0 tokens (o ~500-1000 si usas OpenAI solo para personalizar el texto final)
 *
 * AHORRO: 80-90% de tokens
 */

// ============================================================================
// INTEGRACIÓN CON EL CÓDIGO EXISTENTE
// ============================================================================

/**
 * Esta función reemplaza a generateInsightFromArbolDecision()
 * y NO requiere llamar a OpenAI
 */
function generateInsightOptimizadoSinOpenAI(userData, perfil) {
  try {
    Logger.log('🚀 Generando insight con sistema optimizado (sin OpenAI)...');

    const insight = generarInsightOptimizado(userData, perfil);

    Logger.log('✅ Insight generado con sistema optimizado');
    Logger.log(`📊 Tokens ahorrados: ~3000-4000 tokens por usuario`);

    return insight;

  } catch (error) {
    Logger.log('Error generando insight optimizado: ' + error.toString());
    return 'Error al generar insight. Revisa los logs.';
  }
}

/**
 * OPCIONAL: Si quieres que OpenAI le dé un toque final al texto
 * (personalización, tono, etc.) pero usando muchos menos tokens
 */
function generateInsightOptimizadoConOpenAI(userData, perfil) {
  try {
    // 1. Generar insight base con bloques (SIN OpenAI)
    const insightBase = generarInsightOptimizado(userData, perfil);

    // 2. OPCIONAL: Enviar a OpenAI solo para dar tono/personalización
    const promptPersonalizacion = `Revisa el siguiente diagnóstico financiero y mejora ligeramente el tono para que sea más empático y cercano, SIN cambiar el contenido fundamental:

${insightBase}

Mantén toda la información técnica y los números. Solo mejora el tono.`;

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
      Logger.log('Error OpenAI API: ' + JSON.stringify(result.error));
      return insightBase; // Devolver versión sin personalizar
    }

    return result.choices[0].message.content;

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    // En caso de error, devolver la versión base
    return generarInsightOptimizado(userData, perfil);
  }
}
