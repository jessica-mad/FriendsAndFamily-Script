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
 * Envía email usando Gmail desde hello@weavers.ai
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
    
    // Enviar email
    MailApp.sendEmail({
      to: email,
      subject: CONFIG.EMAIL_ASUNTO,
      htmlBody: htmlPersonalizado,
      name: CONFIG.EMAIL_NOMBRE,
      from: CONFIG.EMAIL_REMITENTE
    });
    
    log('✅ Email enviado exitosamente a: ' + email);
    return true;
    
  } catch (error) {
    log('❌ Error al enviar email: ' + error.toString());
    return false;
  }
}
