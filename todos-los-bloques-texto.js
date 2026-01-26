// ============================================================================
// TODOS LOS BLOQUES DE TEXTO - Completo según especificaciones
// ============================================================================

const BLOQUES_COMPLETOS = {

  // ========== 1. COLCHÓN DE EMERGENCIA (Autónomo/Cuenta Ajena) ==========
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

  // ========== 2. VIVIENDA - ALQUILER ==========
  vivienda_alquiler: {
    comun: "Actualmente en España el gasto más relevante es la vivienda. En tu caso, que te encuentras en régimen de alquiler. Por estar en alquiler deberías tener un ratio de vivienda más bajo y un ratio de ahorro mayor que aquel que está pagando una hipoteca.",

    // 2.1. Ratio vivienda bien
    ratio_bien_ahorro_bien: "Tu ratio de vivienda es adecuado, y además está acompañado de un buen ratio de ahorro. Con estos datos podemos decir que vas en la buena dirección para generar el suficiente ahorro para la compra de una vivienda.",
    ratio_bien_ahorro_mal: "Tu ratio de vivienda es adecuado, pero sin embargo tienes un ratio de ahorro corto para el que deberías tener al estar en alquiler.",

    // 2.2. Ratio vivienda mal
    ratio_mal_ahorro_mal: "Estás gastando en la vivienda más de lo recomendado y además no estás ahorrando como debes, ya que al estar de alquiler deberías tener un ratio de ahorro superior a los que pagan una hipoteca. En el alquiler te debes gastar como máximo un 25% de tus ingresos y en el total de tu vivienda no puedes superar el 30%. Como los gastos de alquiler en el corto plazo son más complicados de ajustar, intenta mejorar el ratio de ahorro reduciendo los gastos discrecionales de tu día a día, es decir, aquellos que no son completamente necesarios.",
    ratio_mal_ahorro_bien: "Tienes un ratio de vivienda mayor del adecuado. En el alquiler te debes gastar como máximo un 25% de tus ingresos y en el total de tu vivienda no puedes superar el 30%. Como tu ratio de ahorro sí está en línea con lo recomendado solo te pedimos que mires si puedes ajustar alguno de los gastos de tu casa. Puede que algo sea optimizable en el corto plazo"
  },

  // ========== 3. VIVIENDA - CASA PAGADA ==========
  vivienda_pagada: {
    comun: "Actualmente en España el gasto más relevante es la vivienda. En tu caso no se puede tener mejores noticias. Esa reducción de gasto mensual al no tener que pagar ni hipoteca o alquiler debe ayudarte enormemente de aquí en adelante",

    // 2.1. Ratio vivienda bien
    ratio_bien_ahorro_bien: "Tu ratio de vivienda es adecuado, y además está acompañado de un buen ratio de ahorro. Con estos datos podemos decir que tienes una base excepcional para tu futuro.",
    ratio_bien_ahorro_mal: "Tu ratio de vivienda es adecuado, pero sin embargo tienes un ratio de ahorro corto para el que deberías conseguir al tener ya tu casa pagada. Es normal que con la casa pagada puedan aumentar otro tipo de gastos, pero en la medida de lo posible hay que ser exigente con el ratio de ahorro al estar en una situación mucho más favorable que los que tiene que pagar una hipoteca",

    // 2.2. Ratio vivienda mal
    ratio_mal_ahorro_mal: "Estás gastando en la vivienda más de lo recomendado y además no estás ahorrando como debes, ya que al tener ya la casa pagada deberías tener un ratio de ahorro superior a los que pagan una hipoteca. Intenta optimizar algunos gastos de la vivienda y reducir ciertos gastos discrecionales de tu día a día. Hay que intentar que el dinero que iría a una hipoteca se vaya casi al 100% al ahorro.",
    ratio_mal_ahorro_bien: "Tienes un ratio de vivienda mayor del adecuado. Como tu ratio de ahorro sí está en línea con lo recomendado solo te pedimos que mires si puedes ajustar alguno de los gastos de tu casa. Puede que algo sea optimizable en el corto plazo"
  },

  // ========== 4. VIVIENDA - HIPOTECA ==========
  vivienda_hipoteca: {
    comun: "Actualmente en España el gasto más relevante es la vivienda. Y en tu caso, el gasto principal dentro de la vivienda es claramente tu cuota de hipoteca.",

    // 2.1. Ratio vivienda bien
    ratio_bien_ahorro_bien: "Tu ratio de vivienda es adecuado, y además está acompañado de un buen ratio de ahorro. Con estos datos podemos decir que vas por el buen camino en el control de tus finanzas.",
    ratio_bien_ahorro_mal: "Tu ratio de vivienda es adecuado, pero tu ratio de ahorro podría mejorar. Intenta optimizar algunos gastos discrecionales para poder aumentar tu capacidad de ahorro mensual.",

    // 2.2. Ratio vivienda mal
    ratio_mal_ahorro_mal: "Estás gastando en la vivienda más de lo recomendado. Tus gastos en vivienda no deberían superar el 40% de tus ingresos y el de tu hipoteca debería ser del 30%. El superar estos ratios te está penalizando en tu ahorro. Tu ratio de ahorro es insuficiente y en tu caso una de las causas es el elevado gasto en tu vivienda.",
    ratio_mal_ahorro_bien: "Tienes un ratio de vivienda mayor del adecuado. Tus gastos en vivienda no deberían superar el 40% de tus ingresos y el de tu hipoteca debería ser del 30%. Como tu ratio de ahorro sí está en línea con lo recomendado solo te pedimos que mires si puedes ajustar alguno de los gastos de tu casa. Puede que algo sea optimizable en el corto plazo."
  },

  // ========== 5. AHORRO (cuando le preocupa) ==========
  ahorro_preocupacion: {
    general: "Nos transmites que entre los temas que te preocupan más está el ahorro y/o no llegar a final de mes.",

    // Estado ahorro mal
    ahorro_mal: "Tu preocupación por el ahorro está justificada. Basándonos en tu situación actual, deberías priorizar aumentar tu capacidad de ahorro. Revisa tus gastos discrecionales y establece objetivos concretos de ahorro mensual. Es fundamental que identifiques dónde puedes recortar gastos para mejorar tu capacidad de ahorro.",

    // Estado ahorro bien
    ahorro_bien: "Aunque el ahorro te preocupa, los números muestran que lo estás haciendo bien. Tu ratio de ahorro es adecuado para tu situación. Continúa con esta disciplina y considera establecer objetivos de ahorro específicos para tus metas a medio y largo plazo.",

    // Estado ahorro super bien
    ahorro_super_bien: "Tu preocupación por el ahorro es comprensible, pero puedes estar tranquilo. Los números muestran que lo estás haciendo muy bien. Tu ratio de ahorro es excelente. Ahora el siguiente paso es optimizar ese ahorro: diversifica, establece objetivos claros y considera opciones de inversión acordes a tu perfil de riesgo."
  },

  // ========== 6. DEUDA (sin hipoteca) ==========
  deuda: {
    mal: {
      intro: "Tu nivel de deuda sin contar la hipoteca está por encima de lo recomendable.",
      recomendacion: "Lo ideal es que la deuda sin hipoteca (préstamos personales, tarjetas de crédito, etc.) no supere el 10% de tus ingresos anuales. Deberías priorizar la amortización de estas deudas antes que cualquier otro objetivo financiero, ya que normalmente tienen tipos de interés altos que te penalizan mucho. Establece un plan para reducirla lo antes posible."
    },
    bien: {
      intro: "Tu nivel de deuda sin contar la hipoteca está dentro de lo razonable.",
      recomendacion: "Mantén este nivel bajo control y evita que crezca. Recuerda que la deuda sin hipoteca no debería superar el 10% de tus ingresos anuales. Si puedes, amortiza anticipadamente para liberar capacidad financiera."
    },
    super_bien: {
      intro: "Enhorabuena, no tienes deuda sin contar la hipoteca.",
      recomendacion: "Esta es una situación ideal. Mantente así y evita caer en la tentación de financiar gastos no esenciales. Si en el futuro necesitas financiación, asegúrate de que sea para inversiones que generen valor (formación, vivienda, etc.) y nunca para consumo."
    }
  },

  // ========== 7. CAPACIDAD DE REACCIÓN ==========
  capacidad_reaccion: {
    mal: {
      intro: "Tu capacidad de reacción ante imprevistos es limitada.",
      recomendacion: "Esto significa que si surge un gasto inesperado o una reducción de ingresos, te costará hacerle frente. Es fundamental que trabajes en mejorar tu colchón de emergencia y en aumentar tu ratio de ahorro. Revisa tus gastos fijos y discrecionales para identificar dónde puedes optimizar."
    },
    bien: {
      intro: "Tu capacidad de reacción ante imprevistos es adecuada.",
      recomendacion: "Tienes margen para afrontar gastos inesperados o una reducción temporal de ingresos. Mantén este nivel y sigue trabajando en fortalecer tu posición financiera. Un buen siguiente paso sería optimizar dónde tienes tu ahorro para que trabaje mejor para ti."
    },
    muy_bien: {
      intro: "Tu capacidad de reacción ante imprevistos es excelente.",
      recomendacion: "Estás en una posición muy sólida para afrontar cualquier imprevisto económico. Ahora puedes centrarte en objetivos financieros a medio y largo plazo: inversión, planificación de la jubilación, objetivos vitales importantes, etc. Tu estabilidad te permite pensar en hacer crecer tu patrimonio de forma estratégica."
    }
  }
};

// ============================================================================
// FUNCIONES GENERADORAS COMPLETAS
// ============================================================================

/**
 * Genera el bloque completo de colchón
 */
function generarBloqueColchonCompleto(userData, perfil) {
  const situacion = determinarSituacionLaboral(userData);
  const estadoColchon = perfil.colchon ? perfil.colchon.toLowerCase() : '';
  const respuestaUsuario = userData.colchon_liquido || 'No especificado';

  const bloques = [];

  // Referencia a pregunta 3
  bloques.push("Ver la respuesta de la pregunta 3.");
  bloques.push("Solo va a tener impacto en lo relativo al colchón de emergencia. Pregunta 22.");
  bloques.push("");

  // Párrafo común
  if (situacion === 'autonomo') {
    bloques.push(BLOQUES_COMPLETOS.colchon.autonomo.comun);
  } else {
    bloques.push(BLOQUES_COMPLETOS.colchon.cuenta_ajena.comun);
  }

  // Párrafo de respuesta
  bloques.push("");
  bloques.push(`Respondiste: ${respuestaUsuario}`);
  bloques.push("");

  // Párrafo de conclusión
  // NOTA: "bien" y "super bien" se tratan igual para esta lógica
  if (estadoColchon.includes('mal')) {
    bloques.push(situacion === 'autonomo'
      ? BLOQUES_COMPLETOS.colchon.autonomo.mal
      : BLOQUES_COMPLETOS.colchon.cuenta_ajena.mal);
  } else if (estadoColchon.includes('bien') || estadoColchon.includes('super bien')) {
    bloques.push(situacion === 'autonomo'
      ? BLOQUES_COMPLETOS.colchon.autonomo.bien
      : BLOQUES_COMPLETOS.colchon.cuenta_ajena.bien);
  }

  return bloques.join('\n');
}

/**
 * Genera el bloque completo de vivienda
 */
function generarBloqueViviendaCompleto(userData, perfil) {
  const tipoVivienda = determinarTipoVivienda(userData);
  const estadoVivienda = perfil.vivienda ? perfil.vivienda.toLowerCase() : '';
  const estadoAhorro = perfil.ahorro ? perfil.ahorro.toLowerCase() : '';
  const gastoVivienda = userData.gasto_vivienda || 'No especificado';

  const bloques = [];

  // Seleccionar conjunto de bloques según tipo de vivienda
  let bloquesVivienda;
  if (tipoVivienda === 'alquiler') {
    bloquesVivienda = BLOQUES_COMPLETOS.vivienda_alquiler;
  } else if (tipoVivienda === 'pagada') {
    bloquesVivienda = BLOQUES_COMPLETOS.vivienda_pagada;
  } else {
    bloquesVivienda = BLOQUES_COMPLETOS.vivienda_hipoteca;
  }

  // Párrafo común
  bloques.push(bloquesVivienda.comun);
  bloques.push("");

  // Párrafo de respuesta
  bloques.push(`En concreto destinas un ${gastoVivienda} de tus ingresos al pago de tu vivienda.`);
  bloques.push("");

  // Párrafo de conclusión
  // NOTA: "bien" y "super bien" se tratan igual para esta lógica
  const ratioViviendaBien = estadoVivienda.includes('bien') || estadoVivienda.includes('super bien');
  const ratioAhorroBien = estadoAhorro.includes('bien') || estadoAhorro.includes('super bien');

  if (ratioViviendaBien && ratioAhorroBien) {
    bloques.push(bloquesVivienda.ratio_bien_ahorro_bien);
  } else if (ratioViviendaBien && !ratioAhorroBien) {
    bloques.push(bloquesVivienda.ratio_bien_ahorro_mal);
  } else if (!ratioViviendaBien && !ratioAhorroBien) {
    bloques.push(bloquesVivienda.ratio_mal_ahorro_mal);
  } else {
    bloques.push(bloquesVivienda.ratio_mal_ahorro_bien);
  }

  return bloques.join('\n');
}

/**
 * Genera el bloque de ahorro cuando le preocupa
 */
function generarBloqueAhorroCompleto(userData, perfil) {
  const bloques = [];
  const porcentajeAhorro = userData.porcentaje_ahorro || 'No especificado';
  const estadoAhorro = perfil.ahorro ? perfil.ahorro.toLowerCase() : '';

  // Párrafo general
  bloques.push(BLOQUES_COMPLETOS.ahorro_preocupacion.general);
  bloques.push("");

  // Párrafo particular
  bloques.push(`Ya habíamos comentado anteriormente acerca de tu ratio de ahorro. En concreto nos respondiste que tu ahorro era ${porcentajeAhorro}`);
  bloques.push("");

  // Conclusión según estado
  if (estadoAhorro.includes('mal')) {
    bloques.push(BLOQUES_COMPLETOS.ahorro_preocupacion.ahorro_mal);
  } else if (estadoAhorro.includes('super bien')) {
    bloques.push(BLOQUES_COMPLETOS.ahorro_preocupacion.ahorro_super_bien);
  } else if (estadoAhorro.includes('bien')) {
    bloques.push(BLOQUES_COMPLETOS.ahorro_preocupacion.ahorro_bien);
  }

  return bloques.join('\n');
}

/**
 * Genera el bloque de deuda
 */
function generarBloqueDeudaCompleto(userData, perfil) {
  const bloques = [];
  const estadoDeuda = perfil.deuda ? perfil.deuda.toLowerCase() : '';
  const porcentajeDeuda = userData.porcentaje_deuda || 'No especificado';

  let bloqueDeuda;
  if (estadoDeuda.includes('super bien')) {
    bloqueDeuda = BLOQUES_COMPLETOS.deuda.super_bien;
  } else if (estadoDeuda.includes('bien')) {
    bloqueDeuda = BLOQUES_COMPLETOS.deuda.bien;
  } else {
    bloqueDeuda = BLOQUES_COMPLETOS.deuda.mal;
  }

  bloques.push(bloqueDeuda.intro);
  bloques.push("");
  bloques.push(`Respondiste que tu deuda representa un ${porcentajeDeuda} de tus ingresos anuales.`);
  bloques.push("");
  bloques.push(bloqueDeuda.recomendacion);

  return bloques.join('\n');
}

/**
 * Genera el bloque de capacidad de reacción
 */
function generarBloqueCapacidadReaccionCompleto(userData, perfil) {
  const bloques = [];
  const estadoCapacidad = perfil.ahorro_capacidad_reaccion ? perfil.ahorro_capacidad_reaccion.toLowerCase() : '';
  const capacidadRecorte = userData.capacidad_recorte || 'No especificado';

  let bloqueCapacidad;
  if (estadoCapacidad.includes('muy bien')) {
    bloqueCapacidad = BLOQUES_COMPLETOS.capacidad_reaccion.muy_bien;
  } else if (estadoCapacidad.includes('bien')) {
    bloqueCapacidad = BLOQUES_COMPLETOS.capacidad_reaccion.bien;
  } else {
    bloqueCapacidad = BLOQUES_COMPLETOS.capacidad_reaccion.mal;
  }

  bloques.push(bloqueCapacidad.intro);
  bloques.push("");
  bloques.push(`Nos indicaste que tu capacidad de recortar gastos es: ${capacidadRecorte}`);
  bloques.push("");
  bloques.push(bloqueCapacidad.recomendacion);

  return bloques.join('\n');
}

/**
 * FUNCIÓN PRINCIPAL: Genera el insight completo con TODOS los bloques
 */
function generarInsightCompletoOptimizado(userData, perfil) {
  const secciones = [];

  // ========== SECCIÓN 1: COLCHÓN ==========
  if (perfil.colchon) {
    secciones.push("# 1. AUTÓNOMO/CUENTA AJENA\n");
    secciones.push(generarBloqueColchonCompleto(userData, perfil));
    secciones.push("\n---\n");
  }

  // ========== SECCIÓN 2: VIVIENDA ==========
  if (perfil.vivienda) {
    secciones.push("# 2. ALQUILER/HIPOTECA/CASA PAGADA\n");
    secciones.push(generarBloqueViviendaCompleto(userData, perfil));
    secciones.push("\n---\n");
  }

  // ========== SECCIÓN 3: AHORRO (solo si le preocupa) ==========
  const temasPreocupan = (userData.temas_preocupan || '').toLowerCase();
  if (temasPreocupan.includes('ahorro') || temasPreocupan.includes('fin de mes')) {
    secciones.push("# 3. AHORRO\n");
    secciones.push(generarBloqueAhorroCompleto(userData, perfil));
    secciones.push("\n---\n");
  }

  // ========== SECCIÓN 4: DEUDA ==========
  if (perfil.deuda) {
    secciones.push("# 4. DEUDA\n");
    secciones.push(generarBloqueDeudaCompleto(userData, perfil));
    secciones.push("\n---\n");
  }

  // ========== SECCIÓN 5: CAPACIDAD DE REACCIÓN ==========
  if (perfil.ahorro_capacidad_reaccion) {
    secciones.push("# 5. CAPACIDAD DE REACCIÓN\n");
    secciones.push(generarBloqueCapacidadReaccionCompleto(userData, perfil));
  }

  return secciones.join('\n');
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

function determinarSituacionLaboral(userData) {
  const situacion = (userData.situacion_laboral || '').toLowerCase();

  if (situacion.includes('cuenta propia') || situacion.includes('autónomo')) {
    return 'autonomo';
  }

  return 'cuenta_ajena';
}

function determinarTipoVivienda(userData) {
  const vivienda = (userData.vivienda_principal || '').toLowerCase();

  if (vivienda.includes('alquiler')) {
    return 'alquiler';
  } else if (vivienda.includes('pagad')) {
    return 'pagada';
  } else if (vivienda.includes('hipoteca')) {
    return 'hipoteca';
  }

  return 'hipoteca';
}
