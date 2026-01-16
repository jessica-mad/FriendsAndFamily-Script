// ============================================================================
// MENÚ PERSONALIZADO
// ============================================================================

/**
 * Trigger automático que se ejecuta al abrir el Google Sheets
 * NO ejecutar manualmente - se activa automáticamente al abrir el documento
 */
function onOpen() {
  instalarMenu();
}

/**
 * Función para instalar el menú manualmente
 * Ejecutar esta función desde el editor de scripts si el menú no aparece
 */
function instalarMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🤖 Weavers Automation')
    .addItem('⚙️ Configurar Trigger Automático', 'setupTrigger')
    .addSeparator()
    .addItem('✨ Generar Insights (Filas Seleccionadas)', 'generateInsightsForSelection')
    .addItem('✨ Generar Insights (Todas las Filas Vacías)', 'generateInsightsForEmptyRows')
    .addSeparator()
    .addItem('📧 Enviar a Mailchimp (Filas Seleccionadas)', 'sendToMailchimpSelection')
    .addItem('📧 Enviar a Mailchimp (Todas con Insight)', 'sendToMailchimpAll')
    .addSeparator()
    .addItem('📬 Enviar Emails (Filas Seleccionadas)', 'enviarEmailsSelection')
    .addItem('📬 Enviar Emails (Todos con Insight)', 'enviarEmailsAllPendientes')
    .addSeparator()
    .addItem('🧪 Probar Script con Última Fila', 'testScript')
    .addItem('🧪 Verificar Merge Field en Mailchimp', 'testMergeFieldCreation')
    .addItem('🧪 Probar Conexión Mailchimp', 'testMailchimpConnection')
    .addItem('🔍 Obtener List ID de Mailchimp', 'getMailchimpListId')
    .addItem('🔍 Debug: Probar envío a Mailchimp con logs', 'debugMailchimpSend')
    .addItem('🔍 Buscar contacto específico en Mailchimp', 'searchMemberInMailchimp')
    .addToUi();

  SpreadsheetApp.getUi().alert('✅ Menú instalado correctamente\n\nYa puedes usar "🤖 Weavers Automation" en la barra de menú.');
}

function searchMemberInMailchimp() {
  const ui = SpreadsheetApp.getUi();
  
  if (CONFIG.MAILCHIMP_LIST_ID === 'TU_LIST_ID_AQUI') {
    ui.alert('⚠️ Configura tu List ID primero');
    return;
  }
  
  const response = ui.prompt(
    'Buscar contacto en Mailchimp',
    'Ingresa el email del contacto:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() !== ui.Button.OK) {
    return;
  }
  
  const email = response.getResponseText().trim();
  
  if (!email || !email.includes('@')) {
    ui.alert('❌ Email inválido');
    return;
  }
  
  logDetailed('═══════════════════════════════════════════');
  logDetailed('🔍 BUSCANDO CONTACTO EN MAILCHIMP');
  logDetailed('═══════════════════════════════════════════');
  
  const member = checkIfMemberExists(email);
  
  if (member) {
    // Verificar los 3 campos de insight
    let insightInfo = '';
    if (member.merge_fields) {
      const insight1 = member.merge_fields.INSIGHT1 || '';
      const insight2 = member.merge_fields.INSIGHT2 || '';
      const insight3 = member.merge_fields.INSIGHT3 || '';
      
      insightInfo = '\n\nINSIGHTS:\n' +
                   'Parte 1: ' + (insight1 ? insight1.length + ' chars' : 'vacío') + '\n' +
                   'Parte 2: ' + (insight2 ? insight2.length + ' chars' : 'vacío') + '\n' +
                   'Parte 3: ' + (insight3 ? insight3.length + ' chars' : 'vacío');
    }
    
    ui.alert(
      '✅ CONTACTO ENCONTRADO\n\n' +
      'Email: ' + member.email_address + '\n' +
      'Status: ' + member.status + '\n' +
      'Rating: ' + member.member_rating + '\n' +
      'Último cambio: ' + member.last_changed +
      insightInfo + '\n\n' +
      'Revisa los logs para más detalles.'
    );
  } else {
    ui.alert(
      '❌ CONTACTO NO ENCONTRADO\n\n' +
      'El email ' + email + ' no existe en tu lista de Mailchimp.\n\n' +
      'Revisa los logs para más información.'
    );
  }
  
  logDetailed('═══════════════════════════════════════════');
}

// ============================================================================
// NUEVAS FUNCIONES DE DEBUG PARA MAILCHIMP
// ============================================================================

function getMailchimpListId() {
  try {
    logDetailed('🔍 OBTENIENDO LIST ID DE MAILCHIMP');
    
    const url = `https://${CONFIG.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists`;
    
    logDetailed('URL: ' + url);
    
    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + CONFIG.MAILCHIMP_API_KEY,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    });
    
    const code = response.getResponseCode();
    logDetailed('Response code: ' + code);
    
    if (code === 200) {
      const result = JSON.parse(response.getContentText());
      logDetailed('Número de listas encontradas: ' + result.lists.length);
      
      let message = '📋 LISTAS DISPONIBLES:\n\n';
      result.lists.forEach(function(list) {
        message += '• ' + list.name + '\n';
        message += '  ID: ' + list.id + '\n';
        message += '  Miembros: ' + list.stats.member_count + '\n\n';
        logDetailed('Lista: ' + list.name + ' (ID: ' + list.id + ')');
      });
      
      SpreadsheetApp.getUi().alert(message);
    } else {
      logDetailed('❌ Error: ' + response.getContentText());
      SpreadsheetApp.getUi().alert('❌ Error al obtener listas\n\n' + response.getContentText());
    }
    
  } catch (error) {
    logDetailed('❌ Excepción: ' + error.toString());
    SpreadsheetApp.getUi().alert('❌ Error: ' + error.toString());
  }
}

function getMailchimpMemberCount() {
  try {
    const url = `https://${CONFIG.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${CONFIG.MAILCHIMP_LIST_ID}`;
    
    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + CONFIG.MAILCHIMP_API_KEY,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() === 200) {
      const result = JSON.parse(response.getContentText());
      return {
        total: result.stats.member_count,
        subscribed: result.stats.member_count_since_send || result.stats.member_count,
        unsubscribed: result.stats.unsubscribe_count || 0,
        pending: result.stats.member_count - (result.stats.member_count_since_send || result.stats.member_count)
      };
    }
    return null;
  } catch (error) {
    logDetailed('Error al obtener count: ' + error);
    return null;
  }
}

function checkIfMemberExists(email) {
  try {
    const emailNormalizado = email.toLowerCase().trim();
    const subscriberHash = generateMD5Hash(emailNormalizado);
    
    const url = `https://${CONFIG.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${CONFIG.MAILCHIMP_LIST_ID}/members/${subscriberHash}`;
    
    logDetailed('\n🔍 VERIFICANDO SI EL CONTACTO EXISTE EN MAILCHIMP');
    logDetailed('Email buscado: ' + emailNormalizado);
    logDetailed('Hash: ' + subscriberHash);
    logDetailed('URL: ' + url);
    
    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + CONFIG.MAILCHIMP_API_KEY,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    });
    
    const code = response.getResponseCode();
    logDetailed('Response Code: ' + code);
    
    if (code === 200) {
      const member = JSON.parse(response.getContentText());
      logDetailed('✅ CONTACTO ENCONTRADO:');
      logDetailed('Email: ' + member.email_address);
      logDetailed('Status: ' + member.status);
      logDetailed('Member Rating: ' + member.member_rating);
      logDetailed('Last Changed: ' + member.last_changed);
      
      // Verificar los 3 merge fields
      if (member.merge_fields) {
        if (member.merge_fields.INSIGHT1) {
          logDetailed('✅ INSIGHT1 encontrado (' + member.merge_fields.INSIGHT1.length + ' chars)');
        }
        if (member.merge_fields.INSIGHT2) {
          logDetailed('✅ INSIGHT2 encontrado (' + member.merge_fields.INSIGHT2.length + ' chars)');
        }
        if (member.merge_fields.INSIGHT3) {
          logDetailed('✅ INSIGHT3 encontrado (' + member.merge_fields.INSIGHT3.length + ' chars)');
        }
      }
      
      // Verificar tags
      if (member.tags && member.tags.length > 0) {
        logDetailed('Tags: ' + member.tags.map(t => t.name).join(', '));
      } else {
        logDetailed('⚠️ Sin tags');
      }
      
      return member;
    } else if (code === 404) {
      logDetailed('❌ CONTACTO NO ENCONTRADO en Mailchimp');
      logDetailed('Response: ' + response.getContentText());
      return null;
    } else {
      logDetailed('❌ Error al buscar contacto: ' + response.getContentText());
      return null;
    }
    
  } catch (error) {
    logDetailed('❌ Excepción al verificar contacto: ' + error.toString());
    return null;
  }
}

function debugMailchimpSend() {
  const ui = SpreadsheetApp.getUi();
  
  if (CONFIG.MAILCHIMP_LIST_ID === 'TU_LIST_ID_AQUI') {
    ui.alert('⚠️ CONFIGURACIÓN INCOMPLETA\n\n' +
             'Debes obtener tu List ID primero:\n' +
             '1. Ve al menú: Obtener List ID de Mailchimp\n' +
             '2. Copia el ID de la lista que quieras usar\n' +
             '3. Pégalo en CONFIG.MAILCHIMP_LIST_ID');
    return;
  }
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME_DATA);
  const lastRow = sheet.getLastRow();
  
  if (lastRow < 2) {
    ui.alert('❌ No hay datos para probar');
    return;
  }
  
  logDetailed('═══════════════════════════════════════════');
  logDetailed('🔍 INICIANDO DEBUG DE MAILCHIMP');
  logDetailed('═══════════════════════════════════════════');
  logDetailed('Fecha: ' + new Date().toISOString());
  
  const countBefore = getMailchimpMemberCount();
  if (countBefore) {
    logDetailed('\n📊 CONTANDO CONTACTOS EN MAILCHIMP (ANTES)');
    logDetailed('Total de miembros: ' + countBefore.total);
    logDetailed('Suscritos: ' + countBefore.subscribed);
  }
  
  try {
    logDetailed('\n📋 PASO 1: VERIFICANDO CONFIGURACIÓN');
    logDetailed('Mailchimp Server: ' + CONFIG.MAILCHIMP_SERVER);
    logDetailed('List ID: ' + CONFIG.MAILCHIMP_LIST_ID);
    
    logDetailed('\n📊 PASO 2: OBTENIENDO DATOS DE FILA ' + lastRow);
    const rowData = sheet.getRange(lastRow, 1, 1, CONFIG.COLUMNS.INSIGHT + 1).getValues()[0];
    const userData = extractUserData(rowData);
    const insight = rowData[CONFIG.COLUMNS.INSIGHT];
    
    logDetailed('Email: "' + userData.email + '"');
    logDetailed('Insight length: ' + (insight ? insight.length : 0) + ' chars');
    
    const emailNormalizado = userData.email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(emailNormalizado)) {
      throw new Error('Email inválido: ' + userData.email);
    }
    
    const subscriberHash = generateMD5Hash(emailNormalizado);
    logDetailed('\n🔐 Hash MD5: ' + subscriberHash);
    
    logDetailed('\n🏷️ VERIFICANDO MERGE FIELDS (3 campos)');
    ensureMergeFieldExists();
    
    logDetailed('\n📤 ENVIANDO A MAILCHIMP CON 3 PARTES');
    const updated = updateMailchimpMergeField(emailNormalizado, insight, userData);
    
    if (updated) {
      addMailchimpTag(emailNormalizado, CONFIG.TAG_PENDIENTE);

      ui.alert('✅ ÉXITO\n\n' +
               'Email: ' + emailNormalizado + '\n' +
               'El insight se dividió en 3 partes\n' +
               'Tag añadido: ' + CONFIG.TAG_PENDIENTE + '\n\n' +
               'Revisa los logs para ver los detalles.');
      
      Utilities.sleep(2000);
      const member = checkIfMemberExists(emailNormalizado);
      if (member && member.status === 'subscribed') {
        logDetailed('\n✅ VERIFICACIÓN FINAL: CONTACTO CONFIRMADO EN MAILCHIMP');
      }
    } else {
      ui.alert('❌ ERROR\n\nNo se pudo actualizar Mailchimp.\nRevisa los logs.');
    }
    
  } catch (error) {
    logDetailed('\n❌ EXCEPCIÓN CAPTURADA');
    logDetailed('Error: ' + error.toString());
    ui.alert('❌ ERROR\n\n' + error.toString());
  }
  
  logDetailed('\n═══════════════════════════════════════════');
  logDetailed('🏁 FIN DEL DEBUG');
  logDetailed('═══════════════════════════════════════════');
}

function generateMD5Hash(email) {
  const emailBytes = Utilities.newBlob(email).getBytes();
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, emailBytes);
  
  let hash = '';
  for (let i = 0; i < digest.length; i++) {
    const byte = digest[i];
    if (byte < 0) {
      hash += ('0' + (byte + 256).toString(16)).slice(-2);
    } else {
      hash += ('0' + byte.toString(16)).slice(-2);
    }
  }
  
  return hash;
}

function logDetailed(message) {
  Logger.log(message);
  console.log(message);
}

// ============================================================================
// LEER PROMPTS DESDE HOJA "Prompts"
// ============================================================================

function getPromptsFromSheet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const promptsSheet = ss.getSheetByName(CONFIG.SHEET_NAME_PROMPTS);
    
    if (!promptsSheet) {
      throw new Error('No se encontró la hoja "Prompts".');
    }
    
    const systemPrompt = promptsSheet.getRange('D2').getValue();
    const userPromptTemplate = promptsSheet.getRange('D3').getValue();
    const arbolDecision = promptsSheet.getRange('D4').getValue();
    
    if (!systemPrompt || !userPromptTemplate) {
      throw new Error('Las celdas D2 y D3 de la hoja "Prompts" están vacías.');
    }
    
    return {
      systemPrompt: systemPrompt,
      userPromptTemplate: userPromptTemplate,
      arbolDecision: arbolDecision || ''
    };
    
  } catch (error) {
    Logger.log('Error al leer prompts: ' + error.toString());
    throw error;
  }
}

// ============================================================================
// FUNCIONES CON BOTONES - GENERAR INSIGHTS
// ============================================================================

function generateInsightsForSelection() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME_DATA);
  const selection = sheet.getActiveRange();
  
  if (!selection) {
    ui.alert('❌ Selecciona las filas que deseas procesar.');
    return;
  }
  
  const firstRow = selection.getRow();
  const numRows = selection.getNumRows();
  
  const response = ui.alert(
    'Generar Insights',
    `¿Generar insights para ${numRows} fila(s)?\nFilas: ${firstRow} a ${firstRow + numRows - 1}`,
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;
  
  let processed = 0;
  let errors = 0;
  
  for (let i = 0; i < numRows; i++) {
    try {
      if (processRowInsight(sheet, firstRow + i)) {
        processed++;
      } else {
        errors++;
      }
    } catch (error) {
      Logger.log(`Error fila ${firstRow + i}: ${error}`);
      errors++;
    }
    Utilities.sleep(500);
  }
  
  ui.alert('✅ Completado', `Generados: ${processed}\nErrores: ${errors}`, ui.ButtonSet.OK);
}

function generateInsightsForEmptyRows() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME_DATA);
  const lastRow = sheet.getLastRow();
  
  const emptyRows = [];
  for (let i = 2; i <= lastRow; i++) {
    if (!sheet.getRange(i, CONFIG.COLUMNS.INSIGHT + 1).getValue()) {
      emptyRows.push(i);
    }
  }
  
  if (emptyRows.length === 0) {
    ui.alert('ℹ️ No hay filas pendientes');
    return;
  }
  
  const response = ui.alert(
    'Generar Insights Masivo',
    `${emptyRows.length} filas sin insight.\n¿Procesar todas?`,
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;
  
  let processed = 0;
  let errors = 0;
  
  for (let i = 0; i < emptyRows.length; i++) {
    try {
      if (processRowInsight(sheet, emptyRows[i])) {
        processed++;
      } else {
        errors++;
      }
    } catch (error) {
      Logger.log(`Error fila ${emptyRows[i]}: ${error}`);
      errors++;
    }
    Utilities.sleep(1000);
  }
  
  ui.alert('✅ Completado', `Generados: ${processed}\nErrores: ${errors}`, ui.ButtonSet.OK);
}

function processRowInsight(sheet, rowNumber) {
  try {
    const insightCell = sheet.getRange(rowNumber, CONFIG.COLUMNS.INSIGHT + 1);
    if (insightCell.getValue() !== '') {
      Logger.log(`Fila ${rowNumber}: Ya tiene insight`);
      return false;
    }

    const rowData = sheet.getRange(rowNumber, 1, 1, CONFIG.COLUMNS.PERFILADO + 1).getValues()[0];
    const userData = extractUserData(rowData);

    if (!userData.email || !userData.email.includes('@')) {
      Logger.log(`Fila ${rowNumber}: Email inválido`);
      return false;
    }

    // ========== GENERAR PERFILADO PRIMERO ==========
    const perfilado = generarPerfilado(userData);
    const perfiladoCell = sheet.getRange(rowNumber, CONFIG.COLUMNS.PERFILADO + 1);
    perfiladoCell.setValue(perfilado);
    Logger.log(`✅ Fila ${rowNumber}: Perfilado generado - ${perfilado}`);

    // ========== GENERAR INSIGHT DESPUÉS ==========
    const ratios = calculateRatios(userData);
    const insight = generateInsight(userData, ratios);

    if (insight && insight.length > 50) {
      insightCell.setValue(insight);
      Logger.log(`✅ Fila ${rowNumber}: Insight generado`);

        // Crear/actualizar contacto en Mailchimp solo con tag
      Utilities.sleep(1000);
      const created = createOrUpdateMailchimpContact(userData.email, userData);
      if (created) {
        addMailchimpTag(userData.email, CONFIG.TAG_PENDIENTE);
        Logger.log(`✅ Fila ${rowNumber}: Contacto en Mailchimp con tag ${CONFIG.TAG_PENDIENTE}`);
      } else {
        Logger.log(`⚠️ Fila ${rowNumber}: Error al crear contacto en Mailchimp`);
      }
      return true;
    }

    return false;

  } catch (error) {
    Logger.log(`❌ Error fila ${rowNumber}: ${error}`);
    return false;
  }
}

// ============================================================================
// FUNCIONES CON BOTONES - ENVIAR A MAILCHIMP
// ============================================================================

function sendToMailchimpSelection() {
  const ui = SpreadsheetApp.getUi();
  
  if (CONFIG.MAILCHIMP_LIST_ID === 'TU_LIST_ID_AQUI') {
    ui.alert('⚠️ CONFIGURACIÓN INCOMPLETA\n\n' +
             'Debes configurar tu List ID primero:\n' +
             '1. Ve al menú: Obtener List ID de Mailchimp\n' +
             '2. Copia el ID y actualiza CONFIG.MAILCHIMP_LIST_ID');
    return;
  }
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME_DATA);
  const selection = sheet.getActiveRange();
  
  if (!selection) {
    ui.alert('❌ Selecciona las filas que deseas enviar.');
    return;
  }
  
  const firstRow = selection.getRow();
  const numRows = selection.getNumRows();
  
  const response = ui.alert(
    'Enviar a Mailchimp',
    `¿Enviar ${numRows} contacto(s) a Mailchimp?\nFilas: ${firstRow} a ${firstRow + numRows - 1}`,
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;
  
  ensureMergeFieldExists();
  
  let sent = 0;
  let errors = 0;
  let details = [];
  
  for (let i = 0; i < numRows; i++) {
    try {
      const result = processRowMailchimp(sheet, firstRow + i);
      if (result.success) {
        sent++;
        details.push(`✅ Fila ${firstRow + i}: ${result.email}`);
      } else {
        errors++;
        details.push(`❌ Fila ${firstRow + i}: ${result.error}`);
      }
    } catch (error) {
      Logger.log(`Error fila ${firstRow + i}: ${error}`);
      errors++;
      details.push(`❌ Fila ${firstRow + i}: ${error.toString()}`);
    }
    Utilities.sleep(500);
  }
  
  Logger.log(details.join('\n'));
  ui.alert('✅ Completado', `Enviados: ${sent}\nErrores: ${errors}\n\nRevisa los logs para detalles.`, ui.ButtonSet.OK);
}

function sendToMailchimpAll() {
  const ui = SpreadsheetApp.getUi();
  
  if (CONFIG.MAILCHIMP_LIST_ID === 'TU_LIST_ID_AQUI') {
    ui.alert('⚠️ CONFIGURACIÓN INCOMPLETA\n\n' +
             'Debes configurar tu List ID primero.');
    return;
  }
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME_DATA);
  const lastRow = sheet.getLastRow();
  
  const rowsWithInsight = [];
  for (let i = 2; i <= lastRow; i++) {
    if (sheet.getRange(i, CONFIG.COLUMNS.INSIGHT + 1).getValue()) {
      rowsWithInsight.push(i);
    }
  }
  
  if (rowsWithInsight.length === 0) {
    ui.alert('ℹ️ No hay filas con insights');
    return;
  }
  
  const response = ui.alert(
    'Enviar Todo a Mailchimp',
    `${rowsWithInsight.length} contactos con insights.\n¿Enviar todos?`,
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) return;
  
  ensureMergeFieldExists();
  
  let sent = 0;
  let errors = 0;
  
  for (let i = 0; i < rowsWithInsight.length; i++) {
    try {
      const result = processRowMailchimp(sheet, rowsWithInsight[i]);
      if (result.success) {
        sent++;
      } else {
        errors++;
      }
    } catch (error) {
      Logger.log(`Error fila ${rowsWithInsight[i]}: ${error}`);
      errors++;
    }
    Utilities.sleep(1000);
  }
  
  ui.alert('✅ Completado', `Enviados: ${sent}\nErrores: ${errors}`, ui.ButtonSet.OK);
}

function processRowMailchimp(sheet, rowNumber) {
  try {
    logDetailed(`\n🔄 Procesando fila ${rowNumber}`);
    
    const rowData = sheet.getRange(rowNumber, 1, 1, CONFIG.COLUMNS.INSIGHT + 1).getValues()[0];
    const userData = extractUserData(rowData);
    const insight = rowData[CONFIG.COLUMNS.INSIGHT];
    
    logDetailed(`Email: ${userData.email}`);
    logDetailed(`Insight length: ${insight ? insight.length : 0}`);
    
    if (!userData.email || !userData.email.includes('@')) {
      logDetailed(`❌ Email inválido`);
      return { success: false, error: 'Email inválido', email: userData.email };
    }
    
    if (!insight || insight === '') {
      logDetailed(`❌ Sin insight`);
      return { success: false, error: 'Sin insight', email: userData.email };
    }
    
    const updated = updateMailchimpMergeField(userData.email, insight, userData);

    if (updated) {
      addMailchimpTag(userData.email, CONFIG.TAG_PENDIENTE);
      logDetailed(`✅ Enviado exitosamente con tag: ${CONFIG.TAG_PENDIENTE}`);
      return { success: true, email: userData.email };
    }
    
    logDetailed(`❌ Error al actualizar`);
    return { success: false, error: 'Error al actualizar Mailchimp', email: userData.email };
    
  } catch (error) {
    logDetailed(`❌ Excepción: ${error}`);
    return { success: false, error: error.toString(), email: 'desconocido' };
  }
}

// ============================================================================
// TRIGGER AUTOMÁTICO
// ============================================================================

function onFormSubmit(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME_DATA);
    const lastRow = sheet.getLastRow();
    const insightCell = sheet.getRange(lastRow, CONFIG.COLUMNS.INSIGHT + 1);

    if (insightCell.getValue() !== '') {
      Logger.log('Esta fila ya tiene insight');
      return;
    }

    const rowData = sheet.getRange(lastRow, 1, 1, CONFIG.COLUMNS.PERFILADO + 1).getValues()[0];
    const userData = extractUserData(rowData);

    // ========== GENERAR PERFILADO PRIMERO ==========
    const perfilado = generarPerfilado(userData);
    const perfiladoCell = sheet.getRange(lastRow, CONFIG.COLUMNS.PERFILADO + 1);
    perfiladoCell.setValue(perfilado);
    Logger.log('✅ Perfilado generado: ' + perfilado);

    // ========== GENERAR INSIGHT DESPUÉS ==========
    const ratios = calculateRatios(userData);
    const insight = generateInsight(userData, ratios);

    insightCell.setValue(insight);

    const email = rowData[CONFIG.COLUMNS.EMAIL];
    if (email && email.includes('@')) {
      Utilities.sleep(2000);
        const created = createOrUpdateMailchimpContact(email, userData);
      if (created) {
        addMailchimpTag(email, CONFIG.TAG_PENDIENTE);
       Logger.log('✅ Contacto en Mailchimp con tag ' + CONFIG.TAG_PENDIENTE + ': ' + email);
      }
    }

  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
  }
}

// ============================================================================
// EXTRACCIÓN Y CÁLCULO DE DATOS
// ============================================================================

function extractUserData(rowData) {
  return {
    email: rowData[CONFIG.COLUMNS.EMAIL],
    edad: rowData[CONFIG.COLUMNS.EDAD],
    genero: rowData[CONFIG.COLUMNS.GENERO],
    situacion_laboral: rowData[CONFIG.COLUMNS.SITUACION_LABORAL],
    gastos_para: rowData[CONFIG.COLUMNS.GASTOS_PARA],
    unidad_familiar: rowData[CONFIG.COLUMNS.UNIDAD_FAMILIAR],
    satisfaccion_financiera: rowData[CONFIG.COLUMNS.SATISFACCION],
    preocupacion_dinero: rowData[CONFIG.COLUMNS.PREOCUPACION_DINERO],
    llegar_fin_mes: rowData[CONFIG.COLUMNS.LLEGAR_FIN_MES],
    estabilidad: rowData[CONFIG.COLUMNS.ESTABILIDAD],
    control_dinero: rowData[CONFIG.COLUMNS.CONTROL_DINERO],
    temas_preocupan: rowData[CONFIG.COLUMNS.TEMAS_PREOCUPAN],
    lo_que_necesitas: rowData[CONFIG.COLUMNS.LO_QUE_NECESITAS],
    ingresos_brutos: rowData[CONFIG.COLUMNS.INGRESOS_BRUTOS],
    porcentaje_ahorro: rowData[CONFIG.COLUMNS.PORCENTAJE_AHORRO],
    colchon_liquido: rowData[CONFIG.COLUMNS.COLCHON_LIQUIDO],
    vivienda_principal: rowData[CONFIG.COLUMNS.VIVIENDA_PRINCIPAL],
    gasto_vivienda: rowData[CONFIG.COLUMNS.GASTO_VIVIENDA],
    porcentaje_deuda: rowData[CONFIG.COLUMNS.PORCENTAJE_DEUDA],
    capacidad_recorte: rowData[CONFIG.COLUMNS.CAPACIDAD_RECORTE],
    ocupacion_finanzas: rowData[CONFIG.COLUMNS.OCUPACION_FINANZAS],
    como_ahorras: rowData[CONFIG.COLUMNS.COMO_AHORRAS],
    control_gastos: rowData[CONFIG.COLUMNS.CONTROL_GASTOS],
    presupuesto: rowData[CONFIG.COLUMNS.PRESUPUESTO],
    manejo_imprevistos: rowData[CONFIG.COLUMNS.MANEJO_IMPREVISTOS]
  };
}

// ============================================================================
// FUNCIÓN DE PERFILADO
// ============================================================================

/**
 * Genera el perfil financiero del usuario antes de crear insights
 * Evalúa múltiples variables: colchón, ahorro, vivienda, deuda, inversión
 */
function generarPerfilado(userData) {
  const perfil = {
    colchon: '',
    ahorro: '',
    vivienda: '',
    deuda: '',
    ahorro_inversion: ''
  };

  // ========== EVALUACIÓN DEL COLCHÓN (PREGUNTA 3 + 5) ==========
  const situacionLaboral = userData.situacion_laboral || '';
  const colchonLiquido = userData.colchon_liquido || '';
  const gastosPara = userData.gastos_para || '';

  // Normalizar texto para comparación
  const situacionNorm = situacionLaboral.toLowerCase();

  // Determinar si es ESTÁNDAR o requiere más colchón
  const esCuentaAjena = situacionNorm.includes('cuenta ajena');
  const esJubilado = situacionNorm.includes('jubilado');
  const esFuncionario = situacionNorm.includes('funcionario');
  const esCuentaPropia = situacionNorm.includes('cuenta propia');
  const noEstaTrabajando = situacionNorm.includes('no estoy trabajando');

  if (esCuentaAjena || esJubilado || esFuncionario) {
    // COLCHÓN ESTÁNDAR
    if (colchonLiquido === 'Mejor ni preguntes' || colchonLiquido === 'Menos de 3 meses de ingresos netos') {
      perfil.colchon = 'Mal';
    } else if (colchonLiquido === 'Entre 3 y 6 meses de ingresos netos') {
      perfil.colchon = 'Bien';
    } else if (colchonLiquido === 'Más de 6 meses de ingresos netos') {
      perfil.colchon = 'Super bien';
    }
  } else if (esCuentaPropia) {
    // COLCHÓN PARA AUTÓNOMOS (más exigente)
    if (colchonLiquido === 'Mejor ni preguntes' ||
        colchonLiquido === 'Menos de 3 meses de ingresos netos' ||
        colchonLiquido === 'Entre 3 y 6 meses de ingresos netos') {
      perfil.colchon = 'Mal';
    } else if (colchonLiquido === 'Más de 6 meses de ingresos netos') {
      perfil.colchon = 'Bien';
    }
  } else if (noEstaTrabajando) {
    // Depende de si es para unidad familiar o solo para él
    const gastosFamiliar = gastosPara && gastosPara.toLowerCase().includes('unidad familiar');

    if (gastosFamiliar) {
      // Aplicar clasificación estándar
      if (colchonLiquido === 'Mejor ni preguntes' || colchonLiquido === 'Menos de 3 meses de ingresos netos') {
        perfil.colchon = 'Mal';
      } else if (colchonLiquido === 'Entre 3 y 6 meses de ingresos netos') {
        perfil.colchon = 'Bien';
      } else if (colchonLiquido === 'Más de 6 meses de ingresos netos') {
        perfil.colchon = 'Super bien';
      }
    } else {
      // Solo para mí - impacta en capacidad de reacción (criterio más estricto, similar a autónomos)
      if (colchonLiquido === 'Mejor ni preguntes' ||
          colchonLiquido === 'Menos de 3 meses de ingresos netos' ||
          colchonLiquido === 'Entre 3 y 6 meses de ingresos netos') {
        perfil.colchon = 'Mal - Capacidad de reacción limitada';
      } else if (colchonLiquido === 'Más de 6 meses de ingresos netos') {
        perfil.colchon = 'Bien';
      }
    }
  }

  // ========== EVALUACIÓN SEGÚN TIPO DE VIVIENDA (PREGUNTA 23) ==========
  const viviendaPrincipal = userData.vivienda_principal || '';
  const porcentajeAhorro = userData.porcentaje_ahorro || '';
  const gastoVivienda = userData.gasto_vivienda || '';

  if (viviendaPrincipal.includes('hipoteca')) {
    // ===== HIPOTECA =====
    // Evaluar ahorro
    if (porcentajeAhorro === 'No ahorro nada' || porcentajeAhorro === 'Menos del 10%') {
      perfil.ahorro = 'Mal';
    } else if (porcentajeAhorro === 'Entre el 10% y el 30%') {
      perfil.ahorro = 'Bien';
    } else if (porcentajeAhorro === 'Entre el 30% y el 40%' || porcentajeAhorro === 'Más del 40%') {
      perfil.ahorro = 'Super bien';
    }

    // Evaluar gasto de vivienda
    if (gastoVivienda === 'Más del 50% de mis ingresos netos' ||
        gastoVivienda === 'Entre el 40% y el 50% de mis ingresos netos') {
      perfil.vivienda = 'Mal';
    } else if (gastoVivienda === 'Entre el 33% y el 40% de mis ingresos netos') {
      perfil.vivienda = 'Bien';
    } else if (gastoVivienda === 'Menos de un tercio (33%) de mis ingresos netos') {
      perfil.vivienda = 'Super bien';
    }

  } else if (viviendaPrincipal.includes('alquiler')) {
    // ===== ALQUILER =====
    // Evaluar ahorro (criterios más estrictos)
    if (porcentajeAhorro === 'No ahorro nada' ||
        porcentajeAhorro === 'Menos del 10%' ||
        porcentajeAhorro === 'Entre el 10% y el 30%') {
      perfil.ahorro = 'Mal';
    } else if (porcentajeAhorro === 'Entre el 30% y el 40%') {
      perfil.ahorro = 'Bien';
    } else if (porcentajeAhorro === 'Más del 40%') {
      perfil.ahorro = 'Super bien';
    }

    // Evaluar gasto de vivienda (criterios más estrictos)
    if (gastoVivienda === 'Más del 50% de mis ingresos netos' ||
        gastoVivienda === 'Entre el 40% y el 50% de mis ingresos netos' ||
        gastoVivienda === 'Entre el 33% y el 40% de mis ingresos netos') {
      perfil.vivienda = 'Mal';
    } else if (gastoVivienda === 'Menos de un tercio (33%) de mis ingresos netos') {
      perfil.vivienda = 'Bien';
    }

  } else if (viviendaPrincipal.includes('pagado') || viviendaPrincipal.includes('pagada')) {
    // ===== VIVIENDA PAGADA =====
    // Evaluar ahorro (muy estricto)
    if (porcentajeAhorro === 'No ahorro nada' ||
        porcentajeAhorro === 'Menos del 10%' ||
        porcentajeAhorro === 'Entre el 10% y el 30%' ||
        porcentajeAhorro === 'Entre el 30% y el 40%') {
      perfil.ahorro = 'Mal';
    } else if (porcentajeAhorro === 'Más del 40%') {
      perfil.ahorro = 'Bien';
    }

    // Evaluar gasto de vivienda
    if (gastoVivienda === 'Más del 50% de mis ingresos netos' ||
        gastoVivienda === 'Entre el 40% y el 50% de mis ingresos netos' ||
        gastoVivienda === 'Entre el 33% y el 40% de mis ingresos netos') {
      perfil.vivienda = 'Mal';
    } else if (gastoVivienda === 'Menos de un tercio (33%) de mis ingresos netos') {
      perfil.vivienda = 'Bien';
    }
  }

  // ========== EVALUACIÓN DE DEUDA (PREGUNTA 25) ==========
  const porcentajeDeuda = userData.porcentaje_deuda || '';

  if (porcentajeDeuda === 'Entre el 10% y el 20%' || porcentajeDeuda === 'Más del 20%') {
    perfil.deuda = 'Mal';
  } else if (porcentajeDeuda === 'Menos del 10%') {
    perfil.deuda = 'Bien';
  } else if (porcentajeDeuda === 'No tengo deuda') {
    perfil.deuda = 'Super bien';
  }

  // ========== EVALUACIÓN AHORRO + INVERSIÓN (PREGUNTAS 21 + 26) ==========
  // Convertir ahorro a número
  let valorAhorro = 0;
  if (porcentajeAhorro === 'No ahorro nada') {
    valorAhorro = 0;
  } else if (porcentajeAhorro === 'Menos del 10%') {
    valorAhorro = 5;
  } else if (porcentajeAhorro === 'Entre el 10% y el 30%') {
    valorAhorro = 20;
  } else if (porcentajeAhorro === 'Entre el 30% y el 40%') {
    valorAhorro = 35;
  } else if (porcentajeAhorro === 'Más del 40%') {
    valorAhorro = 40;
  }

  // Convertir capacidad_recorte (asumiendo que es la pregunta de inversión) a número
  const capacidadRecorte = userData.capacidad_recorte || '';
  let valorInversion = 0;

  if (capacidadRecorte === 'No lo sé') {
    valorInversion = 0;
  } else if (capacidadRecorte === 'Menos del 15%') {
    valorInversion = 10;
  } else if (capacidadRecorte === 'Entre el 15% y el 25%') {
    valorInversion = 20;
  } else if (capacidadRecorte === 'Entre el 25% y el 40%') {
    valorInversion = 33;
  } else if (capacidadRecorte === 'Más del 40%') {
    valorInversion = 40;
  }

  const totalAhorroInversion = valorAhorro + valorInversion;

  if (totalAhorroInversion > 40) {
    perfil.ahorro_inversion = 'Muy bien';
  } else if (totalAhorroInversion >= 25 && totalAhorroInversion <= 40) {
    perfil.ahorro_inversion = 'Bien';
  } else {
    perfil.ahorro_inversion = 'Mal';
  }

  // ========== GENERAR RESUMEN DEL PERFIL ==========
  const resumenPerfil = `Colchón: ${perfil.colchon} | Ahorro: ${perfil.ahorro} | Vivienda: ${perfil.vivienda} | Deuda: ${perfil.deuda} | Ahorro+Inversión: ${perfil.ahorro_inversion}`;

  logDetailed('\n🎯 PERFILADO GENERADO:');
  logDetailed(resumenPerfil);

  return resumenPerfil;
}

function calculateRatios(userData) {
  // Ya no calculamos ratios numéricos, solo pasamos los datos originales
  // para que el modelo de IA haga la estimación del estado financiero
  const ratios = {
    porcentaje_ahorro: userData.porcentaje_ahorro || 'No especificado',
    colchon_liquido: userData.colchon_liquido || 'No especificado',
    gasto_vivienda: userData.gasto_vivienda || 'No especificado',
    porcentaje_deuda: userData.porcentaje_deuda || 'No especificado',
    capacidad_recorte: userData.capacidad_recorte || 'No especificado',
    ingresos_brutos: userData.ingresos_brutos || 'No especificado',
    es_cuenta_ajena: userData.situacion_laboral === 'Trabajo por cuenta ajena'
  };

  return ratios;
}

// Las funciones de parsing y cálculo han sido eliminadas
// ya que ahora se pasan los datos originales directamente al prompt
// para que el modelo de IA haga la estimación del estado financiero

// ============================================================================
// GENERACIÓN DE INSIGHT CON OPENAI
// ============================================================================

function generateInsight(userData, ratios) {
  try {
    const prompts = getPromptsFromSheet();
    const userPrompt = buildUserPromptFromTemplate(prompts.userPromptTemplate, userData, ratios);
    
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
            content: prompts.systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
      muteHttpExceptions: true
    });
    
    const result = JSON.parse(response.getContentText());
    
    if (result.error) {
      Logger.log('Error OpenAI API: ' + JSON.stringify(result.error));
      return 'Error al generar insight: ' + result.error.message;
    }
    
    return result.choices[0].message.content;
    
  } catch (error) {
    Logger.log('Error OpenAI: ' + error.toString());
    return 'Error al generar insight. Revisa los logs.';
  }
}

function buildUserPromptFromTemplate(template, userData, ratios) {
  const umbralColchon = ratios.es_cuenta_ajena ?
    '- Colchón mínimo: 3 meses | Recomendable: 6 meses' :
    '- Colchón mínimo: 6 meses | Recomendable: 12 meses';

  // Soportar tanto ${variable} como {{variable}}
  return template
    // Variables de userData
    .replace(/\$\{userData\.edad\}/g, userData.edad || 'No especificado')
    .replace(/\{\{userData\.edad\}\}/g, userData.edad || 'No especificado')
    .replace(/\$\{userData\.situacion_laboral\}/g, userData.situacion_laboral || 'No especificado')
    .replace(/\{\{userData\.situacion_laboral\}\}/g, userData.situacion_laboral || 'No especificado')
    .replace(/\$\{userData\.unidad_familiar\}/g, userData.unidad_familiar || 'No especificado')
    .replace(/\{\{userData\.unidad_familiar\}\}/g, userData.unidad_familiar || 'No especificado')
    .replace(/\$\{userData\.satisfaccion_financiera\}/g, userData.satisfaccion_financiera || 'No especificado')
    .replace(/\{\{userData\.satisfaccion_financiera\}\}/g, userData.satisfaccion_financiera || 'No especificado')
    .replace(/\$\{userData\.preocupacion_dinero\}/g, userData.preocupacion_dinero || 'No especificado')
    .replace(/\{\{userData\.preocupacion_dinero\}\}/g, userData.preocupacion_dinero || 'No especificado')
    .replace(/\$\{userData\.llegar_fin_mes\}/g, userData.llegar_fin_mes || 'No especificado')
    .replace(/\{\{userData\.llegar_fin_mes\}\}/g, userData.llegar_fin_mes || 'No especificado')
    .replace(/\$\{userData\.temas_preocupan\}/g, userData.temas_preocupan || 'No especificado')
    .replace(/\{\{userData\.temas_preocupan\}\}/g, userData.temas_preocupan || 'No especificado')
    .replace(/\$\{userData\.lo_que_necesitas\}/g, userData.lo_que_necesitas || 'No especificado')
    .replace(/\{\{userData\.lo_que_necesitas\}\}/g, userData.lo_que_necesitas || 'No especificado')
    .replace(/\$\{userData\.control_gastos\}/g, userData.control_gastos || 'No especificado')
    .replace(/\{\{userData\.control_gastos\}\}/g, userData.control_gastos || 'No especificado')
    .replace(/\$\{userData\.presupuesto\}/g, userData.presupuesto || 'No especificado')
    .replace(/\{\{userData\.presupuesto\}\}/g, userData.presupuesto || 'No especificado')
    .replace(/\$\{userData\.ocupacion_finanzas\}/g, userData.ocupacion_finanzas || 'No especificado')
    .replace(/\{\{userData\.ocupacion_finanzas\}\}/g, userData.ocupacion_finanzas || 'No especificado')
    .replace(/\$\{userData\.como_ahorras\}/g, userData.como_ahorras || 'No especificado')
    .replace(/\{\{userData\.como_ahorras\}\}/g, userData.como_ahorras || 'No especificado')
    .replace(/\$\{userData\.vivienda_principal\}/g, userData.vivienda_principal || 'No especificado')
    .replace(/\{\{userData\.vivienda_principal\}\}/g, userData.vivienda_principal || 'No especificado')
    .replace(/\$\{userData\.ingresos_brutos\}/g, userData.ingresos_brutos || 'No especificado')
    .replace(/\{\{userData\.ingresos_brutos\}\}/g, userData.ingresos_brutos || 'No especificado')
    .replace(/\$\{userData\.porcentaje_ahorro\}/g, userData.porcentaje_ahorro || 'No especificado')
    .replace(/\{\{userData\.porcentaje_ahorro\}\}/g, userData.porcentaje_ahorro || 'No especificado')
    .replace(/\$\{userData\.colchon_liquido\}/g, userData.colchon_liquido || 'No especificado')
    .replace(/\{\{userData\.colchon_liquido\}\}/g, userData.colchon_liquido || 'No especificado')
    .replace(/\$\{userData\.gasto_vivienda\}/g, userData.gasto_vivienda || 'No especificado')
    .replace(/\{\{userData\.gasto_vivienda\}\}/g, userData.gasto_vivienda || 'No especificado')
    .replace(/\$\{userData\.porcentaje_deuda\}/g, userData.porcentaje_deuda || 'No especificado')
    .replace(/\{\{userData\.porcentaje_deuda\}\}/g, userData.porcentaje_deuda || 'No especificado')
    .replace(/\$\{userData\.capacidad_recorte\}/g, userData.capacidad_recorte || 'No especificado')
    .replace(/\{\{userData\.capacidad_recorte\}\}/g, userData.capacidad_recorte || 'No especificado')
    // Variables de ratios (ahora con datos de texto originales)
    .replace(/\$\{ratios\.porcentaje_ahorro\}/g, ratios.porcentaje_ahorro)
    .replace(/\{\{ratios\.porcentaje_ahorro\}\}/g, ratios.porcentaje_ahorro)
    .replace(/\{\{porcentaje_ahorro\}\}/g, ratios.porcentaje_ahorro)
    .replace(/\$\{ratios\.ratio_ahorro\}/g, ratios.porcentaje_ahorro)
    .replace(/\{\{ratios\.ratio_ahorro\}\}/g, ratios.porcentaje_ahorro)
    .replace(/\{\{ratio_ahorro\}\}/g, ratios.porcentaje_ahorro)
    .replace(/\$\{ratios\.colchon_liquido\}/g, ratios.colchon_liquido)
    .replace(/\{\{ratios\.colchon_liquido\}\}/g, ratios.colchon_liquido)
    .replace(/\{\{colchon_liquido\}\}/g, ratios.colchon_liquido)
    .replace(/\$\{ratios\.meses_colchon\}/g, ratios.colchon_liquido)
    .replace(/\{\{ratios\.meses_colchon\}\}/g, ratios.colchon_liquido)
    .replace(/\{\{meses_colchon\}\}/g, ratios.colchon_liquido)
    .replace(/\$\{ratios\.gasto_vivienda\}/g, ratios.gasto_vivienda)
    .replace(/\{\{ratios\.gasto_vivienda\}\}/g, ratios.gasto_vivienda)
    .replace(/\{\{gasto_vivienda\}\}/g, ratios.gasto_vivienda)
    .replace(/\$\{ratios\.ratio_vivienda\}/g, ratios.gasto_vivienda)
    .replace(/\{\{ratios\.ratio_vivienda\}\}/g, ratios.gasto_vivienda)
    .replace(/\{\{ratio_vivienda\}\}/g, ratios.gasto_vivienda)
    .replace(/\$\{ratios\.porcentaje_deuda\}/g, ratios.porcentaje_deuda)
    .replace(/\{\{ratios\.porcentaje_deuda\}\}/g, ratios.porcentaje_deuda)
    .replace(/\{\{porcentaje_deuda\}\}/g, ratios.porcentaje_deuda)
    .replace(/\$\{ratios\.ratio_deuda\}/g, ratios.porcentaje_deuda)
    .replace(/\{\{ratios\.ratio_deuda\}\}/g, ratios.porcentaje_deuda)
    .replace(/\{\{ratio_deuda\}\}/g, ratios.porcentaje_deuda)
    .replace(/\$\{ratios\.capacidad_recorte\}/g, ratios.capacidad_recorte)
    .replace(/\{\{ratios\.capacidad_recorte\}\}/g, ratios.capacidad_recorte)
    .replace(/\{\{capacidad_recorte\}\}/g, ratios.capacidad_recorte)
    .replace(/\$\{ratios\.capacidad_reaccion\}/g, ratios.capacidad_recorte)
    .replace(/\{\{ratios\.capacidad_reaccion\}\}/g, ratios.capacidad_recorte)
    .replace(/\{\{capacidad_reaccion\}\}/g, ratios.capacidad_recorte)
    .replace(/\$\{ratios\.ingresos_brutos\}/g, ratios.ingresos_brutos)
    .replace(/\{\{ratios\.ingresos_brutos\}\}/g, ratios.ingresos_brutos)
    .replace(/\{\{ingresos_brutos\}\}/g, ratios.ingresos_brutos)
    .replace(/\$\{ratios\.ingresos_netos_mensuales\}/g, ratios.ingresos_brutos)
    .replace(/\{\{ratios\.ingresos_netos_mensuales\}\}/g, ratios.ingresos_brutos)
    .replace(/\{\{ingresos_netos_mensuales\}\}/g, ratios.ingresos_brutos)
    .replace(/\$\{ratios\.es_cuenta_ajena \? [^}]*\}/g, umbralColchon)
    .replace(/\{\{umbral_colchon\}\}/g, umbralColchon);
}

// ============================================================================
// INTEGRACIÓN MAILCHIMP SIMPLIFICADA - SOLO CONTACTOS Y TAGS
// ============================================================================

/**
 * Crea o actualiza un contacto en Mailchimp (sin enviar insights)
 * Solo crea el contacto básico con nombre
 */
function createOrUpdateMailchimpContact(email, userData) {
  try {
    const emailNormalizado = email.toLowerCase().trim();
    const subscriberHash = generateMD5Hash(emailNormalizado);

    logDetailed('📧 Email: ' + emailNormalizado);
    logDetailed('🔐 Hash: ' + subscriberHash);

    const url = `https://${CONFIG.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${CONFIG.MAILCHIMP_LIST_ID}/members/${subscriberHash}`;

    const emailName = emailNormalizado.split('@')[0];
    const firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

    const payload = {
      email_address: emailNormalizado,
      status_if_new: 'subscribed',
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName
      }
    };

    logDetailed('📦 Creando/actualizando contacto básico en Mailchimp');

    const options = {
      method: 'put',
      headers: {
        'Authorization': 'Bearer ' + CONFIG.MAILCHIMP_API_KEY,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();

    logDetailed('📊 Response Code: ' + responseCode);

    if (responseCode === 200) {
      const result = JSON.parse(response.getContentText());
      logDetailed('✅ Contacto creado/actualizado - Status: ' + result.status);
      return true;
    } else {
      logDetailed('❌ Error Mailchimp: ' + response.getContentText());
      return false;
    }

  } catch (error) {
    logDetailed('❌ Excepción Mailchimp: ' + error.toString());
    return false;
  }
}

// ============================================================================
// DIVISIÓN DE INSIGHT EN 3 PARTES (NUEVA FUNCIONALIDAD)
// ============================================================================

function dividirInsightParaMailchimp(insightCompleto) {
  if (!insightCompleto || insightCompleto.trim() === '') {
    return {
      parte1: '',
      parte2: '',
      parte3: ''
    };
  }
  
  try {
    // Limpiar el texto: quitar markdown y mantener solo texto plano
    let textoLimpio = insightCompleto
      .replace(/^# .*$/gm, '') // Quitar títulos
      .replace(/\*\*(.*?)\*\*/g, '$1') // Quitar negritas
      .replace(/---/g, '') // Quitar separadores
      .replace(/\n{3,}/g, '\n\n') // Normalizar saltos de línea
      .trim();
    
    // Detectar los 4 bloques
    const bloquePattern = /\[BLOQUE \d+[:\]]/gi;
    const partes = textoLimpio.split(bloquePattern);
    
    // Si no encuentra los bloques, dividir por párrafos
    if (partes.length < 5) {
      logDetailed('⚠️ No se encontraron los 4 bloques, dividiendo por párrafos...');
      return dividirPorParrafos(textoLimpio);
    }
    
    const bloque1 = partes[1] ? partes[1].trim() : '';
    const bloque2 = partes[2] ? partes[2].trim() : '';
    const bloque3 = partes[3] ? partes[3].trim() : '';
    const bloque4 = partes[4] ? partes[4].trim() : '';
    
    // Parte 1: BLOQUE 1
    let parte1 = bloque1;
    
    // Parte 2: BLOQUE 2
    let parte2 = bloque2;
    
    // Parte 3: BLOQUES 3 + 4 + disclaimer
    let parte3 = bloque3;
    if (bloque4) {
      parte3 += '\n\n' + bloque4;
    }
    
    // Añadir disclaimer
    parte3 += '\n\n---\n\nWeavers | Tu plataforma de bienestar financiero\n\nEste diagnóstico es orientativo y se basa en las respuestas proporcionadas. No constituye asesoramiento financiero personalizado.';
    
    // Verificar límites
    parte1 = truncarSiNecesario(parte1, 250, 'Parte 1');
    parte2 = truncarSiNecesario(parte2, 250, 'Parte 2');
    parte3 = truncarSiNecesario(parte3, 250, 'Parte 3');
    
    logDetailed('✅ Insight dividido en 3 partes:');
    logDetailed('  Parte 1: ' + parte1.length + ' chars');
    logDetailed('  Parte 2: ' + parte2.length + ' chars');
    logDetailed('  Parte 3: ' + parte3.length + ' chars');
    
    return {
      parte1: parte1,
      parte2: parte2,
      parte3: parte3
    };
    
  } catch (error) {
    logDetailed('❌ Error al dividir insight: ' + error.toString());
    return dividirPorParrafos(insightCompleto);
  }
}

function dividirPorParrafos(texto) {
  const parrafos = texto.split(/\n\n+/).filter(p => p.trim().length > 0);
  
  const totalParrafos = parrafos.length;
  const tercio = Math.ceil(totalParrafos / 3);
  
  const parte1 = parrafos.slice(0, tercio).join('\n\n');
  const parte2 = parrafos.slice(tercio, tercio * 2).join('\n\n');
  const parte3 = parrafos.slice(tercio * 2).join('\n\n');
  
  logDetailed('⚠️ División por párrafos (fallback):');
  logDetailed('  Parte 1: ' + parte1.length + ' chars');
  logDetailed('  Parte 2: ' + parte2.length + ' chars');
  logDetailed('  Parte 3: ' + parte3.length + ' chars');
  
  return {
    parte1: truncarSiNecesario(parte1, 250, 'Parte 1'),
    parte2: truncarSiNecesario(parte2, 250, 'Parte 2'),
    parte3: truncarSiNecesario(parte3, 250, 'Parte 3')
  };
}

function truncarSiNecesario(texto, maxChars, nombreParte) {
  if (texto.length <= maxChars) {
    return texto;
  }
  
  logDetailed('⚠️ ' + nombreParte + ' supera ' + maxChars + ' chars (' + texto.length + '), truncando...');
  
  const textoCorto = texto.substring(0, maxChars);
  const ultimoPunto = textoCorto.lastIndexOf('.');
  
  if (ultimoPunto > maxChars * 0.7) {
    return textoCorto.substring(0, ultimoPunto + 1).trim();
  }
  
  return textoCorto.substring(0, maxChars - 3).trim() + '...';
}

// ============================================================================
// INTEGRACIÓN MAILCHIMP - VERSIÓN MODIFICADA CON 3 CAMPOS
// ============================================================================

function ensureMergeFieldExists() {
  try {
    logDetailed('🔍 Verificando merge fields (3 campos)...');
    
    const url = `https://${CONFIG.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${CONFIG.MAILCHIMP_LIST_ID}/merge-fields`;
    
    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + CONFIG.MAILCHIMP_API_KEY,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() !== 200) {
      logDetailed('❌ Error al obtener merge fields: ' + response.getContentText());
      return null;
    }
    
    const result = JSON.parse(response.getContentText());
    
    const campo1 = result.merge_fields.find(field => field.tag === 'INSIGHT1');
    const campo2 = result.merge_fields.find(field => field.tag === 'INSIGHT2');
    const campo3 = result.merge_fields.find(field => field.tag === 'INSIGHT3');
    
    let creados = 0;
    
    if (!campo1) {
      logDetailed('⚠️ INSIGHT1 no existe, creando...');
      createMergeFieldCustom('INSIGHT1', 'Insight Parte 1');
      creados++;
    } else {
      logDetailed('✅ INSIGHT1 existe');
    }
    
    if (!campo2) {
      logDetailed('⚠️ INSIGHT2 no existe, creando...');
      createMergeFieldCustom('INSIGHT2', 'Insight Parte 2');
      creados++;
    } else {
      logDetailed('✅ INSIGHT2 existe');
    }
    
    if (!campo3) {
      logDetailed('⚠️ INSIGHT3 no existe, creando...');
      createMergeFieldCustom('INSIGHT3', 'Insight Parte 3');
      creados++;
    } else {
      logDetailed('✅ INSIGHT3 existe');
    }
    
    if (creados > 0) {
      logDetailed('✅ ' + creados + ' campos creados');
    }
    
    return true;
    
  } catch (error) {
    logDetailed('❌ Error verificar merge fields: ' + error);
    return false;
  }
}

function createMergeFieldCustom(tag, name) {
  try {
    const url = `https://${CONFIG.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${CONFIG.MAILCHIMP_LIST_ID}/merge-fields`;
    
    const payload = {
      tag: tag,
      name: name,
      type: 'text',
      required: false,
      public: false
    };
    
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + CONFIG.MAILCHIMP_API_KEY,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    
    const code = response.getResponseCode();
    
    if (code === 200 || code === 201) {
      logDetailed('✅ Merge field creado: ' + tag);
      return true;
    } else {
      logDetailed('❌ Error crear ' + tag + ': ' + response.getContentText());
      return false;
    }
    
  } catch (error) {
    logDetailed('❌ Error crear ' + tag + ': ' + error);
    return false;
  }
}

function updateMailchimpMergeField(email, insightContent, userData) {
  try {
    const emailNormalizado = email.toLowerCase().trim();
    const subscriberHash = generateMD5Hash(emailNormalizado);
    
    logDetailed('📧 Email: ' + emailNormalizado);
    logDetailed('🔐 Hash: ' + subscriberHash);
    
    const url = `https://${CONFIG.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${CONFIG.MAILCHIMP_LIST_ID}/members/${subscriberHash}`;
    
    // ✨ DIVIDIR EL INSIGHT EN 3 PARTES (TEXTO PLANO)
    const partes = dividirInsightParaMailchimp(insightContent);
    
    const emailName = emailNormalizado.split('@')[0];
    const firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
    
    const mergeFields = {
      FNAME: firstName,
      INSIGHT1: partes.parte1,
      INSIGHT2: partes.parte2,
      INSIGHT3: partes.parte3
    };
    
    const payload = {
      email_address: emailNormalizado,
      status_if_new: 'subscribed',
      status: 'subscribed',
      merge_fields: mergeFields
    };
    
    logDetailed('📦 Payload preparado con 3 partes (texto plano)');
    
    const options = {
      method: 'put',
      headers: {
        'Authorization': 'Bearer ' + CONFIG.MAILCHIMP_API_KEY,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    logDetailed('📊 Response Code: ' + responseCode);
    
    if (responseCode === 200) {
      const result = JSON.parse(responseText);
      logDetailed('✅ Mailchimp actualizado - Status: ' + result.status);
      
      Utilities.sleep(500);
      activarConsentimientoGDPR(emailNormalizado, subscriberHash);
      
      return true;
    } else {
      logDetailed('❌ Error Mailchimp: ' + responseText);
      return false;
    }
    
  } catch (error) {
    logDetailed('❌ Excepción Mailchimp: ' + error.toString());
    return false;
  }
}

function activarConsentimientoGDPR(email, subscriberHash) {
  try {
    const memberUrl = `https://${CONFIG.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${CONFIG.MAILCHIMP_LIST_ID}/members/${subscriberHash}`;
    
    const getMemberResponse = UrlFetchApp.fetch(memberUrl, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + CONFIG.MAILCHIMP_API_KEY
      },
      muteHttpExceptions: true
    });
    
    if (getMemberResponse.getResponseCode() !== 200) {
      logDetailed('⚠️ No se pudo obtener datos para GDPR');
      return false;
    }
    
    const memberData = JSON.parse(getMemberResponse.getContentText());
    
    if (!memberData.marketing_permissions || memberData.marketing_permissions.length === 0) {
      logDetailed('ℹ️ No hay marketing permissions configurados');
      return false;
    }
    
    const marketingPermissions = memberData.marketing_permissions.map(permission => ({
      marketing_permission_id: permission.marketing_permission_id,
      enabled: true
    }));
    
    const updatePayload = {
      marketing_permissions: marketingPermissions
    };
    
    const updateResponse = UrlFetchApp.fetch(memberUrl, {
      method: 'patch',
      headers: {
        'Authorization': 'Bearer ' + CONFIG.MAILCHIMP_API_KEY,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(updatePayload),
      muteHttpExceptions: true
    });
    
    if (updateResponse.getResponseCode() === 200) {
      logDetailed('✅ GDPR activado');
      return true;
    } else {
      logDetailed('⚠️ Error al activar GDPR: ' + updateResponse.getContentText());
      return false;
    }
    
  } catch (error) {
    logDetailed('❌ Error en GDPR: ' + error.toString());
    return false;
  }
}

function addMailchimpTag(email, tagName) {
  try {
    const emailNormalizado = email.toLowerCase().trim();
    const subscriberHash = generateMD5Hash(emailNormalizado);

    const tagUrl = `https://${CONFIG.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${CONFIG.MAILCHIMP_LIST_ID}/members/${subscriberHash}/tags`;

    const payload = {
      tags: [{
        name: tagName,
        status: 'active'
      }]
    };

    const options = {
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + CONFIG.MAILCHIMP_API_KEY,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(tagUrl, options);

    if (response.getResponseCode() === 204) {
      logDetailed('✅ Tag añadido: ' + tagName);
      return true;
    } else {
      logDetailed('⚠️ Error al añadir tag: ' + response.getContentText());
      return false;
    }

  } catch (error) {
    logDetailed('❌ Error tag: ' + error);
    return false;
  }
}

function removeMailchimpTag(email, tagName) {
  try {
    const emailNormalizado = email.toLowerCase().trim();
    const subscriberHash = generateMD5Hash(emailNormalizado);

    const tagUrl = `https://${CONFIG.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${CONFIG.MAILCHIMP_LIST_ID}/members/${subscriberHash}/tags`;

    const payload = {
      tags: [{
        name: tagName,
        status: 'inactive'
      }]
    };

    const options = {
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + CONFIG.MAILCHIMP_API_KEY,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(tagUrl, options);

    if (response.getResponseCode() === 204) {
      logDetailed('✅ Tag eliminado: ' + tagName);
      return true;
    } else {
      logDetailed('⚠️ Error al eliminar tag: ' + response.getContentText());
      return false;
    }

  } catch (error) {
    logDetailed('❌ Error al eliminar tag: ' + error);
    return false;
  }
}

// ============================================================================
// FUNCIONES PARA ENVIAR EMAILS CON GMAIL
// ============================================================================

function enviarEmailsSelection() {
  const ui = SpreadsheetApp.getUi();

  if (CONFIG.PLANTILLA_HTML_FILE_ID === 'TU_FILE_ID_AQUI') {
    ui.alert('⚠️ CONFIGURACIÓN INCOMPLETA\n\n' +
             'Debes configurar PLANTILLA_HTML_FILE_ID en CONFIG');
    return;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME_DATA);
  const selection = sheet.getActiveRange();

  if (!selection) {
    ui.alert('❌ Selecciona las filas cuyos emails deseas enviar.');
    return;
  }

  const firstRow = selection.getRow();
  const numRows = selection.getNumRows();

  const response = ui.alert(
    'Enviar Emails',
    `¿Enviar ${numRows} email(s) con insights?\nFilas: ${firstRow} a ${firstRow + numRows - 1}`,
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  let sent = 0;
  let errors = 0;
  let details = [];

  for (let i = 0; i < numRows; i++) {
    try {
      const result = processRowEmail(sheet, firstRow + i);
      if (result.success) {
        sent++;
        details.push(`✅ Fila ${firstRow + i}: ${result.email}`);
      } else {
        errors++;
        details.push(`❌ Fila ${firstRow + i}: ${result.error}`);
      }
    } catch (error) {
      Logger.log(`Error fila ${firstRow + i}: ${error}`);
      errors++;
      details.push(`❌ Fila ${firstRow + i}: ${error.toString()}`);
    }
    Utilities.sleep(1000); // Evitar límite de rate
  }

  Logger.log(details.join('\n'));
  ui.alert('✅ Completado', `Enviados: ${sent}\nErrores: ${errors}\n\nRevisa los logs para detalles.`, ui.ButtonSet.OK);
}

function enviarEmailsAllPendientes() {
  const ui = SpreadsheetApp.getUi();

  if (CONFIG.PLANTILLA_HTML_FILE_ID === 'TU_FILE_ID_AQUI') {
    ui.alert('⚠️ CONFIGURACIÓN INCOMPLETA\n\n' +
             'Debes configurar PLANTILLA_HTML_FILE_ID en CONFIG');
    return;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME_DATA);
  const lastRow = sheet.getLastRow();

  // Buscar todas las filas con insight
  const rowsWithInsight = [];
  for (let i = 2; i <= lastRow; i++) {
    const insight = sheet.getRange(i, CONFIG.COLUMNS.INSIGHT + 1).getValue();
    if (insight && insight.trim() !== '') {
      rowsWithInsight.push(i);
    }
  }

  if (rowsWithInsight.length === 0) {
    ui.alert('ℹ️ No hay filas con insights para enviar');
    return;
  }

  const response = ui.alert(
    'Enviar Emails a Todos',
    `${rowsWithInsight.length} contactos con insights.\n¿Enviar emails a todos?`,
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  let sent = 0;
  let errors = 0;

  for (let i = 0; i < rowsWithInsight.length; i++) {
    try {
      const result = processRowEmail(sheet, rowsWithInsight[i]);
      if (result.success) {
        sent++;
      } else {
        errors++;
      }
    } catch (error) {
      Logger.log(`Error fila ${rowsWithInsight[i]}: ${error}`);
      errors++;
    }
    Utilities.sleep(1000); // Evitar límite de rate
  }

  ui.alert('✅ Completado', `Enviados: ${sent}\nErrores: ${errors}`, ui.ButtonSet.OK);
}

function processRowEmail(sheet, rowNumber) {
  try {
    logDetailed(`\n📧 Procesando envío de email fila ${rowNumber}`);

    const rowData = sheet.getRange(rowNumber, 1, 1, CONFIG.COLUMNS.INSIGHT + 1).getValues()[0];
    const userData = extractUserData(rowData);
    const insight = rowData[CONFIG.COLUMNS.INSIGHT];

    logDetailed(`Email: ${userData.email}`);
    logDetailed(`Insight length: ${insight ? insight.length : 0}`);

    if (!userData.email || !userData.email.includes('@')) {
      logDetailed(`❌ Email inválido`);
      return { success: false, error: 'Email inválido', email: userData.email };
    }

    if (!insight || insight.trim() === '') {
      logDetailed(`❌ Sin insight`);
      return { success: false, error: 'Sin insight', email: userData.email };
    }

    // Enviar email usando la función de "Envio de emails.js"
    const emailSent = enviarEmailInsight(userData.email, insight, userData);

    if (emailSent) {
      // Actualizar tags en Mailchimp
      removeMailchimpTag(userData.email, CONFIG.TAG_PENDIENTE);
      addMailchimpTag(userData.email, CONFIG.TAG_ENVIADO);

      logDetailed(`✅ Email enviado y tags actualizados`);
      return { success: true, email: userData.email };
    }

    logDetailed(`❌ Error al enviar email`);
    return { success: false, error: 'Error al enviar email', email: userData.email };

  } catch (error) {
    logDetailed(`❌ Excepción: ${error}`);
    return { success: false, error: error.toString(), email: 'desconocido' };
  }
}

// ============================================================================
// FUNCIONES DE CONFIGURACIÓN Y PRUEBA
// ============================================================================

function setupTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onFormSubmit()
    .create();
  
  ensureMergeFieldExists();
  
  SpreadsheetApp.getUi().alert('✅ Trigger configurado!\n\nYa funciona automáticamente con los 3 campos de insight.');
}

function testScript() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME_DATA);
  const lastRow = sheet.getLastRow();

  const rowData = sheet.getRange(lastRow, 1, 1, CONFIG.COLUMNS.PERFILADO + 1).getValues()[0];
  const userData = extractUserData(rowData);

  Logger.log('=== DATOS EXTRAÍDOS ===');
  Logger.log('Email: ' + userData.email);
  Logger.log('Edad: ' + userData.edad);
  Logger.log('Situación laboral: ' + userData.situacion_laboral);

  Logger.log('\n=== PERFILADO ===');
  const perfilado = generarPerfilado(userData);
  Logger.log('Perfil: ' + perfilado);

  const ratios = calculateRatios(userData);
  Logger.log('\n=== RATIOS CALCULADOS ===');
  Logger.log(JSON.stringify(ratios, null, 2));

  const insight = generateInsight(userData, ratios);
  Logger.log('\n=== INSIGHT GENERADO ===');
  Logger.log(insight);

  if (userData.email) {
    Logger.log('\n=== ENVIANDO A MAILCHIMP (3 PARTES) ===');
    ensureMergeFieldExists();
    const result = updateMailchimpMergeField(userData.email, insight, userData);
    Logger.log('Resultado: ' + (result ? 'ÉXITO' : 'ERROR'));
  }

  SpreadsheetApp.getUi().alert('✅ Prueba completada\n\nPerfilado y insight generados.\nEl insight se dividió en 3 partes.\nRevisa los logs (Ver > Registros de ejecución)');
}

function testMergeFieldCreation() {
  const result = ensureMergeFieldExists();
  
  if (result) {
    SpreadsheetApp.getUi().alert('✅ Merge fields OK!\n\nUsa *|INSIGHT1|*, *|INSIGHT2|*, *|INSIGHT3|* en Mailchimp.');
  } else {
    SpreadsheetApp.getUi().alert('❌ Error. Revisa los logs.');
  }
}

function testMailchimpConnection() {
  try {
    const url = `https://${CONFIG.MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${CONFIG.MAILCHIMP_LIST_ID}`;
    
    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + CONFIG.MAILCHIMP_API_KEY,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    });
    
    const code = response.getResponseCode();
    
    if (code === 200) {
      const result = JSON.parse(response.getContentText());
      SpreadsheetApp.getUi().alert(
        '✅ Conexión exitosa\n\n' +
        'Lista: ' + result.name + '\n' +
        'Miembros: ' + result.stats.member_count
      );
    } else {
      SpreadsheetApp.getUi().alert(
        '❌ Error de conexión\n\n' +
        'Código: ' + code + '\n' +
        'Respuesta: ' + response.getContentText()
      );
    }
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('❌ Error: ' + error.toString());
  }
}
