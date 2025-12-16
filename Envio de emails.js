// ============================================================================
// ENVÍO DE EMAIL POR GMAIL
// ============================================================================

/**
 * Función de logging compatible
 */
function log(message) {
  Logger.log(message);
  console.log(message);
}

/**
 * Lee la plantilla HTML desde Google Drive
 */
function obtenerPlantillaHTML() {
  try {
    if (CONFIG.PLANTILLA_HTML_FILE_ID === 'TU_FILE_ID_AQUI') {
      throw new Error('Debes configurar PLANTILLA_HTML_FILE_ID en CONFIG');
    }
    
    log('📄 Leyendo plantilla HTML desde Drive...');
    const archivo = DriveApp.getFileById(CONFIG.PLANTILLA_HTML_FILE_ID);
    const htmlTemplate = archivo.getBlob().getDataAsString('UTF-8');
    log('✅ Plantilla cargada: ' + archivo.getName());
    
    return htmlTemplate;
    
  } catch (error) {
    log('❌ Error al leer plantilla HTML: ' + error.toString());
    throw error;
  }
}

/**
 * Personaliza la plantilla HTML con datos del usuario
 */
function personalizarPlantilla(htmlTemplate, datos) {
  const nombre = datos.nombre || datos.email.split('@')[0];
  const nombreCapitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1);
  const anioActual = new Date().getFullYear();
  
  // Convertir saltos de línea a <br> para HTML
  const insightHTML = datos.insight.replace(/\n/g, '<br>');
  
  return htmlTemplate
    .replace(/\{\{NOMBRE\}\}/g, nombreCapitalizado)
    .replace(/\{\{INSIGHT\}\}/g, insightHTML)
    .replace(/\{\{ANIO\}\}/g, anioActual);
}

/**
 * Envía email usando Gmail
 * NOTA: Para enviar desde hello@weavers.ai necesitas configurar ese email como alias en Gmail
 * Mientras tanto, se envía desde tu cuenta con el nombre "Weavers | Bienestar Financiero"
 */
function enviarEmailInsight(email, insight, userData) {
  try {
    log('\n📧 ═══════════════════════════════════════');
    log('📧 ENVIANDO EMAIL');
    log('📧 ═══════════════════════════════════════');
    log('Destinatario: ' + email);

    // Obtener y personalizar plantilla
    const htmlTemplate = obtenerPlantillaHTML();
    const htmlPersonalizado = personalizarPlantilla(htmlTemplate, {
      nombre: userData.nombre || email.split('@')[0],
      email: email,
      insight: insight
    });

    // Enviar email usando GmailApp
    // Si hello@weavers.ai está configurado como alias en Gmail,
    // descomenta la línea "from" en las opciones
    GmailApp.sendEmail(
      email,                          // destinatario
      CONFIG.EMAIL_ASUNTO,            // asunto
      '',                             // cuerpo en texto plano (vacío)
      {
        htmlBody: htmlPersonalizado,
        name: CONFIG.EMAIL_NOMBRE
        // from: CONFIG.EMAIL_REMITENTE  // Descomentar cuando configures el alias
      }
    );

    log('✅ Email enviado exitosamente a: ' + email);
    log('ℹ️ Remitente: ' + CONFIG.EMAIL_NOMBRE);
    return true;

  } catch (error) {
    log('❌ Error al enviar email: ' + error.toString());
    return false;
  }
}
