// ============================================================================
// CONFIGURACIÓN - MODIFICAR ESTAS VARIABLES
// ============================================================================

const CONFIG = {
  // API Keys
  OPENAI_API_KEY: 'xxx',
  MAILCHIMP_API_KEY: 'xx',
  MAILCHIMP_SERVER: 'us20',
  MAILCHIMP_LIST_ID: '41cb9ab9e2', // Modificar con tu List ID

  MERGE_FIELD_TAG: 'INSIGHT',
  SHEET_NAME_DATA: 'Respuestas typeform',
  SHEET_NAME_PROMPTS: 'Prompts',

  // NUEVO: Gmail
  EMAIL_REMITENTE: 'hello@weavers.ai',
  EMAIL_NOMBRE: 'Weavers | Bienestar Financiero',
  EMAIL_ASUNTO: 'Tu diagnóstico financiero personalizado está listo',

  // NUEVO: Plantilla HTML
  PLANTILLA_HTML_FILE_ID: '1av_w0EMsnHFmW-jSRgbdlZ12RXtU7sl4',  // ID del archivo HTML en Drive

  // Tags Mailchimp
  TAG_PENDIENTE: 'insight-pendiente',
  TAG_ENVIADO: 'insight-enviado',

  // Columnas de Google Sheets (basado en el orden de Typeform)
  COLUMNS: {
    EMAIL: 0,           // A - Email
    EDAD: 1,            // B - ¿Qué edad tienes?
    GENERO: 2,          // C - Eres...
    SITUACION_LABORAL: 3, // D - Situación laboral
    TAMANO_EMPRESA: 4,  // E - Personas en empresa
    GASTOS_PARA: 5,     // F - ¿Haces números solo o para todos?
    UNIDAD_FAMILIAR: 6, // G - Personas en unidad familiar
    INTERES_FINANZAS: 7, // H - ¿Te interesan las finanzas?
    OPTIMISTA_PESIMISTA: 8, // I - Optimista o pesimista
    SATISFACCION: 9,    // J - Satisfacción financiera (1-5)
    CAPRICHOS: 10,      // K - Caprichos último mes
    PREOCUPACION_DINERO: 11, // L - Preocupación por dinero (1-5)
    LLEGAR_FIN_MES: 12, // M - Llegar a fin de mes
    ESTABILIDAD: 13,    // N - Estabilidad (1-5)
    CONTROL_DINERO: 14, // O - Control del dinero (1-5)
    DINERO_MERECIDO: 15, // P - Dinero que mereces
    FUTURO_FINANCIERO: 16, // Q - Futuro financiero
    TEMAS_PREOCUPAN: 17, // R - Qué temas preocupan
    LO_QUE_NECESITAS: 18, // S - Qué necesitas
    ESTRES_TIEMPO: 19,  // T - Relación estrés/tiempo
    INGRESOS_BRUTOS: 20, // U - Ingresos brutos anuales
    PORCENTAJE_AHORRO: 21, // V - % ahorro anual
    COLCHON_LIQUIDO: 22, // W - Colchón líquido
    GASTO_VIVIENDA: 23, // X - Gasto vivienda
    PORCENTAJE_DEUDA: 24, // Y - % deuda sin hipoteca
    CAPACIDAD_RECORTE: 25, // Z - Capacidad de recorte
    EDUCACION_FINANCIERA: 26, // AA - Nivel educación financiera
    // Preguntas de conocimiento financiero (27-31)
    PREGUNTA_100EUR: 27, // AB
    PREGUNTA_INFLACION: 28, // AC
    PREGUNTA_TIPOS_INTERES: 29, // AD
    PREGUNTA_HIPOTECA: 30, // AE
    PREGUNTA_ACCIONES: 31, // AF
    // Hábitos financieros (32-39)
    OCUPACION_FINANZAS: 32, // AG
    COMO_AHORRAS: 33,   // AH
    OBJETIVOS_AHORRO: 34, // AI
    REVISION_CUENTAS: 35, // AJ
    CONTROL_GASTOS: 36, // AK
    PRESUPUESTO: 37,    // AL
    MANEJO_IMPREVISTOS: 38, // AM
    ENTENDER_NOMINA: 39, // AN
    // Columnas de resultado
    GRACIAS: 40,        // AO - *¡GRACIAS!*
    SCORE: 41,          // AP
    WINNING_OUTCOME_ID: 42, // AQ
    ENDING_DISPLAYED_ID: 43, // AR
    SUBMITTED_AT: 44,   // AS
    TOKEN: 45,          // AT
    INSIGHT: 46         // AU - Columna donde se guardará el insight generado
  }
};
