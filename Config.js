// ============================================================================
// CONFIGURACIÓN - MODIFICAR ESTAS VARIABLES
// ============================================================================

const CONFIG = {
  // API Keys
  OPENAI_API_KEY: 'xxx',
  MAILCHIMP_API_KEY: 'xx',
  MAILCHIMP_SERVER: 'us20',
  MAILCHIMP_LIST_ID: '41cb9ab9e2', // Modificar con tu List ID

  // Google Sheets
  SPREADSHEET_ID: '1zqbEWMkPqgsNPtN8T0SAG8qix6u5131eEV9Dm-J6Gkw',
  SHEET_NAME_DATA: 'Respuestas typeform',
  SHEET_NAME_PROMPTS: 'Prompts',

  MERGE_FIELD_TAG: 'INSIGHT',

  // NUEVO: Gmail
  EMAIL_REMITENTE: 'hello@weavers.ai',
  EMAIL_NOMBRE: 'Weavers | Bienestar Financiero',
  EMAIL_ASUNTO: 'Tu diagnóstico financiero personalizado está listo',

  // NUEVO: Plantilla HTML
  PLANTILLA_HTML_FILE_ID: '1av_w0EMsnHFmW-jSRgblZ12RXtU7sl4',  // ID del archivo HTML en Drive

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
    VIVIENDA_PRINCIPAL: 23, // X - Tu vivienda principal (alquiler/hipoteca/pagada)
    GASTO_VIVIENDA: 24, // Y - Gasto vivienda
    PORCENTAJE_DEUDA: 25, // Z - % deuda sin hipoteca
    CAPACIDAD_RECORTE: 26, // AA - Capacidad de recorte
    EDUCACION_FINANCIERA: 27, // AB - Nivel educación financiera
    // Preguntas de conocimiento financiero (28-32)
    PREGUNTA_100EUR: 28, // AC
    PREGUNTA_INFLACION: 29, // AD
    PREGUNTA_TIPOS_INTERES: 30, // AE
    PREGUNTA_HIPOTECA: 31, // AF
    PREGUNTA_ACCIONES: 32, // AG
    // Hábitos financieros (33-40)
    OCUPACION_FINANZAS: 33, // AH
    COMO_AHORRAS: 34,   // AI
    OBJETIVOS_AHORRO: 35, // AJ
    REVISION_CUENTAS: 36, // AK
    CONTROL_GASTOS: 37, // AL
    PRESUPUESTO: 38,    // AM
    MANEJO_IMPREVISTOS: 39, // AN
    ENTENDER_NOMINA: 40, // AO
    // Columnas de resultado
    GRACIAS: 41,        // AP - *¡GRACIAS!*
    SCORE: 42,          // AQ
    WINNING_OUTCOME_ID: 43, // AR
    ENDING_DISPLAYED_ID: 44, // AS
    SUBMITTED_AT: 45,   // AT
    TOKEN: 46,          // AU
    INSIGHT: 47         // AV - Columna donde se guardará el insight generado
  }
};
